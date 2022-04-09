package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

var loaded bool

/* real */
type EnvironmentGetterReal struct {
}

func (egr EnvironmentGetterReal) getKey(key string) string {
	return os.Getenv(key)
}

func (egr EnvironmentGetterReal) hasKey(key string) bool {
	_, set := os.LookupEnv(key)

	return set
}

/* proxy */
type EnvironmentGetter struct {
	super EnvironmentGetterReal
}

func (eg EnvironmentGetter) getKey(key string) (result string, err error) {
	set := eg.super.hasKey(key)
	if set && loaded {
		return os.Getenv(key), nil
	}

	fmt.Printf("%s not found.\n", key)
	fmt.Print(".env file not loaded. Loading now.\n")

	err = godotenv.Load()
	loaded = true
	if err != nil {
		fmt.Errorf("err: %s\n", err)

		return "", err
	}

	val := eg.super.getKey(key)
	fmt.Printf("%s found. Value: %s\n", key, val)

	return val, nil
}

func (eg EnvironmentGetter) hasKey(key string) bool {
	return eg.super.hasKey(key)
}
