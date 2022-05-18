import Fluent


struct CreateUser: AsyncMigration {
    // Prepares the database for storing Task models.
    func prepare(on database: Database) async throws {
        try await database.schema("users")
            .id()
            .field("name", .string)
            .field("password", .string)
            .create()
    }

    // Optionally reverts the changes made in the prepare method.
    func revert(on database: Database) async throws {
        try await database.schema("users").delete()
    }
}