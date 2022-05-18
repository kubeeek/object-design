import Fluent
import Vapor

final class Task: Model {
    struct Input: Content {
        let todolist: String?
        let name: String
    }

    struct Output: Content {
        let id: String
        let todolist: TodoList
        let name: String
    }

    // Name of the table or collection.
    static let schema = "tasks"

    // Unique identifier for this Task.
    @ID(key: .id)
    var id: UUID?

    // The Task's name.
    @Field(key: "name")
    var name: String

    @Parent(key: "todolist_id")
    var todolist: TodoList
    // Creates a new, empty Task.
    init() { }

    // Creates a new Task with all properties set.
    init(id: UUID? = nil, name: String, todolistID: UUID) {
        self.id = id
        self.name = name
        self.$todolist.id = todolistID
    }
}