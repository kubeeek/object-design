import Fluent


struct CreateTask: AsyncMigration {
    // Prepares the database for storing Task models.
    func prepare(on database: Database) async throws {
        try await database.schema("tasks")
            .id()
            .field("name", .string)
            .field("todolist_id", .uuid, .references("todolists", "id"))
            .create()
    }

    // Optionally reverts the changes made in the prepare method.
    func revert(on database: Database) async throws {
        try await database.schema("tasks").delete()
    }
}