package ppmk

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"io/fs"
	"strconv"
	"sync"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

const TimeLayout = time.RFC3339

type ppmkDB interface {
	GetUsers(ctx context.Context) ([]*User, error)
	GetUser(ctx context.Context, userid string) (*User, error)
	AddUser(ctx context.Context, user *User) error
	DeleteUser(ctx context.Context, userID string) error
	UpdateUser(ctx context.Context, user *User) error

	GetProjects(ctx context.Context, userID string) ([]*PPMKProject, error)
	GetProject(ctx context.Context, projectID string) (*PPMKProject, error)
	AddProject(ctx context.Context, project *PPMKProject) error
	DeleteProject(ctx context.Context, projectID string) error
	UpdateProject(ctx context.Context, project *PPMKProject) error

	GetProjectDatas(ctx context.Context, userID string, projectID string) ([]*PPMKProjectData, error)
	GetProjectData(ctx context.Context, projectDataID string) (*PPMKProjectData, error)
	AddProjectData(ctx context.Context, projectData *PPMKProjectData) error
	DeleteProjectData(ctx context.Context, projectDataID string) error
	UpdateProjectData(ctx context.Context, projectData *PPMKProjectData) error

	GetUserIDFromSessionID(ctx context.Context, sessionID string) (string, error)
	Login(ctx context.Context, userID string, passwordHashMD5 string) (sessionID string, err error)
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
	statement := `SELECT UserID, UserName, PasswordHashMD5, ResetPasswordID FROM "User";`
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
			err = rows.Scan(&user.UserID, user.UserName, &user.PasswordHashMD5, &user.ResetPasswordID)
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
	statement := `SELECT UserID, UserName, PasswordHashMD5, ResetPasswordID FROM "User" WHERE UserID='` + userid + `';`
	row := p.db.QueryRowContext(ctx, statement)

	user := &User{}
	err := row.Scan(&user.UserID, user.UserName, &user.PasswordHashMD5, &user.ResetPasswordID)
	if err != nil {
		err = fmt.Errorf("error at scan row from %s: %w", p.filename, err)
		return nil, err
	}
	return user, nil
}

func (p *ppmkDBImpl) AddUser(ctx context.Context, user *User) error {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) DeleteUser(ctx context.Context, userID string) error {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) UpdateUser(ctx context.Context, user *User) error {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) GetProjects(ctx context.Context, userID string) ([]*PPMKProject, error) {
	statement := `SELECT ProjectID, OwnerUserID, ProjectName, IsShared FROM "PPMKProject";`
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
	statement := `SELECT ProjectID, OwnerUserID, ProjectName, IsSharedView FROM "PPMKProjectData" WHERE ProjectID='` + projectID + `'`
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
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) DeleteProject(ctx context.Context, projectID string) error {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) UpdateProject(ctx context.Context, project *PPMKProject) error {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) GetProjectDatas(ctx context.Context, userID string, projectID string) ([]*PPMKProjectData, error) {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) GetProjectData(ctx context.Context, projectDataID string) (*PPMKProjectData, error) {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) AddProjectData(ctx context.Context, projectData *PPMKProjectData) error {
	statement := `INSERT INTO PPMKProjectData (ProjectDataID, ProjectID, SavedTime, ProjectData, Author) VALUES('` + projectData.ProjectDataID + `', '` + projectData.ProjectID + `', '` + projectData.SavedTime.Format(TimeLayout) + `', '` + projectData.ProjectData + `', '` + projectData.Author + `', )`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at add projectdata %w", err)
		return err
	}
	return nil
}

func (p *ppmkDBImpl) DeleteProjectData(ctx context.Context, projectDataID string) error {
	statement := `DELETE FROM PPMKProjectData WHERE ProjectDataID='` + projectDataID + `'`
	_, err := p.db.ExecContext(ctx, statement)
	if err != nil {
		return err
	}
	return nil
}

func (p *ppmkDBImpl) UpdateProjectData(ctx context.Context, projectData *PPMKProjectData) error {
	panic("not implemented") // TODO: Implement
}

func (p *ppmkDBImpl) GetUserIDFromSessionID(ctx context.Context, sessionID string) (string, error) {
	statement := `SELECT UserID FROM LoginSession WHERE SessionID='` + sessionID + `' GROUP BY UserID`
	row := p.db.QueryRowContext(ctx, statement)

	userID := ""
	err := row.Scan(&userID)
	if err != nil {
		err = fmt.Errorf("error at scan row from %s: %w", p.filename, err)
		return "", err
	}
	return userID, nil
}

func (p *ppmkDBImpl) Login(ctx context.Context, userID string, passwordHashMD5 string) (sessionID string, err error) {
	user, err := p.GetUser(ctx, userID)
	if err != nil {
		return "", err
	}
	if user.PasswordHashMD5 != passwordHashMD5 {
		err := fmt.Errorf("password does not match")
		return "", err
	}
	sessionID = uuid.New().String()
	statement := `INSERT INTO LoginSession (UserID, SessionID) VALUES('` + userID + `','` + sessionID + `')`
	_, err = p.db.ExecContext(ctx, statement)
	if err != nil {
		return "", err
	}
	return sessionID, nil
}

func (p *ppmkDBImpl) Logout(ctx context.Context, sessionID string) error {
	statement := `DELETE FROM LoginSession WHERE SessionID=` + sessionID + `')`
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
	return nil, nil
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
