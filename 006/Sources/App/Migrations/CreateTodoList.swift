import Fluent

struct CreateTodoList: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("todolists")
            .id()
            .field("title", .string, .required)
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema("todolists").delete()
    }
}
