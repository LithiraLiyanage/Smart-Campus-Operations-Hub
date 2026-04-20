package backend.Controller;

import backend.Dto.ResourceRequestDto;
import backend.Dto.ResourceStatusUpdateDto;
import backend.Enum.ResourceStatus;
import backend.Enum.ResourceType;
import backend.Model.Resource;
import backend.Service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceRequestDto dto) {
        return new ResponseEntity<>(resourceService.createResource(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
        @PathVariable String id,
        @Valid @RequestBody ResourceRequestDto dto
    ) {
    return ResponseEntity.ok(resourceService.updateResource(id, dto));
   }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok("Resource deleted successfully");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> updateResourceStatus(@PathVariable String id, @Valid @RequestBody ResourceStatusUpdateDto dto) {
          return ResponseEntity.ok(resourceService.updateResourceStatus(id, dto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status
    ) {
        return ResponseEntity.ok(resourceService.searchResources(type, capacity, location, status));
    }
}