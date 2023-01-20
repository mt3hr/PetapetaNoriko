package ppmk

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"strings"

	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
)

func init() {
	cobra.MousetrapHelpText = "" // Windowsでマウスから起動しても怒られないようにする
	cmd.AddCommand(serverCmd)
	cmd.PersistentFlags().StringVarP(&proxy, "proxy", "x", proxy, "proxy")
	cmd.PersistentFlags().Uint16VarP(&port, "port", "p", port, "port")
	cmd.PersistentFlags().BoolVarP(&shareViewSystem, "share_view_system", "s", shareViewSystem,
		`share_view_system
		環境変数を設定して起動してください
		PPMK_EMAIL_HOSTNAME: パスワードリセット用メールのホスト名
		PPMK_EMAIL_PORT:     パスワードリセット用メールのポート番号
		PPMK_EMAIL_USERNAME: パスワードリセット用メールのユーザ名
		PPMK_EMAIL_PASSWORD: パスワードリセット用メールのパスワード`)
	cmd.PersistentFlags().StringVarP(&dbfilename, "dbfilename", "d", dbfilename, "dbfilename")
}

var (
	//go:embed embed
	htmlFS embed.FS // htmlファイル郡

	port            = uint16(51520)
	proxy           = ""
	shareViewSystem = false
	dbfilename      = "ppmk.db"
	serverStatus    = ServerStatus{}

	serverCmd = &cobra.Command{
		Use: "server",
		PersistentPreRun: func(_ *cobra.Command, _ []string) {
		},
		Run: func(_ *cobra.Command, _ []string) {
			if err := launchServer(); err != nil {
				log.Fatal(err)
			}
		},
	}
	cmd = &cobra.Command{
		Use: "ppmk",
		PersistentPreRun: func(_ *cobra.Command, _ []string) {
			if proxy != "" {

				proxyUrl, err := url.Parse(proxy)
				if err != nil {
					panic(err)
				}
				http.DefaultTransport = &http.Transport{
					Proxy: http.ProxyURL(proxyUrl),
				}
			}

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
				address += ":" + fmt.Sprintf("%d", port)

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
				err = a.Start()
				if err != nil {
					panic(err)
				}

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
				err = w.Create()
				if err != nil {
					panic(err)
				}

				err = w.ExecuteJavaScript(`// aタグがクリックされた時にelectronで開かず、デフォルトのブラウザで開く
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
				if err != nil {
					panic(err)
				}

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
	serverStatus.ShareViewSystem = shareViewSystem
	router := mux.NewRouter()

	html, err := fs.Sub(htmlFS, "embed/dist")
	if err != nil {
		return err
	}
	if shareViewSystem {
		ppmkDB, err := newPPMKDB(dbfilename)
		if err != nil {
			panic(err)
		}

		applyShareViewSystem(router, ppmkDB)
	}

	router.PathPrefix(statusAddress).HandlerFunc(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		encoder := json.NewEncoder(w)
		encoder.Encode(serverStatus)
	}))

	hf := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		http.FileServer(http.FS(html)).ServeHTTP(w, r)
	})

	router.PathPrefix("/reset_password").Handler(http.StripPrefix("/reset_password", hf))
	router.PathPrefix("/login").Handler(http.StripPrefix("/login", hf))
	router.PathPrefix("/register").Handler(http.StripPrefix("/login", hf))
	router.PathPrefix("/").Handler(hf)

	var handler http.Handler = router
	err = http.ListenAndServe(":"+fmt.Sprintf("%d", port), handler)
	if err != nil {
		err = fmt.Errorf("failed to launch server: %w", err)
		return err
	}
	return nil
}

type ServerStatus struct {
	ShareViewSystem bool `json:"share_view_system"`
}
