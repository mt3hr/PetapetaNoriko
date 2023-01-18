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
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

//TODO ProjectData保存
//TODO ユーザ登録

type LoginRequest struct {
	Email             string `json:"email"`
	Password_hash_md5 string `json:"password_hash_md5"`
}

type LoginResponse struct {
	Session_id string `json:"session_id"`
	Error      string `json:"error"`
}

type LogoutRequest struct {
	Session_id string `json:"session_id"`
}

type ResetPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordResponse struct {
	Error string `json:"error"`
}

const (
	TimeLayout = time.RFC3339

	loginAddress         = "/ppmk_server/login"
	logoutAddress        = "/ppmk_server/logout"
	resetPasswordAddress = "/ppmk_server/reset_password"

	emailhostname = "smtp.gmail.com"
	emailport     = 587
	emailusername = "21jy0216@gmail.com"
	emailpassword = ""
)

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
		sessionID, err := ppmkDB.Login(r.Context(), loginRequest.Email, loginRequest.Password_hash_md5)
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
		loginResponse.Session_id = sessionID
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
		err = ppmkDB.Logout(r.Context(), logoutRequest.Session_id)
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
	}))
}

func sendResetPasswordMail(email string, subject string, body string) error {
	auth := smtp.PlainAuth("", emailusername, emailpassword, emailhostname)
	msg := []byte(strings.ReplaceAll(fmt.Sprintf("To: %s\nSubject: %s\n\n%s", email, subject, body), "\n", "\r\n"))
	if err := smtp.SendMail(fmt.Sprintf("%s:%d", emailhostname, emailport),
		auth,
		emailusername,
		[]string{email},
		msg); err != nil {
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
	GetProject(ctx context.Context, projectID string) (*PPMKProject, error)
	AddProject(ctx context.Context, project *PPMKProject) error
	DeleteProject(ctx context.Context, projectID string) error
	UpdateProject(ctx context.Context, project *PPMKProject) error

	GetProjectDatas(ctx context.Context, projectID string) ([]*PPMKProjectData, error)
	GetProjectData(ctx context.Context, projectDataID string) (*PPMKProjectData, error)
	AddProjectData(ctx context.Context, projectData *PPMKProjectData) error
	DeleteProjectData(ctx context.Context, projectDataID string) error
	UpdateProjectData(ctx context.Context, projectData *PPMKProjectData) error

	GetUserIDFromSessionID(ctx context.Context, sessionID string) (string, error)
	Login(ctx context.Context, email string, passwordHashMD5 string) (sessionID string, err error)
	Logout(ctx context.Context, sessionID string) error
}

type User struct {
	UserID          string
	Email           string
	PasswordHashMD5 string
	UserName        string
	ResetPasswordID string
}

type LoginSession struct {
	UserID    string
	SessionID string
}

type PPMKProject struct {
	ProjectID   string
	OwnerUserID string
	ProjectName string
	IsShared    bool
}

type PPMKProjectData struct {
	ProjectDataID string
	ProjectID     string
	SavedTime     time.Time
	ProjectData   string
	Author        string
}

type ProjectShare struct {
	ProjectID string
	UserID    string
	Writable  bool
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
	statement := `INSERT INTO User (UserID, Emainl, PasswordHashMD5, UserName, ResetPasswordID) VALUES('` +
		escapeSQLite(user.UserID) + `', '` +
		escapeSQLite(user.Email) + `', '` +
		escapeSQLite(user.PasswordHashMD5) + `', '` +
		escapeSQLite(user.UserName) + `', '` +
		escapeSQLite(user.ResetPasswordID) + `');`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add projectdata %w", err)
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
	statement := `SELECT ProjectID, OwnerUserID, ProjectName, IsShared FROM PPMKProject;`
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
			isShared := ""
			err = rows.Scan(&project.ProjectID, &project.OwnerUserID, &project.ProjectName, &isShared)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			b, err := strconv.ParseBool(isShared)
			if err != nil {
				return nil, err
			}
			project.IsShared = b
			projects = append(projects, project)
		}
	}
	return projects, nil
}

func (p *ppmkDBImpl) GetProject(ctx context.Context, projectID string) (*PPMKProject, error) {
	statement := `SELECT ProjectID, OwnerUserID, ProjectName, IsSharedView FROM PPMKProjectData WHERE ProjectID='` + projectID + `';`
	row, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		return nil, err
	}

	project := &PPMKProject{}
	isShared := ""
	err = row.Scan(&project.ProjectID, &project.OwnerUserID, &project.ProjectName, &isShared)
	if err != nil {
		err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
		return nil, err
	}
	b, err := strconv.ParseBool(isShared)
	if err != nil {
		return nil, err
	}
	project.IsShared = b

	return project, nil
}

func (p *ppmkDBImpl) AddProject(ctx context.Context, project *PPMKProject) error {
	statement := `INSERT INTO PPMKProject (ProjectID, OwnerUserID, ProjectName, IsSharedView) VALUES('` +
		escapeSQLite(project.ProjectID) + `', '` +
		escapeSQLite(project.OwnerUserID) + `', '` +
		escapeSQLite(project.ProjectName) + `', '` +
		escapeSQLite(strconv.FormatBool(project.IsShared)) + `', );`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add projectdata %w", err)
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

	statement := `DELETE FROM Project WHERE ProjectID='` + projectID + `';`
	_, err = p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) UpdateProject(ctx context.Context, project *PPMKProject) error {
	statement := `UPDATE Project SET  OwnerUserID='` +
		escapeSQLite(project.OwnerUserID) + `', ProjectName='` +
		escapeSQLite(project.ProjectName) + `', IsSharedView='` +
		escapeSQLite(strconv.FormatBool(project.IsShared)) + `' WHERE ProjectID='` +
		escapeSQLite(project.ProjectID) + `';`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) GetProjectDatas(ctx context.Context, projectID string) ([]*PPMKProjectData, error) {
	statement := `SELECT ProjectDataID, ProjectID, SavedTime, ProjectData, Autho  FROM PPMKProjectData;`
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
			err = rows.Scan(&projectData.ProjectDataID, &projectData.ProjectID, &timestr, &projectData.ProjectData, &projectData.Author)
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
	statement := `SELECT ProjectDataID, ProjectID, SavedTime, ProjectData, Autho  FROM PPMKProjectData WHERE ProjectDataID='` + projectDataID + `';`
	row := p.db.QueryRowContext(ctx, statement)

	projectData := &PPMKProjectData{}
	timestr := ""
	err := row.Scan(&projectData.ProjectDataID, &projectData.ProjectID, &timestr, &projectData.ProjectData, &projectData.Author)
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

	return projectData, nil
}

func (p *ppmkDBImpl) AddProjectData(ctx context.Context, projectData *PPMKProjectData) error {
	statement := `INSERT INTO PPMKProjectData (ProjectDataID, ProjectID, SavedTime, ProjectData, Author) VALUES('` +
		escapeSQLite(projectData.ProjectDataID) + `', '` +
		escapeSQLite(projectData.ProjectID) + `', '` +
		escapeSQLite(projectData.SavedTime.Format(TimeLayout)) + `', '` +
		escapeSQLite(projectData.ProjectData) + `', '` +
		escapeSQLite(projectData.Author) + `');`
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
		escapeSQLite(projectData.ProjectData) + `', Author='` +
		escapeSQLite(projectData.Author) + `' WHERE ProjectDataID='` +
		escapeSQLite(projectData.ProjectDataID) + `';`
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
