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
	cmd.PersistentFlags().BoolVarP(&loginSystem, "login_system", "s", loginSystem,
		`login_system
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

	port         = uint16(51520)
	proxy        = ""
	loginSystem  = false
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
	if loginSystem {
		initializeSystemVariable()
	}

	serverStatus.EnableRegister = register
	serverStatus.LoginSystem = loginSystem
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
	if loginSystem {
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
	/*
		ln, err := net.Listen("tcp4", ":"+fmt.Sprintf("%d", port))
		if err != nil {
			panic(err)
		}
		return http.Serve(ln, handler)
	*/
	err = http.ListenAndServe(":"+fmt.Sprintf("%d", port), handler)
	if err != nil {
		err = fmt.Errorf("failed to launch server: %w", err)
		return err
	}
	return nil
}

type ServerStatus struct {
	LoginSystem         bool `json:"login_system"`
	EnableResetPassword bool `json:"enable_reset_password"`
	EnableRegister      bool `json:"enable_register"`
}
