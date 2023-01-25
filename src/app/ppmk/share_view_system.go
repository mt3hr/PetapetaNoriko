package ppmk

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"net/smtp"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

type GetUserIDFromSessionIDRequest struct {
	SessionID string `json:"session_id"`
}

type GetUserIDFromSessionIDResponse struct {
	UserID string `json:"user_id"`
	Error  string `json:"error"`
}

type GetUserNameFromUserIDRequest struct {
	SessionID string `json:"session_id"`
	UserID    string `json:"user_id"`
}

type GetUserNameFromUserIDResponse struct {
	UserName string `json:"user_name"`
	Error    string `json:"error"`
}

type LoginRequest struct {
	Email           string `json:"email"`
	PasswordHashMd5 string `json:"password_hash_md5"`
}

type LoginResponse struct {
	SessionId string `json:"session_id"`
	Error     string `json:"error"`
}

type LogoutRequest struct {
	SessionId string `json:"session_id"`
}

type ResetPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordResponse struct {
	Error string `json:"error"`
}

type RegisterRequest struct {
	Email           string `json:"email"`
	PasswordHashMd5 string `json:"password_hash_md5"`
	UserName        string `json:"user_name"`
}

type RegisterResponse struct {
	Error string `json:"error"`
}

type ListProjectSummariesRequest struct {
	SessionID string `json:"session_id"`
}

type ListProjectSummariesResponse struct {
	ProjectSummaries []*PPMKProjectSummary `json:"project_summaries"`
	Error            string                `json:"error"`
}

type GetProjectDataRequest struct {
	SessionID     string `json:"session_id"`
	ProjectDataID string `json:"project_data_id"`
}

type GetProjectDataResponse struct {
	ProjectData *PPMKProjectData `json:"project_data"`
	Error       string           `json:"error"`
}

type SaveProjectDataRequest struct {
	SessionID string   `json:"session_id"`
	Project   *Project `json:"project"`
}

type SaveProjectDataResponse struct {
	Error string `json:"error"`
}

type DeleteProjectDataRequest struct {
	SessionID string   `json:"session_id"`
	Project   *Project `json:"project"`
}

type DeleteProjectDataResponse struct {
	Error string `json:"error"`
}

type UpdateProjectDataRequest struct {
	SessionID string   `json:"session_id"`
	Project   *Project `json:"project"`
}

type UpdateProjectDataResponse struct {
	Error string `json:"error"`
}

type DeleteProjectRequest struct {
	SessionID string   `json:"session_id"`
	Project   *Project `json:"project"`
}

type DeleteProjectResponse struct {
	Error string `json:"error"`
}

type UpdateProjectRequest struct {
	SessionID string   `json:"session_id"`
	Project   *Project `json:"project"`
}

type UpdateProjectResponse struct {
	Error string `json:"error"`
}

type AddProjectShareRequest struct {
	SessionID    string            `json:"session_id"`
	ProjectShare *PPMKProjectShare `json:"project_share"`
}

type AddProjectShareResponse struct {
	Error string `json:"error"`
}

type DeleteProjectShareRequest struct {
	SessionID    string            `json:"session_id"`
	ProjectShare *PPMKProjectShare `json:"project_share"`
}

type DeleteProjectShareResponse struct {
	Error string `json:"error"`
}

type UpdateProjectShareRequest struct {
	SessionID    string            `json:"session_id"`
	ProjectShare *PPMKProjectShare `json:"project_share"`
}

type UpdateProjectShareResponse struct {
	Error string `json:"error"`
}

const (
	TimeLayout = time.RFC3339

	statusAddress                 = "/ppmk_server/status"
	loginAddress                  = "/ppmk_server/login"
	logoutAddress                 = "/ppmk_server/logout"
	resetPasswordAddress          = "/ppmk_server/reset_password"
	registerAddress               = "/ppmk_server/register"
	listProjectSummariesAddress   = "/ppmk_server/list_project_summaries"
	getProjectDataAddress         = "/ppmk_server/get_project_data"
	saveProjectDataAddress        = "/ppmk_server/save_project_data"
	deleteProjectDataAddress      = "/ppmk_server/delete_project_data"
	updateProjectDataAddress      = "/ppmk_server/update_project_data"
	deleteProjectAddress          = "/ppmk_server/delete_project"
	updateProjectAddress          = "/ppmk_server/update_project"
	addProjectShareAddress        = "/ppmk_server/add_project_share"
	deleteProjectShareAddress     = "/ppmk_server/delete_project_share"
	updateProjectShareAddress     = "/ppmk_server/update_project_share"
	getUserIDFromSessionIDAddress = "/ppmk_server/get_user_id_from_session_id" //TODO
	getUserNameFromUserIDAddress  = "/ppmk_server/get_user_name_from_user_id"  //TODO
)

var (
	emailhostname string
	emailport     uint16
	emailusername string
	emailpassword string
	emailaddress  string
)

