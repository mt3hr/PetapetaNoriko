package ppmk

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"

	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
)

func init() {
	cobra.MousetrapHelpText = "" // Windowsでマウスから起動しても怒られないようにする
	cmd.PersistentFlags().StringVarP(&proxy, "proxy", "x", proxy, "proxy")
	cmd.PersistentFlags().Uint16VarP(&port, "port", "p", port, "port")
	cmd.PersistentFlags().BoolVarP(&register, "register", "r", register, "register")
	cmd.PersistentFlags().BoolVarP(&system, "system", "s", system,
		`system
		環境変数を設定して起動してください
		PPMK_EMAIL_HOSTNAME: パスワードリセット用メールのホスト名
		PPMK_EMAIL_PORT:     パスワードリセット用メールのポート番号
		PPMK_EMAIL_USERNAME: パスワードリセット用メールのユーザ名
		PPMK_EMAIL_PASSWORD: パスワードリセット用メールのパスワード
		PPMK_EMAIL_LAN: ローカルエリアアドレスを使用する場合はtrueを設定`)
	cmd.PersistentFlags().StringVarP(&dbfilename, "db_filename", "d", dbfilename, "dbfilename")
}

var (
	//go:embed embed
	htmlFS embed.FS // htmlファイル郡

	port         = uint16(51520)
	proxy        = ""
	system       = false
	dbfilename   = "ppmk.db"
	register     = false
	serverStatus = ServerStatus{}
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
	if system {
		initializeSystemVariable()
	}

	serverStatus.EnableRegister = register
	serverStatus.LoginSystem = system
	serverStatus.EnableResetPassword = serverStatus.LoginSystem &&
		(emailhostname != "" &&
			emailport != 0 &&
			emailusername != "" &&
			emailpassword != "")
	router := mux.NewRouter()

	html, err := fs.Sub(htmlFS, "embed/dist")
	if err != nil {
		return err
	}
	if system {
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

	router.PathPrefix(resetPasswordAddress).Handler(http.StripPrefix(resetPasswordAddress, hf))
	router.PathPrefix("/").Handler(hf)

	var handler http.Handler = router
	err = http.ListenAndServe(":"+fmt.Sprintf("%d", port), handler)
	if err != nil {
		err = fmt.Errorf("failed to launch server: %w", err)
		return err
	}
	return nil
}

func getGlobalIPAddress() (string, error) {
	httpbinOrgIP := "http://httpbin.org/ip"
	res, err := http.Get(httpbinOrgIP)
	if err != nil {
		err = fmt.Errorf("error at http get %s: %w", httpbinOrgIP, err)
		return "", err
	}
	defer res.Body.Close()

	ip := &struct {
		IP string `json:"origin"`
	}{}
	err = json.NewDecoder(res.Body).Decode(ip)
	if err != nil {
		err = fmt.Errorf("error at response decode to json: %w", err)
		return "", err
	}
	return ip.IP, nil
}

type ServerStatus struct {
	LoginSystem         bool `json:"login_system"`
	EnableResetPassword bool `json:"enable_reset_password"`
	EnableRegister      bool `json:"enable_register"`
}
