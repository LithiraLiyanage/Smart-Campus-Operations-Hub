package backend.controller;

import backend.model.Ticket;
import backend.service.TicketService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Ticket createTicket(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String priority,
            @RequestParam String location,
            @RequestParam String preferredContact,
            @RequestParam String studentName,
            @RequestParam String studentEmail,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        return ticketService.createTicket(title, description, category, priority, location, preferredContact, studentName, studentEmail, files);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/student/{email}")
    public List<Ticket> getTicketsByStudent(@PathVariable String email) {
        return ticketService.getTicketsByStudent(email);
    }

    @GetMapping("/technician/{email}")
    public List<Ticket> getTicketsByTechnician(@PathVariable String email) {
        return ticketService.getTicketsByTechnician(email);
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @PatchMapping("/{id}/approve")
    public Ticket approveTicket(
            @PathVariable String id,
            @RequestParam String role,
            @RequestParam String technicianName,
            @RequestParam String technicianEmail
    ) {
        return ticketService.approveTicket(id, technicianName, technicianEmail, role);
    }

    @PatchMapping("/{id}/reject")
    public Ticket rejectTicket(@PathVariable String id, @RequestParam String role, @RequestBody String reason) {
        return ticketService.rejectTicket(id, reason, role);
    }

    @PatchMapping(value = "/{id}/resolve", consumes = {"multipart/form-data"})
    public Ticket resolveTicket(
            @PathVariable String id,
            @RequestParam String role,
            @RequestParam String resolutionNotes,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        return ticketService.resolveTicket(id, resolutionNotes, files, role);
    }

    @PatchMapping("/{id}/close")
    public Ticket closeTicket(@PathVariable String id, @RequestParam String role) {
        return ticketService.closeTicket(id, role);
    }

    @PostMapping("/{id}/comments")
    public Ticket addComment(@PathVariable String id, @RequestBody String comment) {
        return ticketService.addComment(id, comment);
    }

    @DeleteMapping("/{id}/comments/{index}")
    public Ticket deleteComment(@PathVariable String id, @PathVariable int index) {
        return ticketService.deleteComment(id, index);
    }
}
