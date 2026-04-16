package backend.controller;

import backend.model.Ticket;
import backend.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id, @RequestBody String status) {
        return ticketService.updateStatus(id, status);
    }

    @PatchMapping("/{id}/assign")
    public Ticket assignTechnician(@PathVariable String id, @RequestBody String technician) {
        return ticketService.assignTechnician(id, technician);
    }

    @PostMapping("/{id}/comments")
    public Ticket addComment(@PathVariable String id, @RequestBody String comment) {
        return ticketService.addComment(id, comment);
    }

    @DeleteMapping("/{id}/comments/{index}")
    public Ticket deleteComment(@PathVariable String id, @PathVariable int index) {
        return ticketService.deleteComment(id, index);
    }

    @PatchMapping("/{id}/resolution")
    public Ticket updateResolutionNotes(@PathVariable String id, @RequestBody String resolutionNotes) {
        return ticketService.updateResolutionNotes(id, resolutionNotes);
    }

    @PatchMapping("/{id}/reject")
    public Ticket rejectTicket(@PathVariable String id,
                           @RequestParam String role,
                           @RequestBody String reason) {
    return ticketService.rejectTicket(id, reason, role);
    }

    @PatchMapping("/{id}/attachments")
    public Ticket uploadAttachments(@PathVariable String id,
    @RequestParam("files") MultipartFile[] files) throws IOException {
        return ticketService.uploadAttachments(id, files);
    }
}