func initializeSystemVariable() {
	if !shareViewSystem {
		return
	}
	emailhostname = os.Getenv("PPMK_EMAIL_HOSTNAME")
	emailaddress = os.Getenv("PPMK_EMAIL_ADDRESS")
	emailportUint64, err := strconv.ParseUint(os.Getenv("PPMK_EMAIL_PORT"), 10, 16)
	if err != nil {
		err = fmt.Errorf("PPMK_EMAIL_PORTの値を修正してください %s :%w", os.Getenv("PPMK_EMAIL_PORT"), err)
		// log.Fatal(err)
	}
	emailport = uint16(emailportUint64)
	emailusername = os.Getenv("PPMK_EMAIL_USERNAME")
	emailpassword = os.Getenv("PPMK_EMAIL_PASSWORD")

	fmt.Printf("PPMK_EMAIL_HOSTNAME = %+v\n", emailhostname)
	fmt.Printf("PPMK_EMAIL_ADDRESS = %+v\n", emailaddress)
	fmt.Printf("PPMK_EMAIL_PORT = %+v\n", emailport)
	fmt.Printf("PPMK_EMAIL_USERNAME = %+v\n", emailusername)
	fmt.Printf("PPMK_EMAIL_PASSWORD = %+v\n", "**********")
}

func applyShareViewSystem(router *mux.Router, ppmkDB ppmkDB) {
	router.PathPrefix(loginAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		loginRequest := &LoginRequest{}
		loginResponse := &LoginResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&loginRequest)
		if err != nil {
			loginResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(loginResponse)
			if e != nil {
				loginResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
		if loginResponse == nil {
			w.Write([]byte(""))
			w.WriteHeader(http.StatusNoContent)
			return
		}
		sessionID, err := ppmkDB.Login(r.Context(), loginRequest.Email, loginRequest.PasswordHashMd5)
		if err != nil {
			loginResponse.Error = fmt.Sprintf("ログインに失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(loginResponse)
			if e != nil {
				loginResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
		loginResponse.SessionId = sessionID
		encoder := json.NewEncoder(w)
		err = encoder.Encode(loginResponse)
		if err != nil {
			loginResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))
	router.PathPrefix(logoutAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		logoutRequest := &LogoutRequest{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&logoutRequest)
		if err != nil {
			panic(err)
			return
		}
		err = ppmkDB.Logout(r.Context(), logoutRequest.SessionId)
		if err != nil {
			panic(err)
			return
		}
	}))
	router.PathPrefix(resetPasswordAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		resetPasswordRequest := &ResetPasswordRequest{}
		resetPasswordResponse := &ResetPasswordResponse{}

		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&resetPasswordRequest)
		if err != nil {
			resetPasswordResponse.Error = "エラー" // リクエストデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(resetPasswordResponse)
			if e != nil {
				resetPasswordResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		subject := "PPMK パスワードリセットメール"
		//TODO
		body := "送信テスト"

		err = sendResetPasswordMail(resetPasswordRequest.Email, subject, body)
		if err != nil {
			resetPasswordResponse.Error = "メール送信エラー"
			encoder := json.NewEncoder(w)
			e := encoder.Encode(resetPasswordResponse)
			if e != nil {
				resetPasswordResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		encoder := json.NewEncoder(w)
		err = encoder.Encode(resetPasswordResponse)
		if err != nil {
			resetPasswordResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))
	router.PathPrefix(registerAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		registerRequest := &RegisterRequest{}
		registerResponse := &RegisterResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&registerRequest)
		if err != nil {
			registerResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(registerResponse)
			if e != nil {
				registerResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		user := &User{
			UserID:          uuid.New().String(),
			Email:           registerRequest.Email,
			PasswordHashMD5: registerRequest.PasswordHashMd5,
			UserName:        registerRequest.UserName,
			ResetPasswordID: "",
		}

		err = ppmkDB.AddUser(r.Context(), user)
		if err != nil {
			registerResponse.Error = fmt.Sprintf("ログインに失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(registerResponse)
			if e != nil {
				registerResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
		encoder := json.NewEncoder(w)
		err = encoder.Encode(registerResponse)
		if err != nil {
			registerResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))

	router.PathPrefix(listProjectSummariesAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		listProjectSummariesRequest := &ListProjectSummariesRequest{}
		listProjectSummariesResponse := &ListProjectSummariesResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&listProjectSummariesRequest)
		if err != nil {
			listProjectSummariesResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(listProjectSummariesResponse)
			if e != nil {
				listProjectSummariesResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), listProjectSummariesRequest.SessionID)
		if err != nil {
			listProjectSummariesResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(listProjectSummariesResponse)
			if e != nil {
				listProjectSummariesResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		projectSummaries, err := ppmkDB.GetProjectSummaries(r.Context(), userID)
		if err != nil {
			if err == sql.ErrNoRows {
				listProjectSummariesResponse.ProjectSummaries = []*PPMKProjectSummary{}
				encoder := json.NewEncoder(w)
				e := encoder.Encode(listProjectSummariesResponse)
				if e != nil {
					listProjectSummariesResponse.Error = fmt.Sprintf("サーバ内エラー")
					panic(e)
					return
				}
				return
			}

			listProjectSummariesResponse.Error = fmt.Sprintf("サーバ内エラー")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(listProjectSummariesResponse)
			if e != nil {
				listProjectSummariesResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
		listProjectSummariesResponse.ProjectSummaries = projectSummaries
		encoder := json.NewEncoder(w)
		err = encoder.Encode(listProjectSummariesResponse)
		if err != nil {
			listProjectSummariesResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))

	router.PathPrefix(getProjectDataAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		getProjectDataRequest := &GetProjectDataRequest{}
		getProjectDataResponse := &GetProjectDataResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&getProjectDataRequest)
		if err != nil {
			getProjectDataResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getProjectDataResponse)
			if e != nil {
				getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), getProjectDataRequest.SessionID)
		if err != nil {
			getProjectDataResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getProjectDataResponse)
			if e != nil {
				getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		projectData, err := ppmkDB.GetProjectData(r.Context(), getProjectDataRequest.ProjectDataID)
		if err != nil {
			getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getProjectDataResponse)
			if e != nil {
				getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		// プロジェクトがなかったら作成する
		project, err := ppmkDB.GetProject(r.Context(), projectData.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			getProjectDataResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getProjectDataResponse)
			if e != nil {
				getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), project) //TODO ここおかしいぞ。errがあるときはprojectはnilなはず
			if e != nil {
				getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}

		getProjectDataResponse.ProjectData = projectData
		encoder := json.NewEncoder(w)
		err = encoder.Encode(getProjectDataResponse)
		if err != nil {
			getProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))

	router.PathPrefix(saveProjectDataAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		saveProjectDataRequest := &SaveProjectDataRequest{}
		saveProjectDataResponse := &SaveProjectDataResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&saveProjectDataRequest)
		if err != nil {
			saveProjectDataResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(saveProjectDataResponse)
			if e != nil {
				saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), saveProjectDataRequest.SessionID)
		if err != nil {
			saveProjectDataResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(saveProjectDataResponse)
			if e != nil {
				saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		// プロジェクトがなかったら作成する
		project, err := ppmkDB.GetProject(r.Context(), saveProjectDataRequest.Project.PPMKProject.ProjectID)
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない//嘘乙。//TODO
			e := ppmkDB.AddProject(r.Context(), saveProjectDataRequest.Project.PPMKProject)
			if e != nil {
				saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
			project, err = ppmkDB.GetProject(r.Context(), saveProjectDataRequest.Project.PPMKProject.ProjectID)
			if err != nil {
				saveProjectDataResponse.Error = "サーバ内エラー:プロジェクトの取得に失敗しました"
				encoder := json.NewEncoder(w)
				er := encoder.Encode(saveProjectDataResponse)
				if er != nil {
					saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
					panic(er)
					return
				}
				panic(err)
			}
		}
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			saveProjectDataResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(saveProjectDataResponse)
			if e != nil {
				saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}

		err = ppmkDB.AddProjectData(r.Context(), saveProjectDataRequest.Project.PPMKProjectData)
		if err != nil {
			saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの保存に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(saveProjectDataResponse)
			if e != nil {
				saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
		encoder := json.NewEncoder(w)
		e := encoder.Encode(saveProjectDataResponse)
		if e != nil {
			saveProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(e)
			return
		}

	}))

	router.PathPrefix(deleteProjectDataAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		deleteProjectDataRequest := &DeleteProjectDataRequest{}
		deleteProjectDataResponse := &DeleteProjectDataResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&deleteProjectDataRequest)
		if err != nil {
			deleteProjectDataResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectDataResponse)
			if e != nil {
				deleteProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), deleteProjectDataRequest.SessionID)
		if err != nil {
			deleteProjectDataResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectDataResponse)
			if e != nil {
				deleteProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		// プロジェクトがなかったら作成する
		project, err := ppmkDB.GetProject(r.Context(), deleteProjectDataRequest.Project.PPMKProject.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			deleteProjectDataResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectDataResponse)
			if e != nil {
				deleteProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), deleteProjectDataRequest.Project.PPMKProject)
			if e != nil {
				deleteProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}

		err = ppmkDB.DeleteProjectData(r.Context(), deleteProjectDataRequest.Project.PPMKProjectData.ProjectDataID)
		if err != nil {
			deleteProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの削除に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectDataResponse)
			if e != nil {
				deleteProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
	}))

	router.PathPrefix(updateProjectDataAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		updateProjectDataRequest := &UpdateProjectDataRequest{}
		updateProjectDataResponse := &UpdateProjectDataResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&updateProjectDataRequest)
		if err != nil {
			updateProjectDataResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectDataResponse)
			if e != nil {
				updateProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), updateProjectDataRequest.SessionID)
		if err != nil {
			updateProjectDataResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectDataResponse)
			if e != nil {
				updateProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		// プロジェクトがなかったら作成する
		project, err := ppmkDB.GetProject(r.Context(), updateProjectDataRequest.Project.PPMKProject.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			updateProjectDataResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectDataResponse)
			if e != nil {
				updateProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), updateProjectDataRequest.Project.PPMKProject)
			if e != nil {
				updateProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}

		err = ppmkDB.UpdateProjectData(r.Context(), updateProjectDataRequest.Project.PPMKProjectData)
		if err != nil {
			updateProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトデータの更新に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectDataResponse)
			if e != nil {
				updateProjectDataResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
	}))

	router.PathPrefix(deleteProjectAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		deleteProjectRequest := &DeleteProjectRequest{}
		deleteProjectResponse := &DeleteProjectResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&deleteProjectRequest)
		if err != nil {
			deleteProjectResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectResponse)
			if e != nil {
				deleteProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), deleteProjectRequest.SessionID)
		if err != nil {
			deleteProjectResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectResponse)
			if e != nil {
				deleteProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		// プロジェクトがなかったら作成する
		project, err := ppmkDB.GetProject(r.Context(), deleteProjectRequest.Project.PPMKProject.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			deleteProjectResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectResponse)
			if e != nil {
				deleteProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), deleteProjectRequest.Project.PPMKProject)
			if e != nil {
				deleteProjectResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}

		err = ppmkDB.DeleteProject(r.Context(), deleteProjectRequest.Project.PPMKProject.ProjectID)
		if err != nil {
			deleteProjectResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの削除に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectResponse)
			if e != nil {
				deleteProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
	}))

	router.PathPrefix(updateProjectAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		updateProjectRequest := &UpdateProjectRequest{}
		updateProjectResponse := &UpdateProjectResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&updateProjectRequest)
		if err != nil {
			updateProjectResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectResponse)
			if e != nil {
				updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), updateProjectRequest.SessionID)
		if err != nil {
			updateProjectResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectResponse)
			if e != nil {
				updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		// プロジェクトがなかったら作成する
		project, err := ppmkDB.GetProject(r.Context(), updateProjectRequest.Project.PPMKProject.ProjectID)
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), updateProjectRequest.Project.PPMKProject)
			if e != nil {
				updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			updateProjectResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectResponse)
			if e != nil {
				updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}

		err = ppmkDB.UpdateProject(r.Context(), updateProjectRequest.Project.PPMKProject)
		if err != nil {
			updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの更新に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectResponse)
			if e != nil {
				updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		encoder := json.NewEncoder(w)
		err = encoder.Encode(updateProjectResponse)
		if err != nil {
			updateProjectResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))

	router.PathPrefix(addProjectShareAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		addProjectShareRequest := &AddProjectShareRequest{}
		addProjectShareResponse := &AddProjectShareResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&addProjectShareRequest)
		if err != nil {
			addProjectShareResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(addProjectShareResponse)
			if e != nil {
				addProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), addProjectShareRequest.SessionID)
		if err != nil {
			addProjectShareResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(addProjectShareResponse)
			if e != nil {
				addProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		project, err := ppmkDB.GetProject(r.Context(), addProjectShareRequest.ProjectShare.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			addProjectShareResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(addProjectShareResponse)
			if e != nil {
				addProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			panic(err)
			return
		}

		err = ppmkDB.AddProjectShare(r.Context(), addProjectShareRequest.ProjectShare)
		if err != nil {
			addProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクト共有設定の保存に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(addProjectShareResponse)
			if e != nil {
				addProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
	}))

	router.PathPrefix(deleteProjectShareAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		deleteProjectShareRequest := &DeleteProjectShareRequest{}
		deleteProjectShareResponse := &DeleteProjectShareResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&deleteProjectShareRequest)
		if err != nil {
			deleteProjectShareResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectShareResponse)
			if e != nil {
				deleteProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), deleteProjectShareRequest.SessionID)
		if err != nil {
			deleteProjectShareResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectShareResponse)
			if e != nil {
				deleteProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		project, err := ppmkDB.GetProject(r.Context(), deleteProjectShareRequest.ProjectShare.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			deleteProjectShareResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectShareResponse)
			if e != nil {
				deleteProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), project) //TODO ここおかしいぞ。errがあるときはprojectはnilなはず
			if e != nil {
				deleteProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}

		err = ppmkDB.DeleteProjectShare(r.Context(), deleteProjectShareRequest.ProjectShare)
		if err != nil {
			deleteProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクト共有設定の削除に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(deleteProjectShareResponse)
			if e != nil {
				deleteProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
	}))

	router.PathPrefix(updateProjectShareAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		updateProjectShareRequest := &UpdateProjectShareRequest{}
		updateProjectShareResponse := &UpdateProjectShareResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&updateProjectShareRequest)
		if err != nil {
			updateProjectShareResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectShareResponse)
			if e != nil {
				updateProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), updateProjectShareRequest.SessionID)
		if err != nil {
			updateProjectShareResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectShareResponse)
			if e != nil {
				updateProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		project, err := ppmkDB.GetProject(r.Context(), updateProjectShareRequest.ProjectShare.ProjectID)
		writable := false
		for _, writableUserID := range append([]string{project.OwnerUserID}) { //TODO 書き込み権限がある共有済みユーザの編集も許可して
			if userID == writableUserID {
				writable = true
				break
			}
		}
		if !writable {
			updateProjectShareResponse.Error = fmt.Sprintf("エラー:書き込み権限がありません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectShareResponse)
			if e != nil {
				updateProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			return
		}
		if err != nil { // この部分がエラー処理のほうがあとになるのは間違えではない
			e := ppmkDB.AddProject(r.Context(), project) //TODO ここおかしいぞ。errがあるときはprojectはnilなはず
			if e != nil {
				updateProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクトの作成に失敗しました")
				panic(e)
				return
			}
		}

		err = ppmkDB.UpdateProjectShare(r.Context(), updateProjectShareRequest.ProjectShare)
		if err != nil {
			updateProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー:プロジェクト共有の更新に失敗しました")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(updateProjectShareResponse)
			if e != nil {
				updateProjectShareResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}
	}))

	router.PathPrefix(getUserIDFromSessionIDAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		getUserIDFromSessionIDRequest := &GetUserIDFromSessionIDRequest{}
		getUserIDFromSessionIDResponse := &GetUserIDFromSessionIDResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&getUserIDFromSessionIDRequest)
		if err != nil {
			getUserIDFromSessionIDResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getUserIDFromSessionIDResponse)
			if e != nil {
				getUserIDFromSessionIDResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		userID, err := ppmkDB.GetUserIDFromSessionID(r.Context(), getUserIDFromSessionIDRequest.SessionID)
		if err != nil {
			getUserIDFromSessionIDResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getUserIDFromSessionIDResponse)
			if e != nil {
				getUserIDFromSessionIDResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		getUserIDFromSessionIDResponse.UserID = userID

		encoder := json.NewEncoder(w)
		err = encoder.Encode(getUserIDFromSessionIDResponse)
		if err != nil {
			getUserIDFromSessionIDResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))

	router.PathPrefix(getUserNameFromUserIDAddress).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		getUserNameByUserIDRequest := &GetUserNameFromUserIDRequest{}
		getUserNameByUserIDResponse := &GetUserNameFromUserIDResponse{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&getUserNameByUserIDRequest)
		if err != nil {
			getUserNameByUserIDResponse.Error = fmt.Sprintf("エラー") // requestのデータがおかしい
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getUserNameByUserIDResponse)
			if e != nil {
				getUserNameByUserIDResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		_, err = ppmkDB.GetUserIDFromSessionID(r.Context(), getUserNameByUserIDRequest.SessionID)
		if err != nil {
			getUserNameByUserIDResponse.Error = fmt.Sprintf("セッション有効期限切れです。再度ログインしてください。")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getUserNameByUserIDResponse)
			if e != nil {
				getUserNameByUserIDResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
			return
		}

		user, err := ppmkDB.GetUser(r.Context(), getUserNameByUserIDRequest.UserID)
		if err != nil {
			getUserNameByUserIDResponse.Error = fmt.Sprintf("エラー:ユーザが取得できません")
			encoder := json.NewEncoder(w)
			e := encoder.Encode(getUserNameByUserIDResponse)
			if e != nil {
				getUserNameByUserIDResponse.Error = fmt.Sprintf("サーバ内エラー")
				panic(e)
				return
			}
			panic(err)
		}

		getUserNameByUserIDResponse.UserName = user.UserName

		encoder := json.NewEncoder(w)
		err = encoder.Encode(getUserNameByUserIDResponse)
		if err != nil {
			getUserNameByUserIDResponse.Error = fmt.Sprintf("サーバ内エラー")
			panic(err)
			return
		}
	}))
}

