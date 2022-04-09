package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	envGet := EnvironmentGetter{EnvironmentGetterReal{}}

	apiKey, _ := envGet.getKey("API_KEY")

	aqs := AQICNService{apiKey}

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "I'm fine")
	})
	e.GET("/:city", func(c echo.Context) error {
		city := c.Param("city")

		data := aqs.getCityData(city)
		return c.JSON(http.StatusOK, data)
	})

	e.Logger.Fatal(e.Start(":1323"))
}
