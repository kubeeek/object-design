package com.example.demo.Service

import com.example.demo.User
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Service

@Service
@Scope("singleton")
object AuthorizationService : IAuthorizationService {
    private val allowedUsers: HashMap<String, User> = hashMapOf("test" to User("test", "123"));

    @Throws (Exception::class)
    override fun authorize(username: String, password: String): User {
        val result = allowedUsers[username];

        if(result === null || result.password != password)
            throw Exception("User not found or bad credentials");

        return result;
    }
}
