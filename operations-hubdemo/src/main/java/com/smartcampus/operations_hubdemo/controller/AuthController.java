package com.smartcampus.operations_hubdemo.controller;

import com.smartcampus.operations_hubdemo.dto.AuthUserResponse;
import com.smartcampus.operations_hubdemo.dto.CreateAdminRequest;
import com.smartcampus.operations_hubdemo.dto.GoogleLoginRequest;
import com.smartcampus.operations_hubdemo.dto.LoginRequest;
import com.smartcampus.operations_hubdemo.dto.RegisterRequest;
import com.smartcampus.operations_hubdemo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthUserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthUserResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google-login")
    public AuthUserResponse googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        return authService.googleLogin(request);
    }

    @PostMapping("/admins")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthUserResponse createAdmin(
            @RequestHeader("X-User-Email") String actingAdminEmail,
            @Valid @RequestBody CreateAdminRequest request
    ) {
        return authService.createAdmin(actingAdminEmail, request);
    }

    @GetMapping("/admins")
    public java.util.List<AuthUserResponse> getAllAdmins(
            @RequestHeader("X-User-Email") String actingAdminEmail
    ) {
        return authService.getAllAdmins(actingAdminEmail);
    }

    @PostMapping("/maintenance")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthUserResponse createMaintenance(
            @RequestHeader("X-User-Email") String actingAdminEmail,
            @Valid @RequestBody CreateAdminRequest request
    ) {
        return authService.createMaintenance(actingAdminEmail, request);
    }

    @GetMapping("/maintenance")
    public java.util.List<AuthUserResponse> getAllMaintenance(
            @RequestHeader("X-User-Email") String actingAdminEmail
    ) {
        return authService.getAllMaintenance(actingAdminEmail);
    }

    @GetMapping("/users")
    public java.util.List<AuthUserResponse> getAllUsers(
            @RequestHeader("X-User-Email") String actingAdminEmail
    ) {
        return authService.getAllUsers(actingAdminEmail);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(
            @RequestHeader("X-User-Email") String actingAdminEmail,
            @org.springframework.web.bind.annotation.PathVariable Long id
    ) {
        authService.deleteUser(actingAdminEmail, id);
    }
}
