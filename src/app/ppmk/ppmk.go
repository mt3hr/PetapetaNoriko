package ppmk

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"strconv"
	"strings"

	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
)

var (
	//go:embed dist
	htmlFS embed.FS // htmlファイル郡

	port = 51520
	cmd  = &cobra.Command{
		Use: "rykv",
		PersistentPreRun: func(_ *cobra.Command, _ []string) {
		},
		Run: func(_ *cobra.Command, _ []string) {
			interceptCh := make(chan os.Signal)
			func() {
				signal.Notify(interceptCh, os.Interrupt)
				go func() {
					<-interceptCh
					os.Exit(0)
				}()
				go func() {
					err := launchServer()
					if err != nil {
						log.Fatal(err)
					}
				}()

				address := ""
				address += "http://localhost"
				address += ":" + strconv.Itoa(port)

				// Initialize astilectron
				a, err := astilectron.New(nil, astilectron.Options{
					AppName:            "ppmk",
					VersionAstilectron: "0.51.0",
					VersionElectron:    "22.0.0",
				})
				if err != nil {
					log.Fatal(err)
				}
				defer a.Close()

				// Start astilectron
				a.Start()

				contextIsolation := false
				// Create a new window
				w, err := a.NewWindow(address, &astilectron.WindowOptions{
					Height: astikit.IntPtr(1200),
					Width:  astikit.IntPtr(1500),
					WebPreferences: &astilectron.WebPreferences{
						AllowRunningInsecureContent: &contextIsolation,
					},
				})
				if err != nil {
					err = fmt.Errorf("error at new window: %w", err)
					log.Fatal(err)
				}

				openInDefaultBrowserMessagePrefix := "open_in_default_browser:"
				w.OnMessage(func(m *astilectron.EventMessage) interface{} {
					msg := ""
					m.Unmarshal(&msg)

					if strings.HasPrefix(msg, openInDefaultBrowserMessagePrefix) {
						url := strings.TrimSpace(strings.TrimPrefix(msg, openInDefaultBrowserMessagePrefix))
						openbrowser(url)
						return nil
					}
					return nil
				})
				w.Create()
				w.ExecuteJavaScript(`// aタグがクリックされた時にelectronで開かず、デフォルトのブラウザで開く
document.addEventListener('click', (e) => {
  for (let i = 0; i < e.path.length; i++) {
    let element = e.path[i]
	if (element.tagName === 'A') {
	    let aTag = element
	    let href = aTag.href
	    if (!href.startsWith('blob:')) {
          e.preventDefault()
          astilectron.sendMessage('` + openInDefaultBrowserMessagePrefix + ` ' + href)
	    }
	}
  }
})
`)

				// Blocking pattern
				a.Wait()
			}()
			os.Exit(0)
		},
	}
)

func Execute() {
	if err := cmd.Execute(); err != nil {
		log.Fatal(err)
	}
}

func openbrowser(url string) error {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	return err
}

func launchServer() error {
	router := mux.NewRouter()

	html, err := fs.Sub(htmlFS, "dist")
	if err != nil {
		return err
	}
	router.PathPrefix("/").Handler(http.FileServer(http.FS(html)))

	var handler http.Handler = router
	err = http.ListenAndServe(":"+strconv.Itoa(port), handler)
	if err != nil {
		err = fmt.Errorf("failed to launch server: %w", err)
		return err
	}
	return nil
}
