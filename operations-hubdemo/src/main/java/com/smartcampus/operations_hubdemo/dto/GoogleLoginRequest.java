package com.smartcampus.operations_hubdemo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record GoogleLoginRequest(
        @Size(max = 120, message = "Full name must be 120 characters or less")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Pattern(
                regexp = "^[A-Za-z0-9._%+-]+@my\\.sliit\\.lk$",
                message = "Only @my.sliit.lk email addresses are allowed"
        )
        @Size(max = 120, message = "Email must be 120 characters or less")
        String email
) {
}