func sendResetPasswordMail(address string, subject string, body string) error {
	auth := smtp.PlainAuth("", emailusername, emailpassword, emailhostname)
	if err := smtp.SendMail(
		fmt.Sprintf("%s:%d", emailhostname, emailport),
		auth,
		emailaddress,
		[]string{address},
		[]byte("To: "+address+"\r\n"+"Subject: "+subject+"\r\n\r\n"+body+"\r\n")); err != nil {
		return err
	}
	return nil
}

type ppmkDB interface {
	GetUsers(ctx context.Context) ([]*User, error)
	GetUser(ctx context.Context, userid string) (*User, error)
	GetUserFromEmail(ctx context.Context, email string) (*User, error)
	AddUser(ctx context.Context, user *User) error
	DeleteUser(ctx context.Context, userID string) error
	UpdateUser(ctx context.Context, user *User) error

	GetProjects(ctx context.Context, userID string) ([]*PPMKProject, error)
	GetProjectSummaries(ctx context.Context, userID string) ([]*PPMKProjectSummary, error)
	GetProject(ctx context.Context, projectID string) (*PPMKProject, error)
	AddProject(ctx context.Context, project *PPMKProject) error
	DeleteProject(ctx context.Context, projectID string) error
	UpdateProject(ctx context.Context, project *PPMKProject) error

	GetProjectDatas(ctx context.Context, projectID string) ([]*PPMKProjectData, error)
	GetProjectData(ctx context.Context, projectDataID string) (*PPMKProjectData, error)
	AddProjectData(ctx context.Context, projectData *PPMKProjectData) error
	DeleteProjectData(ctx context.Context, projectDataID string) error
	UpdateProjectData(ctx context.Context, projectData *PPMKProjectData) error

	GetProjectShares(ctx context.Context, projectID string) ([]*PPMKProjectShare, error)
	AddProjectShare(ctx context.Context, projectShare *PPMKProjectShare) error
	DeleteProjectShare(ctx context.Context, projectShare *PPMKProjectShare) error
	UpdateProjectShare(ctx context.Context, projectShare *PPMKProjectShare) error

	GetUserIDFromSessionID(ctx context.Context, sessionID string) (string, error)
	Login(ctx context.Context, email string, passwordHashMD5 string) (sessionID string, err error)
	Logout(ctx context.Context, sessionID string) error
}

