import Fluent
import Vapor

struct CollectionResponseContext<E: Encodable> : Encodable {
    let entityCollection: [E]
}