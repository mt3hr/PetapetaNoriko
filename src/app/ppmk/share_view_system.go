package ppmk

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"io/fs"
	"sync"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

const TimeLayout = time.RFC3339

type ppmkDB interface {
	//TODO projectdataの追加
	//TODO projectdataの削除
	GetUser(ctx context.Context, userid string) (*User, error)
	GetUsers(ctx context.Context) ([]*User, error)
	GetProjectDatasSummary(ctx context.Context, userID string) ([]*ProjectData, error) // とりあえず見るために。projectdataは取得しません。GetProjectDataから取得して。
	GetProjectDatas(ctx context.Context, userID string, projectID string) ([]*ProjectData, error)
	GetUserIDFromSessionID(ctx context.Context, sessionID string) (string, error)
	Login(ctx context.Context, userID string, passwordHashMD5 string) (sessionID string, err error)
	Logout(ctx context.Context, sessionID string) error
}

type User struct {
	UserID          string
	UserName        string
	PasswordHashMD5 string
	ResetPasswordID string
}

type LoginSession struct {
	UserID    string
	SessionID string
}

type ProjectData struct {
	ProjectID   string
	SavedTime   time.Time
	UserID      string
	ProjectName string
	ProjectData string
	IsShared    bool
}

type ppmkDBImpl struct {
	filename string
	db       *sql.DB
	m        *sync.Mutex
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

func (p *ppmkDBImpl) GetProjectDatasSummary(ctx context.Context, userID string) ([]*ProjectData, error) {
	statement := `SELECT ProjectID, SavedTime, UserID, ProjectName, IsShared FROM "PPMKProjectData";`
	rows, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
		return nil, err
	}
	defer rows.Close()

	projects := []*ProjectData{}
	for rows.Next() {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			project := &ProjectData{}
			timestr := ""
			err = rows.Scan(&project.ProjectID, &timestr, &project.UserID, &project.ProjectName, &project.IsShared)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			project.SavedTime, err = time.Parse(TimeLayout, timestr)
			if err != nil {
				err = fmt.Errorf("error at parse time '%s' at %s %s: %w", timestr, project.ProjectID, p.filename, err)
				return nil, err
			}

			projects = append(projects, project)
		}
	}
	return projects, nil
}

func (p *ppmkDBImpl) GetProjectDatas(ctx context.Context, userID string, projectID string) ([]*ProjectData, error) {

	statement := `SELECT ProjectID, SavedTime, UserID, ProjectName, IsShared, ProjectData FROM "PPMKProjectData";`
	rows, err := p.db.QueryContext(ctx, statement)
	if err != nil {
		err = fmt.Errorf("error at get all db from %s: %w", p.filename, err)
		return nil, err
	}
	defer rows.Close()

	projects := []*ProjectData{}
	for rows.Next() {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			project := &ProjectData{}
			timestr := ""
			err = rows.Scan(&project.ProjectID, &timestr, &project.UserID, &project.ProjectName, &project.IsShared, &project.ProjectData)
			if err != nil {
				err = fmt.Errorf("error at scan rows from %s: %w", p.filename, err)
				return nil, err
			}
			project.SavedTime, err = time.Parse(TimeLayout, timestr)
			if err != nil {
				err = fmt.Errorf("error at parse time '%s' at %s %s: %w", timestr, project.ProjectID, p.filename, err)
				return nil, err
			}

			projects = append(projects, project)
		}
	}
	return projects, nil
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