type Project struct {
	PPMKProject     *PPMKProject     `json:"ppmk_project"`
	PPMKProjectData *PPMKProjectData `json:"ppmk_project_data"`
}

type PPMKProjectSummary struct {
	PPMKProject      *PPMKProject       `json:"ppmk_project"`
	PPMKProjectDatas []*PPMKProjectData `json:"ppmk_project_datas"`
}

type User struct {
	UserID          string `json:"user_id"`
	Email           string `json:"email"`
	PasswordHashMD5 string `json:"password_hash_md5"`
	UserName        string `json:"user_name"`
	ResetPasswordID string `json:"reset_password_id"`
}

type LoginSession struct {
	SessionID string `json:"session_id"`
	UserID    string `json:"user_id"`
}

type PPMKProject struct {
	ProjectID    string `json:"project_id"`
	OwnerUserID  string `json:"owner_user_id"`
	ProjectName  string `json:"project_name"`
	IsSharedView bool   `json:"is_shared"`
}

type PPMKProjectData struct {
	ProjectDataID string          `json:"project_data_id"`
	ProjectID     string          `json:"project_id"`
	SavedTime     time.Time       `json:"saved_time"`
	ProjectData   json.RawMessage `json:"project_data"`
	Author        string          `json:"author"`
	Memo          string          `json:"memo"`
}

