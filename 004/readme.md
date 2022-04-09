App uses a air quality index api (AQICN). There is a one endpoint. ``localhost:1324/:city`` which returns a simple JSON reply for the given city. 

The proxy class is in ``EnvironmentGetter.go``. It works as a lazy initializer of the real class.

API key left as eventually to test the app.