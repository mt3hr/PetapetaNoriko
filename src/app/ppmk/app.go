//go:build !server

package ppmk

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"

	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	"github.com/spf13/cobra"
)

var (
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
					AppIconDefaultPath: "C:/Users/yamat/Git/PutPullMock/src/app/ppmk/favicon.png",
					AppIconDarwinPath: "C:/Users/yamat/Git/PutPullMock/src/app/ppmk/favicon.ico",
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