type PPMKProjectShare struct {
	ProjectID string `json:"project_id"`
	UserID    string `json:"user_id"`
	Writable  bool   `json:"writable"`
}

type ppmkDBImpl struct {
	filename string
	db       *sql.DB
	m        *sync.Mutex
}

func (p *ppmkDBImpl) GetUsers(ctx context.Context) ([]*User, error) {
	statement := `SELECT UserID, UserName, PasswordHashMD5, ResetPasswordID FROM User;`
	rows, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
		return nil, err
	}
	defer rows.Close()

	users := []*User{}
	for rows.Next() {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			user := &User{}
			err = rows.Scan(&user.UserID, &user.UserName, &user.PasswordHashMD5, &user.ResetPasswordID)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			users = append(users, user)
		}
	}
	return users, nil
}

func (p *ppmkDBImpl) GetUser(ctx context.Context, userid string) (*User, error) {
	statement := `SELECT UserID, Email, UserName, PasswordHashMD5, ResetPasswordID FROM User WHERE UserID='` + userid + `';`
	row := p.db.QueryRowContext(ctx, statement)

	user := &User{}
	err := row.Scan(&user.UserID, &user.Email, &user.UserName, &user.PasswordHashMD5, &user.ResetPasswordID)
	if err != nil {
		err = fmt.Errorf("error at scan row from %s: %w", p.filename, err)
		return nil, err
	}
	return user, nil
}

