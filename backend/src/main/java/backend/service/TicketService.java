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

    // Create Ticket
    public Ticket createTicket(Ticket ticket) {
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
        return ticketRepository.findById(id).orElse(null);
    }

    // Update Ticket Status
    public Ticket updateStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null) {
            ticket.setStatus(status);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Assign Technician
    public Ticket assignTechnician(String id, String technician) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null) {
            ticket.setAssignedTechnician(technician);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Add Comment
    public Ticket addComment(String id, String comment) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null) {
            ticket.getComments().add(comment);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Delete Comment by Index
    public Ticket deleteComment(String id, int index) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null && ticket.getComments() != null && index >= 0 && index < ticket.getComments().size()) {
            ticket.getComments().remove(index);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Update Resolution Notes
    public Ticket updateResolutionNotes(String id, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null) {
            ticket.setResolutionNotes(resolutionNotes);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Reject Ticket with Reason
    public Ticket rejectTicket(String id, String reason) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket != null) {
            ticket.setStatus("REJECTED");
            ticket.setRejectedReason(reason);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Upload Attachments
    public Ticket uploadAttachments(String id, MultipartFile[] files) throws IOException {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket == null) {
            return null;
        }

        if (files == null || files.length == 0) {
            throw new RuntimeException("No files were uploaded");
        }

        int currentAttachmentCount = ticket.getAttachments() != null ? ticket.getAttachments().size() : 0;

        if (currentAttachmentCount + files.length > 3) {
            throw new RuntimeException("Maximum 3 attachments are allowed per ticket");
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
}