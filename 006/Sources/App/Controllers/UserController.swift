import Fluent
import Vapor

/// Groups collections of routes together for adding to a router.
/// Handles a Create, Read, Update, Delete pattern.
///
/// - route:
///     /users
struct UserController: RouteCollection {
    /// Registers routes to the incoming router.
    ///
    /// - parameters:
    ///     - routes: `RoutesBuilder` - Register any new routes to.
    func boot(routes: RoutesBuilder) throws {
        let users = routes.grouped("users")
        users.get(use: index)
        users.get("create", use: showCreateForm)
        users.post("create", use: create)

        users.group(":userID") { user in
            user.get(use: details)
            user.post(use: update)
            user.delete("delete", use: delete)
        }
    }

    /// Handles a GET request (READ). Gets an `Collection` of `User`s. Returns them in a View.
    ///
    /// - route: /users/
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `View` response.
    func index(req: Request) async throws -> View {
        let users = try await User.query(on: req.db).all()

        return try await req.view.render("users/index", CollectionResponseContext<User>(entityCollection: users))
    }

    /// Handles a GET request (READ). Get an invididual of `User` and return in in a View.
    ///
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func details(req: Request) async throws -> View {
        guard let user = try await User.find(req.parameters.get("userID"), on: req.db) else {
            throw Abort(.notFound)
        }

        return try await req.view.render("users/edit", ResponseContext<User>(entity: user))
    }

    /// Handles a GET request. Returns a `View` with a form for creating the `User`
    ///
    /// - route: /users/create
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `View` response.
    func showCreateForm(req: Request) async throws -> View {
        try await req.view.render("users/create")
    }

    /// Handles a POST request (CREATE). Creates a new invididual of `User`.
    ///
    /// - route: /users/create
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func create(req: Request) async throws -> Response {
        let data = try req.content.decode(User.Input.self)

        let hash = try req.password.hash(data.password!)

        let user = User(name: data.name, password: hash)
        try await user.save(on: req.db)

        return req.redirect(to: "/users")
    }

    /// Handles a POST request (UPDATE). Update an invididual of `User` and return changed entity in a View.
    ///
    /// - route: /users/{USER_ID}
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func update(req: Request) async throws -> Response {
        guard let user = try await User.find(req.parameters.get("userID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let formInputData = try req.content.decode(User.Input.self)

        user.name = formInputData.name
        try await user.update(on: req.db)

        let route = "/users/\(user.id!)";
        return req.redirect(to: route)
    }

    /// Handles a DELETE request (DELETE). Update an invididual of `User` and return changed entity in a View.
    ///
    /// - route: /users/{USER_ID}/delete
    /// - parameters:
    ///     - req: `Request` - An incoming HTTP request
    /// - returns: A `Response` as a HTTP 303 redirect.
    func delete(req: Request) async throws -> Response {
        guard let user = try await User.find(req.parameters.get("userID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await user.delete(on: req.db)
        return req.redirect(to: "/users")
    }
}
