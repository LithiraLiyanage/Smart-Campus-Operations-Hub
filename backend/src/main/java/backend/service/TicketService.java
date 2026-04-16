package backend.service;

import backend.model.Ticket;
import backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // Create Ticket
    public Ticket createTicket(Ticket ticket) {
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

    public Ticket updateStatus(String id, String status) {
    Ticket ticket = ticketRepository.findById(id).orElse(null);

    if (ticket != null) {
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    return null;
    }

    public Ticket assignTechnician(String id, String technician) {
    Ticket ticket = ticketRepository.findById(id).orElse(null);

    if (ticket != null) {
        ticket.setAssignedTechnician(technician);
        return ticketRepository.save(ticket);
    }

    return null;
    }

    public Ticket addComment(String id, String comment) {
    Ticket ticket = ticketRepository.findById(id).orElse(null);

    if (ticket != null) {
        ticket.getComments().add(comment);
        return ticketRepository.save(ticket);
    }

    return null;
    }

    public Ticket deleteComment(String id, int index) {
    Ticket ticket = ticketRepository.findById(id).orElse(null);

    if (ticket != null && ticket.getComments().size() > index) {
        ticket.getComments().remove(index);
        return ticketRepository.save(ticket);
    }

    return null;
    }

    public Ticket updateResolutionNotes(String id, String resolutionNotes) {
    Ticket ticket = ticketRepository.findById(id).orElse(null);

    if (ticket != null) {
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setUpdatedAt(java.time.LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    return null;
    }
}