package ppmk

import (
	"database/sql"
	"fmt"
	"io"
	"io/fs"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

var ()

type ppmkDB interface {
	GetUsers() ([]User, error)
	GetProjectDatasSummary(userID string) ([]*ProjectData, error) // とりあえず見るために。projectdataは取得しません。GetProjectDataから取得して。
	GetProjectData(userID string, projectID string) (*ProjectData, error)
	GetUserIDFromSessionID(sessionID string) (string, error)
	Login(userID string, passwordHashMD5 string) (sessionID string, err error)
	Logout(sessionID string) error
}

type ppmkDBImpl struct {
	filename string
	db       *sql.DB
	m        *sync.Mutex
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
