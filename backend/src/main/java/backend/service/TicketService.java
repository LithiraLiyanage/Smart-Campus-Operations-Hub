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

    public Ticket createTicket(
            String title,
            String description,
            String category,
            String priority,
            String location,
            String preferredContact,
            String studentName,
            String studentEmail,
            MultipartFile[] files
    ) throws IOException {

        requireText(title, "Title is required");
        requireText(description, "Description is required");
        requireText(category, "Category is required");
        requireText(priority, "Priority is required");
        requireText(location, "Location is required");
        requireText(preferredContact, "Preferred contact is required");
        requireText(studentName, "Student name is required");
        requireText(studentEmail, "Student email is required");

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setLocation(location);
        ticket.setPreferredContact(preferredContact);
        ticket.setStudentName(studentName);
        ticket.setStudentEmail(studentEmail);
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        if (files != null && files.length > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed");
        }

        saveFiles(files, ticket.getAttachments());
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByStudent(String studentEmail) {
        return ticketRepository.findByStudentEmailOrderByCreatedAtDesc(studentEmail);
    }

    public List<Ticket> getTicketsByTechnician(String technicianEmail) {
        return ticketRepository.findByAssignedTechnicianEmailOrderByCreatedAtDesc(technicianEmail);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket approveTicket(String id, String technicianName, String technicianEmail, String role) {
        checkRole(role, "ADMIN");
        requireText(technicianName, "Technician name is required");
        requireText(technicianEmail, "Technician email is required");

        Ticket ticket = getTicketById(id);
        ticket.setAssignedTechnician(technicianName);
        ticket.setAssignedTechnicianEmail(technicianEmail);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket rejectTicket(String id, String reason, String role) {
        checkRole(role, "ADMIN");
        requireText(reason, "Reject reason is required");

        Ticket ticket = getTicketById(id);
        ticket.setStatus("REJECTED");
        ticket.setRejectedReason(reason);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(String id, String resolutionNotes, MultipartFile[] files, String role) throws IOException {
        checkRole(role, "TECHNICIAN");
        requireText(resolutionNotes, "Resolution comment is required");

        Ticket ticket = getTicketById(id);
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setStatus("RESOLVED");

        int currentCount = ticket.getResolutionImages() != null ? ticket.getResolutionImages().size() : 0;
        int newCount = files == null ? 0 : files.length;
        if (currentCount + newCount > 3) {
            throw new RuntimeException("Maximum 3 resolution images allowed");
        }

        saveFiles(files, ticket.getResolutionImages());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket closeTicket(String id, String role) {
        checkRole(role, "ADMIN");
        Ticket ticket = getTicketById(id);
        ticket.setStatus("CLOSED");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket addComment(String id, String comment) {
        Ticket ticket = getTicketById(id);
        requireText(comment, "Comment cannot be empty");
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket deleteComment(String id, int index) {
        Ticket ticket = getTicketById(id);
        if (index < 0 || index >= ticket.getComments().size()) {
            throw new RuntimeException("Invalid comment index");
        }
        ticket.getComments().remove(index);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    private void saveFiles(MultipartFile[] files, List<String> targetList) throws IOException {
        if (files == null || files.length == 0) {
            return;
        }

        File uploadDir = new File(System.getProperty("user.dir") + File.separator + "uploads");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                File destinationFile = new File(uploadDir, fileName);
                file.transferTo(destinationFile);
                targetList.add(fileName);
            }
        }
    }

    private void requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new RuntimeException(message);
        }
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
