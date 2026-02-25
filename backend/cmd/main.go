package main

import (
	"log"
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Snip struct {
    ID int `json:"id"`
    Snip string `json:"snip"`
    Lang string `json:"lang"`
}

func getDataFromDB() []Snip {
    db, err := sql.Open("sqlite3", "./snips.db")
    if err != nil {
        log.Fatal(err.Error())
    }
    defer db.Close()

    createQuery := `
    CREATE TABLE IF NOT EXISTS snips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        snip TEXT NOT NULL,
        lang TEXT NOT NULL
    );
    `

    if _, err := db.Exec(createQuery); err != nil {
        log.Fatal(err.Error())
    }

    getQuery := `SELECT id, snip, lang from snips`
    rows, err := db.Query(getQuery)
    if err != nil {
        log.Fatal(err.Error())
    }
    defer rows.Close()

    rowStruct := []Snip{}

    for rows.Next() {
        var id int
        var snip string
        var lang string
        if err := rows.Scan(&id, &snip, &lang); err != nil {
            log.Fatal(err.Error())
        }
        rowStruct = append(rowStruct, Snip{ID: id, Snip: snip, Lang: lang})
    }

    return rowStruct
}

func snipToGinH(snip []Snip) []gin.H {
    ginHs := []gin.H{}
    for _, s := range snip {
        ginH := gin.H{
            "id":   s.ID,
            "snip": s.Snip,
            "lang": s.Lang,
        }
        ginHs = append(ginHs, ginH)
    }
    return ginHs
}

// main函数是程序的入口点
func main() {
    r := gin.Default()
		r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))
    r.GET("/api/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })
    r.GET("/api/snippets", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "snips": snipToGinH(getDataFromDB()),
        })
    })
    
    r.Run(":8081")
} 