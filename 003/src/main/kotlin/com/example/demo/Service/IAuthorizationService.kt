package com.example.demo.Service

import com.example.demo.User

interface IAuthorizationService {
    @Throws (Exception::class)
    fun authorize(username: String, password: String) : User;
}