package backend.service;

import backend.model.Ticket;
import backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // Create Ticket with Validation
    public Ticket createTicket(Ticket ticket) {

        if (ticket.getTitle() == null || ticket.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }

        if (ticket.getDescription() == null || ticket.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }

        if (ticket.getCategory() == null || ticket.getCategory().trim().isEmpty()) {
            throw new RuntimeException("Category is required");
        }

        if (ticket.getPriority() == null || ticket.getPriority().trim().isEmpty()) {
            throw new RuntimeException("Priority is required");
        }

        if (ticket.getPreferredContact() == null || ticket.getPreferredContact().trim().isEmpty()) {
            throw new RuntimeException("Preferred contact is required");
        }

        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // Get All Tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get Ticket by ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // Update Status
    public Ticket updateStatus(String id, String status, String role) {

    checkRole(role, "TECHNICIAN", "ADMIN");

    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

    ticket.setStatus(status);
    ticket.setUpdatedAt(java.time.LocalDateTime.now());

    return ticketRepository.save(ticket);
    }

    // Assign Technician
    public Ticket assignTechnician(String id, String technician, String role) {

    checkRole(role, "TECHNICIAN", "ADMIN");

    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

    ticket.setAssignedTechnician(technician);
    ticket.setUpdatedAt(java.time.LocalDateTime.now());

    return ticketRepository.save(ticket);
    }

    // Add Comment
    public Ticket addComment(String id, String comment) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (comment == null || comment.trim().isEmpty()) {
            throw new RuntimeException("Comment cannot be empty");
        }

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // Delete Comment
    public Ticket deleteComment(String id, int index) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (index < 0 || index >= ticket.getComments().size()) {
            throw new RuntimeException("Invalid comment index");
        }

        ticket.getComments().remove(index);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // Update Resolution Notes
    public Ticket updateResolutionNotes(String id, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setResolutionNotes(resolutionNotes);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // Reject Ticket
    public Ticket rejectTicket(String id, String reason, String role) {

    checkRole(role, "ADMIN"); // only ADMIN allowed

    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

    ticket.setStatus("REJECTED");
    ticket.setRejectedReason(reason);
    ticket.setUpdatedAt(java.time.LocalDateTime.now());

    return ticketRepository.save(ticket);
    }
    // Upload Attachments
    public Ticket uploadAttachments(String id, MultipartFile[] files) throws IOException {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (files == null || files.length == 0) {
            throw new RuntimeException("No files uploaded");
        }

        int currentCount = ticket.getAttachments() != null ? ticket.getAttachments().size() : 0;

        if (currentCount + files.length > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed");
        }

        File uploadDir = new File(System.getProperty("user.dir") + File.separator + "uploads");

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                File destinationFile = new File(uploadDir, fileName);
                file.transferTo(destinationFile);
                ticket.getAttachments().add(fileName);
            }
        }

        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    private void checkRole(String role, String... allowedRoles) {
    if (role == null || role.trim().isEmpty()) {
        throw new RuntimeException("Role is required");
    }

    for (String allowed : allowedRoles) {
        if (allowed.equalsIgnoreCase(role)) {
            return;
        }
    }

    throw new RuntimeException("Access denied for role: " + role);
    }
}