package com.smartcampus.operations_hubdemo.dto;

import com.smartcampus.operations_hubdemo.model.TicketCategory;
import com.smartcampus.operations_hubdemo.model.TicketPriority;
import com.smartcampus.operations_hubdemo.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateTicketRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must be 150 characters or less")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must be 2000 characters or less")
        String description,

        @NotNull(message = "Category is required")
        TicketCategory category,

        @NotNull(message = "Priority is required")
        TicketPriority priority,

        @NotNull(message = "Status is required")
        TicketStatus status,

        @NotNull(message = "Resource ID is required")
        Long resourceId,

        @NotNull(message = "User ID is required")
        Long userId,

        @Size(max = 100, message = "Hall or lab number must be 100 characters or less")
        String assignedTechnicianId,

        @NotNull(message = "Created date is required")
        LocalDateTime createdDate
) {
}
