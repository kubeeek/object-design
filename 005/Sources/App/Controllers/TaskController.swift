import Fluent
import Vapor

/// Contexts needed in order to properly format data into a `View` response.
///
typealias TaskCollectionResponseContext = CollectionResponseContext<Task>

typealias TaskResponseContext = ResponseContext<Task>

struct TaskTodolistResponseContext : Encodable {
    let tasks: [Task]
    let todolists: [TodoList]
}

/// Groups collections of routes together for adding to a router.
/// Handles a Create, Read, Update, Delete pattern.
///
/// - route:
///     /tasks
struct TaskController: RouteCollection {
    /// Registers routes to the incoming router.
    ///
    /// - parameters:
    ///     - routes: `RoutesBuilder` - Register any new routes to.
    func boot(routes: RoutesBuilder) throws {
        let tasks = routes.grouped("tasks")
        tasks.get(use: index)
        tasks.post(_: "create", use: create)

        tasks.group(":taskID") { task in
            task.get(use: details)
            task.post(use: update)
            task.delete("delete", use: delete)
        }
    }

    /// Handles a GET request (READ). Gets an `Collection` of `Task`s and `TodoList`s. Returns them in a View.
    ///
    /// - route: /tasks/
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `View` response.
    func index(req: Request) async throws -> View {
        let tasks = try await Task.query(on: req.db).with(\.$todolist).all()
        let todolists = try await TodoList.query(on: req.db).all()

        return try await req.view.render("tasks/index", TaskTodolistResponseContext(tasks: tasks, todolists: todolists))
    }

    /// Handles a POST request (CREATE). Create an invididual of `Task` and redirects to a READ route.
    ///
    /// - route: /tasks/create
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func create(req: Request) async throws -> Response {
        let data = try req.content.decode(Task.Input.self)

        let task = Task(name: data.name, todolistID: UUID(data.todolist!)!)
        try await task.save(on: req.db)

        return req.redirect(to: "/tasks")
    }

    /// Handles a GET request (READ). Get an invididual of `Task` and return in in a View.
    ///
    /// - route: /tasks/{TASK_ID}
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func details(req: Request) async throws -> View {
        guard let task = try await Task.find(req.parameters.get("taskID"), on: req.db) else {
            throw Abort(.notFound)
        }

        return try await req.view.render("tasks/edit", TaskResponseContext(entity: task))
    }

    /// Handles a POST request (UPDATE). Update an invididual of `TodoList` and return changed entity in a View.
    ///
    /// - route: /tasks/{TASK_ID}
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func update(req: Request) async throws -> Response {
        guard let task = try await Task.find(req.parameters.get("taskID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let formInputData = try req.content.decode(Task.Input.self)

        task.name = formInputData.name
        try await task.update(on: req.db)

        let route = "/tasks/\(task.id!)";
        return req.redirect(to: route)
    }

    /// Handles a DELETE request (DELETE). Update an invididual of `Task` and return changed entity in a View.
    ///
    /// - route: /tasks/{TASK_ID}/delete
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func delete(req: Request) async throws -> Response {
        guard let task = try await Task.find(req.parameters.get("taskID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await task.delete(on: req.db)
        return req.redirect(to: "/tasks")
    }
}
