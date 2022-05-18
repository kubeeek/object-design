import Fluent
import Vapor

/// Contexts needed in order to properly format data into a `View` response.
///
typealias TodolistCollectionResponseContext = CollectionResponseContext<TodoList>

typealias TodolistResponseContext = ResponseContext<TodoList>


/// Groups collections of routes together for adding to a router.
/// Handles a Create, Read, Update, Delete pattern.
///
/// - route:
///     /todolists
struct TodoListController: RouteCollection {
    /// Registers routes to the incoming router.
    ///
    /// - parameters:
    ///     - routes: `RoutesBuilder` - Register any new routes to.
    func boot(routes: RoutesBuilder) throws {
        let todolists = routes.grouped("todolists")
        todolists.get(use: index)
        todolists.post(_: "create", use: create)

        todolists.group(":todolistID") { todolist in
            todolist.get(use: details)
            todolist.post(use: update)
            todolist.delete("delete", use: delete)
        }
    }

    /// Handles a GET request (READ). Gets an `Collection` of `TodoList`s and returns them in a View.
    ///
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `View` response.
    func index(req: Request) async throws -> View {
        let todolists = try await TodoList.query(on: req.db).with(\.$tasks).all()
        return try await req.view.render("todolists/index", TodolistCollectionResponseContext(entityCollection: todolists))
    }

    /// Handles a POST request (CREATE). Create an invididual of `TodoList` and redirect to a READ route.
    ///
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func create(req: Request) async throws -> Response {
        let data = try req.content.decode(TodoList.Input.self)
        let todolist = TodoList(title: data.title)

        try await  todolist.save(on: req.db)
        return req.redirect(to: "/todolists")
    }

    /// Handles a GET request (READ). Get an invididual of `TodoList` and return in in a View.
    ///
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func details(req: Request) async throws -> View {
        guard let todolist = try await TodoList.find(req.parameters.get("todolistID"), on: req.db) else {
            throw Abort(.notFound)
        }

        return try await req.view.render("todolists/edit", TodolistResponseContext(entity: todolist))
    }

    /// Handles a POST request (UPDATE). Update an invididual of `TodoList` and return changed entity in a View.
    ///
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func update(req: Request) async throws -> Response {
        guard let todolist = try await TodoList.find(req.parameters.get("todolistID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let formInputData = try req.content.decode(TodoList.Input.self)

        todolist.title = formInputData.title
        try await todolist.update(on: req.db)

        let route = "/todolists/\(todolist.id!)";
        return req.redirect(to: route)
    }

    /// Handles a DELETE request (DELETE). Update an invididual of `TodoList` and return collection in a View.
    ///
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func delete(req: Request) async throws -> Response {
        print("ok")
        guard let todolist = try await TodoList.find(req.parameters.get("todolistID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await todolist.delete(on: req.db)
        return req.redirect(to: "/tasks")
    }
}
