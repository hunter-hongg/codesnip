package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

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
            "snips": []gin.H {
                {
                    "snip": "print('Hello, World!')",
                    "lang": "Python",
                },
                {
                    "snip": "print(int(input()))",
                    "lang": "Python",
                },
                {
                    "snip": 
                        "#include <stdio.h>\n" +
                        "int main() \n" +
                        "{\n" +
                        "   printf(\"Hello, World!\");\n" +
                        "   return 0;\n" +
                        "}\n",
                    "lang": "C",
                },
            },
        })
    })
    
    r.Run(":8081")
}