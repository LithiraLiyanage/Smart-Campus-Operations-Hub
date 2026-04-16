package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private String preferredContact;

    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED

    private String assignedTechnician;
    private String resolutionNotes;
    private String rejectedReason;

    private List<String> attachments = new ArrayList<>();
    private List<String> comments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}