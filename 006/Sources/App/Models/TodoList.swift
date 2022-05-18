import Fluent
import Vapor

final class TodoList: Model {
    struct Input: Content {
        let title: String
    }

    struct Output: Content {
        let id: String
        let title: String
    }

    static let schema = "todolists"
    
    @ID(key: .id)
    var id: UUID?

    @Field(key: "title")
    var title: String

    @Children(for: \.$todolist)
    var tasks: [Task]

    init() { }

    init(id: UUID? = nil, title: String) {
        self.id = id
        self.title = title
    }
}