func (p *ppmkDBImpl) GetUserFromEmail(ctx context.Context, email string) (*User, error) {
	statement := `SELECT UserID, Email, UserName, PasswordHashMD5, ResetPasswordID FROM User WHERE Email='` +
		escapeSQLite(email) + `';`
	row := p.db.QueryRowContext(ctx, statement)

	user := &User{}
	err := row.Scan(&user.UserID, &user.Email, &user.UserName, &user.PasswordHashMD5, &user.ResetPasswordID)
	if err != nil {
		err = fmt.Errorf("error at scan row from %s: %w", p.filename, err)
		return nil, err
	}
	return user, nil
}

func (p *ppmkDBImpl) AddUser(ctx context.Context, user *User) error {
	p.m.Lock()
	defer p.m.Unlock()
	statement := `INSERT INTO User (UserID, Email, PasswordHashMD5, UserName, ResetPasswordID) VALUES('` +
		escapeSQLite(user.UserID) + `', '` +
		escapeSQLite(user.Email) + `', '` +
		escapeSQLite(user.PasswordHashMD5) + `', '` +
		escapeSQLite(user.UserName) + `', '` +
		escapeSQLite(user.ResetPasswordID) + `');`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add user: %w", err)
		return err
	}
	return nil
}

func (p *ppmkDBImpl) DeleteUser(ctx context.Context, userID string) error {
	usersProjects, err := p.GetProjects(ctx, userID)
	if err != nil {
		return err
	}
	for _, usersProject := range usersProjects {
		err := p.DeleteProject(ctx, usersProject.ProjectID)
		if err != nil {
			return err
		}

	}

	statement := `DELETE FROM User WHERE UserID='` + userID + `';`
	_, err = p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) UpdateUser(ctx context.Context, user *User) error {
	statement := `UPDATE User SET Email='` +
		escapeSQLite(user.Email) + `', PasswordHashMD5='` +
		escapeSQLite(user.PasswordHashMD5) + `', UserName='` +
		escapeSQLite(user.UserName) + `', ResetPasswordID='` +
		escapeSQLite(user.ResetPasswordID) + `' WHERE UserID='` +
		escapeSQLite(user.UserID) + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) GetProjects(ctx context.Context, userID string) ([]*PPMKProject, error) {
	statement := `SELECT ProjectID, OwnerUserID, ProjectName, IsSharedView FROM PPMKProject;`
	rows, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
		return nil, err
	}
	defer rows.Close()

	projects := []*PPMKProject{}
	for rows.Next() {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			project := &PPMKProject{}
			isSharedView := ""
			err = rows.Scan(&project.ProjectID, &project.OwnerUserID, &project.ProjectName, &isSharedView)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			b, err := strconv.ParseBool(isSharedView)
			if err != nil {
				return nil, err
			}
			project.IsSharedView = b
			projects = append(projects, project)
		}
	}
	return projects, nil
}

func (p *ppmkDBImpl) GetProjectSummaries(ctx context.Context, userID string) ([]*PPMKProjectSummary, error) {
	projectSummaries := []*PPMKProjectSummary{}

	projects, err := p.GetProjects(ctx, userID)
	if err != nil {
		err = fmt.Errorf("error at get projectsSummary: %w", err)
		return nil, err
	}
	for _, project := range projects {
		projectDatas, err := func(project *PPMKProject) ([]*PPMKProjectData, error) {
			statement := `SELECT ProjectDataID, ProjectID, SavedTime, Author, Memo FROM PPMKProjectData WHERE ProjectID='` + project.ProjectID + `' ORDER BY SavedTime DESC;`
			rows, err := p.db.QueryContext(ctx, statement)
			if err != nil {
				err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
				return nil, err
			}
			defer rows.Close()

			projectDatas := []*PPMKProjectData{}
			for rows.Next() {
				select {
				case <-ctx.Done():
					return nil, ctx.Err()
				default:
					projectData := &PPMKProjectData{}
					timestr := ""
					err = rows.Scan(&projectData.ProjectDataID, &projectData.ProjectID, &timestr, &projectData.Author, &projectData.Memo)
					if err != nil {
						err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
						return nil, err
					}
					t, err := time.Parse(TimeLayout, timestr)
					if err != nil {
						err = fmt.Errorf("error at parse time %s: %w", timestr, err)
						return nil, err
					}
					projectData.SavedTime = t

					projectDatas = append(projectDatas, projectData)
				}
			}
			return projectDatas, nil
		}(project)
		if err != nil {
			err = fmt.Errorf("error at select projectdata: %w", err)
			return nil, err
		}

		projectSummary := &PPMKProjectSummary{}
		projectSummary.PPMKProject = project
		projectSummary.PPMKProjectDatas = projectDatas
		projectSummaries = append(projectSummaries, projectSummary)
	}
	return projectSummaries, nil
}

