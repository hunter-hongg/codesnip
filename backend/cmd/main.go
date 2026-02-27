package main

import (
	"database/sql"
	"log"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type Snip struct {
	ID   int    `json:"id"`
	Snip string `json:"snip"`
	Lang string `json:"lang"`
	Tags []string `json:"tags"`
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
        lang TEXT NOT NULL, 
				tags TEXT DEFAULT ''
    );
    `

	if _, err := db.Exec(createQuery); err != nil {
		log.Fatal(err.Error())
	}

	getQuery := `SELECT id, snip, lang, tags from snips`
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
		var tags string
		if err := rows.Scan(&id, &snip, &lang, &tags); err != nil {
			log.Fatal(err.Error())
		}
		rowStruct = append(rowStruct, 
			Snip {
				ID: id, 
				Snip: snip, 
				Lang: lang, 
				Tags: strings.Split(tags, ","),
			})
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
			"tags": s.Tags,
		}
		ginHs = append(ginHs, ginH)
	}
	return ginHs
}

// insertSnip 将新片段插入到数据库中
func insertSnip(snip Snip) (int64, error) {
	db, err := sql.Open("sqlite3", "./snips.db")
	if err != nil {
		return 0, err
	}
	defer db.Close()

	createQuery := `
    CREATE TABLE IF NOT EXISTS snips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        snip TEXT NOT NULL,
        lang TEXT NOT NULL,
			  tags TEXT DEFAULT ''
    );
    `

	if _, err := db.Exec(createQuery); err != nil {
		return 0, err
	}

	// 将tags数组转换为逗号分隔的字符串
	tagsStr := strings.Join(snip.Tags, ",")

	insertQuery := `INSERT INTO snips (snip, lang, tags) VALUES (?, ?, ?)`
	result, err := db.Exec(insertQuery, snip.Snip, snip.Lang, tagsStr)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func deleteSnip(id int) error { 
	db, err := sql.Open("sqlite3", "./snips.db")

	if err != nil {
		return err
	}
	defer db.Close()

	deleteQuery := `DELETE FROM snips WHERE id = ?`
	_, err = db.Exec(deleteQuery, id)
	if err != nil {
		return err
	}

	return nil
}

// main函数是程序的入口点
func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173", // React 开发
			"http://localhost:8080", // Nginx 服务器
		},
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
	r.POST("/api/add_snippets", func(c *gin.Context) {
		var newSnip Snip
		if err := c.ShouldBindJSON(&newSnip); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}

		id, err := insertSnip(newSnip)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to insert snippet"})
			return
		}

		c.JSON(201, gin.H{
			"message": "Snippet created successfully",
			"id":      id,
		})
	})
	r.POST("/api/delete_snippets", func(c *gin.Context){
		var newSnip Snip 
		if err := c.ShouldBindJSON(&newSnip); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}

		err := deleteSnip(newSnip.ID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to delete snippet"})
			return
		}

		c.JSON(200, gin.H{
			"message": "Snippet deleted successfully",
		})
	})

	r.Run(":8081")
}
