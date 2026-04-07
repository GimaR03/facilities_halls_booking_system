package com.smartcampus.operations_hubdemo.service;

import com.smartcampus.operations_hubdemo.dto.CreateTicketRequest;
import com.smartcampus.operations_hubdemo.dto.TicketResponse;
import com.smartcampus.operations_hubdemo.model.Ticket;
import com.smartcampus.operations_hubdemo.repository.TicketRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {
    private static final Path UPLOAD_ROOT = Paths.get("uploads", "tickets");

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketResponse> getTickets() {
        return ticketRepository.findAll().stream()
                .sorted(Comparator.comparing(Ticket::getCreatedDate).reversed())
                .map(this::toTicketResponse)
                .toList();
    }

    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request, List<MultipartFile> images) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title().trim());
        ticket.setDescription(request.description().trim());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setStatus(request.status());
        ticket.setResourceId(request.resourceId());
        ticket.setUserId(request.userId());
        ticket.setAssignedTechnicianId(normalizeOptionalText(request.assignedTechnicianId()));
        ticket.setCreatedDate(request.createdDate());
        ticket.setImageUrls(storeImages(images));

        Ticket saved = ticketRepository.save(ticket);
        return toTicketResponse(saved);
    }

    private List<String> storeImages(List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }

        try {
            Files.createDirectories(UPLOAD_ROOT);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to create uploads directory", exception);
        }

        return images.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(this::storeSingleImage)
                .toList();
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String storeSingleImage(MultipartFile image) {
        String originalName = image.getOriginalFilename();
        String safeName = originalName == null
                ? "ticket-image"
                : originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = UUID.randomUUID() + "-" + safeName;
        Path destination = UPLOAD_ROOT.resolve(storedName);

        try {
            Files.copy(image.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to store uploaded image", exception);
        }

        return "/uploads/tickets/" + storedName;
    }

    private TicketResponse toTicketResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getResourceId(),
                ticket.getUserId(),
                ticket.getAssignedTechnicianId(),
                new ArrayList<>(ticket.getImageUrls()),
                ticket.getCreatedDate()
        );
    }
}