func (p *ppmkDBImpl) GetProject(ctx context.Context, projectID string) (*PPMKProject, error) {
	statement := `SELECT ProjectID, OwnerUserID, ProjectName, IsSharedView FROM PPMKProject WHERE ProjectID='` + projectID + `';`
	row := p.db.QueryRowContext(ctx, statement)

	project := &PPMKProject{}
	isSharedView := ""
	err := row.Scan(&project.ProjectID, &project.OwnerUserID, &project.ProjectName, &isSharedView)
	if err != nil {
		err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
		return nil, err
	}
	b, err := strconv.ParseBool(isSharedView)
	if err != nil {
		return nil, err
	}
	project.IsSharedView = b

	return project, nil
}

func (p *ppmkDBImpl) AddProject(ctx context.Context, project *PPMKProject) error {
	p.m.Lock()
	defer p.m.Unlock()
	statement := `INSERT INTO PPMKProject (ProjectID, OwnerUserID, ProjectName, IsSharedView) VALUES('` +
		escapeSQLite(project.ProjectID) + `', '` +
		escapeSQLite(project.OwnerUserID) + `', '` +
		escapeSQLite(project.ProjectName) + `', '` +
		escapeSQLite(strconv.FormatBool(project.IsSharedView)) + `');`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add project: %w", err)
		return err
	}
	return nil
}

func (p *ppmkDBImpl) DeleteProject(ctx context.Context, projectID string) error {
	projectDatas, err := p.GetProjectDatas(ctx, projectID)
	if err != nil {
		return err
	}
	for _, projectData := range projectDatas {
		err := p.DeleteProjectData(ctx, projectData.ProjectID)
		if err != nil {
			return err
		}

	}

	statement := `DELETE FROM PPMKProject WHERE ProjectID='` + projectID + `';`
	_, err = p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) UpdateProject(ctx context.Context, project *PPMKProject) error {
	statement := `UPDATE PPMKProject SET  OwnerUserID='` +
		escapeSQLite(project.OwnerUserID) + `', ProjectName='` +
		escapeSQLite(project.ProjectName) + `', IsSharedView='` +
		escapeSQLite(strconv.FormatBool(project.IsSharedView)) + `' WHERE ProjectID='` +
		escapeSQLite(project.ProjectID) + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) GetProjectDatas(ctx context.Context, projectID string) ([]*PPMKProjectData, error) {
	statement := `SELECT ProjectDataID, ProjectID, SavedTime, ProjectData, Autho, Memo FROM PPMKProjectData;`
	rows, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
		return nil, err
	}
	defer rows.Close()

	projectDatas := []*PPMKProjectData{}
	for rows.Next() {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			projectData := &PPMKProjectData{}
			timestr := ""
			err = rows.Scan(&projectData.ProjectDataID, &projectData.ProjectID, &timestr, &projectData.ProjectData, &projectData.Author, &projectData.Memo)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			t, err := time.Parse(TimeLayout, timestr)
			if err != nil {
				err = fmt.Errorf("error at parse time %s: %w", timestr, err)
				return nil, err
			}
			projectData.SavedTime = t

			projectDatas = append(projectDatas, projectData)
		}
	}
	return projectDatas, nil
}

func (p *ppmkDBImpl) GetProjectData(ctx context.Context, projectDataID string) (*PPMKProjectData, error) {
	statement := `SELECT ProjectDataID, ProjectID, SavedTime, ProjectData, Author, Memo FROM PPMKProjectData WHERE ProjectDataID='` + projectDataID + `';`
	row := p.db.QueryRowContext(ctx, statement)

	projectData := &PPMKProjectData{}
	timestr := ""
	jsonProjectData := sql.NullString{}
	err := row.Scan(&projectData.ProjectDataID, &projectData.ProjectID, &timestr, &jsonProjectData, &projectData.Author, &projectData.Memo)
	if err != nil {
		err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
		return nil, err
	}
	t, err := time.Parse(TimeLayout, timestr)
	if err != nil {
		err = fmt.Errorf("error at parse time %s: %w", timestr, err)
		return nil, err
	}
	projectData.ProjectData = json.RawMessage(jsonProjectData.String)
	projectData.SavedTime = t

	return projectData, nil
}

func (p *ppmkDBImpl) AddProjectData(ctx context.Context, projectData *PPMKProjectData) error {
	p.m.Lock()
	defer p.m.Unlock()
	statement := `INSERT INTO PPMKProjectData (ProjectDataID, ProjectID, SavedTime, ProjectData, Author, Memo) VALUES('` +
		escapeSQLite(projectData.ProjectDataID) + `', '` +
		escapeSQLite(projectData.ProjectID) + `', '` +
		escapeSQLite(projectData.SavedTime.Format(TimeLayout)) + `', '` +
		escapeSQLite(string(projectData.ProjectData)) + `', '` +
		escapeSQLite(projectData.Author) + `', '` +
		escapeSQLite(projectData.Memo) + `');`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add projectdata %w", err)
		return err
	}
	return nil
}

