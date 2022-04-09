package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

const baseUrl string = "https://api.waqi.info"

type AQICNService struct {
	token string
}

func (is AQICNService) getCityData(city string) map[string]interface{} {
	query := is.appendToken(baseUrl + "/feed/" + city)

	log.Print(query)
	resp, err := http.Get(query)

	if err != nil {
		log.Print(resp)
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var data map[string]interface{}

	err = json.Unmarshal([]byte(body), &data)
	if err != nil {
		panic(err)
	}

	return data
}

func (is AQICNService) appendToken(url string) string {
	return string(url + "/?token=" + is.token)
}
