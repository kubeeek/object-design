package com.example.demo.Controller

import com.example.demo.Service.IAuthorizationService
import com.example.demo.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class HtmlController(
    @Autowired
    val authorizationService: IAuthorizationService
) {

    @PostMapping("/login")
    fun login(@RequestBody user: User): String {
        try {
            authorizationService.authorize(user.username, user.password)
        } catch (err: Exception) {
            return err.toString()
        }

        return "success";
    }
}