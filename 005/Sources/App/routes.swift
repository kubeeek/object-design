import Fluent
import Vapor

func routes(_ app: Application) throws {
    app.get { req in
        return req.view.render("index", ["title": "Hello Vapor!"])
    }

    app.get("hello") { req -> String in
        return "Hello, world!"
    }

    try app.register(collection: TodoListController())
    try app.register(collection: TaskController())
    try app.register(collection: UserController())

    print(app.routes.all) 
}