func (p *ppmkDBImpl) DeleteProjectData(ctx context.Context, projectDataID string) error {
	statement := `DELETE FROM PPMKProjectData WHERE ProjectDataID='` + projectDataID + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) UpdateProjectData(ctx context.Context, projectData *PPMKProjectData) error {
	statement := `UPDATE PPMKProjectData SET SavedTime='` +
		escapeSQLite(projectData.SavedTime.Format(TimeLayout)) + `', ProjectData='` +
		escapeSQLite(string(projectData.ProjectData)) + `', Author='` +
		escapeSQLite(projectData.Author) + `' WHERE ProjectDataID='` +
		escapeSQLite(projectData.ProjectDataID) + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) GetProjectShares(ctx context.Context, projectID string) ([]*PPMKProjectShare, error) {
	statement := `SELECT ProjectID, UserID, Writable FROM ProjectShare;`
	rows, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
		return nil, err
	}
	defer rows.Close()

	projectShares := []*PPMKProjectShare{}
	for rows.Next() {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			projectShare := &PPMKProjectShare{}
			isWritable := ""
			err = rows.Scan(&projectShare.ProjectID, &projectShare.UserID, &isWritable)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			b, err := strconv.ParseBool(isWritable)
			if err != nil {
				return nil, err
			}
			projectShare.Writable = b
			projectShares = append(projectShares, projectShare)
		}
	}
	return projectShares, nil
}

func (p *ppmkDBImpl) AddProjectShare(ctx context.Context, projectShare *PPMKProjectShare) error {
	p.m.Lock()
	defer p.m.Unlock()
	statement := `INSERT INTO ProjectShare (ProjectID, UserID, Writable) VALUES('` +
		escapeSQLite(projectShare.ProjectID) + `', '` +
		escapeSQLite(projectShare.UserID) + `', '` +
		escapeSQLite(strconv.FormatBool(projectShare.Writable)) + `');`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add project share: %w", err)
		return err
	}
	return nil
}

func (p *ppmkDBImpl) DeleteProjectShare(ctx context.Context, projectShare *PPMKProjectShare) error {
	statement := `DELETE FROM ProjectShare WHERE ProjectID='` + projectShare.ProjectID + `' AND UserID='` + projectShare.UserID + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) UpdateProjectShare(ctx context.Context, projectShare *PPMKProjectShare) error {
	statement := `UPDATE ProjectShare SET ProjectID='` +
		escapeSQLite(projectShare.ProjectID) + `', UserID='` +
		escapeSQLite(projectShare.UserID) + `', Writable='` +
		escapeSQLite(strconv.FormatBool(projectShare.Writable)) + `' WHERE ProjectID='` +
		escapeSQLite(projectShare.ProjectID) + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) GetUserIDFromSessionID(ctx context.Context, sessionID string) (string, error) {
	statement := `SELECT UserID FROM LoginSession WHERE SessionID='` + sessionID + `' GROUP BY UserID;`
	row := p.db.QueryRowContext(ctx, statement)

	userID := ""
	err := row.Scan(&userID)
	if err != nil {
		err = fmt.Errorf("error at scan row from %s: %w", p.filename, err)
		return "", err
	}
	return userID, nil
}

func (p *ppmkDBImpl) Login(ctx context.Context, email string, passwordHashMD5 string) (sessionID string, err error) {
	user, err := p.GetUserFromEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if user.PasswordHashMD5 != passwordHashMD5 {
		err := fmt.Errorf("password does not match")
		return "", err
	}
	userID := user.UserID
	sessionID = uuid.New().String()
	p.m.Lock()
	defer p.m.Unlock()
	statement := `INSERT INTO LoginSession (UserID, SessionID) VALUES('` +
		escapeSQLite(userID) + `','` +
		escapeSQLite(sessionID) + `');`
	_, err = p.db.ExecContext(ctx, statement)
	if err != nil {
		return "", err
	}
	return sessionID, nil
}

func (p *ppmkDBImpl) Logout(ctx context.Context, sessionID string) error {
	statement := `DELETE FROM LoginSession WHERE SessionID='` + escapeSQLite(sessionID) + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func createTableStatementSQL() (string, error) {
	html, err := fs.Sub(htmlFS, "embed")
	if err != nil {
		return "", err
	}
	sqlFile, err := html.Open("PutPullMokModel.sql")
	if err != nil {
		return "", err
	}
	b, err := io.ReadAll(sqlFile)
	return string(b), err
}

func newPPMKDB(dbFilename string) (ppmkDB, error) {
	db, err := sql.Open("sqlite3", dbFilename)
	if err != nil {
		err = fmt.Errorf("error at open database %s: %w", dbFilename, err)
		return nil, err
	}

	createStatement, err := createTableStatementSQL()
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(createStatement)
	if err != nil {
		err = fmt.Errorf("error at create table to %s: %w", dbFilename, err)
		return nil, err
	}

	return &ppmkDBImpl{
		filename: dbFilename,
		db:       db,
		m:        &sync.Mutex{},
	}, nil

}

func escapeSQLite(str string) string {
	return strings.ReplaceAll(str, "'", "''")
}
