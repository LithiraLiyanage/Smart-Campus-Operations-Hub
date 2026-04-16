package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String priority;
    private String location;

    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    private String assignedTechnician;
    private String resolutionNotes;

    private List<String> attachments; // image URLs

    private LocalDateTime createdAt = LocalDateTime.now();
}