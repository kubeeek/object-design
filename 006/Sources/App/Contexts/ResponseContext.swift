import Fluent
import Vapor

struct ResponseContext<E: Encodable> : Encodable {
    let entity: E
}