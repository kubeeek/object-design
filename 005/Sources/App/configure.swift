import Fluent
import FluentSQLiteDriver
import Leaf
import Vapor

// configures your application
public func configure(_ app: Application) throws {
    // uncomment to serve files from /Public folder
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)

    app.passwords.use(.bcrypt)

    app.migrations.add(CreateTodoList())
    app.migrations.add(CreateTask())
    app.migrations.add(CreateUser())

    app.views.use(.leaf)

    

    // register routes
    try routes(app)
}
