package backend.repository;

import backend.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByStudentEmailOrderByCreatedAtDesc(String studentEmail);
    List<Ticket> findByAssignedTechnicianEmailOrderByCreatedAtDesc(String technicianEmail);
}
