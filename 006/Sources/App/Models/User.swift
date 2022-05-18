import Fluent
import Vapor

final class User: Model {
    struct Input: Content {
        let name: String
        let password: String?
    }

    struct Output: Content {
        let id: String
        let name: String
    }

    static let schema = "users"
    
    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "password")
    var password: String

    init() { }

    init(id: UUID? = nil, name: String, password: String) {
        self.id = id
        self.name = name
        self.password = password
    }
}
