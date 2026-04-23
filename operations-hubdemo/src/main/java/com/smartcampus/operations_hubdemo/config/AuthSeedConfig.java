package com.smartcampus.operations_hubdemo.config;

import com.smartcampus.operations_hubdemo.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthSeedConfig {

    @Bean
    CommandLineRunner seedAuthUsers(AuthService authService) {
        return args -> authService.ensureSystemAccounts();
    }
}
