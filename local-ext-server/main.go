package main

import (
	"github.com/labstack/echo"
	"log"
	"net/http"
)

type Incoming struct {
	Subject string `json:"subject"`
}

func main() {
	e := echo.New()
	e.POST("/help", func(c echo.Context) error {
		incoming := &Incoming{}
		if err := c.Bind(incoming); err != nil {
			return err
		}
		log.Printf("Got something: %#v", incoming)
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})
	if err := e.Start(":3075"); err != nil {
		log.Fatal(err)
	}
}
