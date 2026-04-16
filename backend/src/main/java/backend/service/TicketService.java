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
}