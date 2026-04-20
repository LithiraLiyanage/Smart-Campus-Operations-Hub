package backend.ServiceImpl;

import backend.Service.ResourceService;
import backend.Dto.ResourceRequestDto;
import backend.Dto.ResourceStatusUpdateDto;
import backend.Enum.ResourceStatus;
import backend.Enum.ResourceType;
import backend.Exception.BadRequestException;
import backend.Exception.ResourceNotFoundException;
import backend.Model.Resource;
import backend.Repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public Resource createResource(ResourceRequestDto dto) {
        validateResource(dto);

        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setAvailableFrom(dto.getAvailableFrom());
        resource.setAvailableTo(dto.getAvailableTo());
        resource.setStatus(dto.getStatus());

        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(String id, ResourceRequestDto dto) {
        validateResource(dto);

        Resource resource = getResourceById(id);

        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setAvailableFrom(dto.getAvailableFrom());
        resource.setAvailableTo(dto.getAvailableTo());
        resource.setStatus(dto.getStatus());

        return resourceRepository.save(resource);
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }

    @Override
    public Resource updateResourceStatus(String id, ResourceStatusUpdateDto dto) {
        Resource resource = getResourceById(id);
        resource.setStatus(dto.getStatus());
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> searchResources(ResourceType type, Integer capacity, String location, ResourceStatus status) {
        return resourceRepository.findAll().stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> capacity == null || r.getCapacity() >= capacity)
                .filter(r -> location == null || location.isBlank() || r.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(r -> status == null || r.getStatus() == status)
                .collect(Collectors.toList());
    }

    private void validateResource(ResourceRequestDto dto) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new BadRequestException("Resource name is required");
        }
        if (dto.getType() == null) {
            throw new BadRequestException("Resource type is required");
        }
        if (dto.getCapacity() == null || dto.getCapacity() < 1) {
            throw new BadRequestException("Capacity must be at least 1");
        }
        if (dto.getLocation() == null || dto.getLocation().isBlank()) {
            throw new BadRequestException("Location is required");
        }
        if (dto.getAvailableFrom() == null || dto.getAvailableTo() == null) {
            throw new BadRequestException("Availability time range is required");
        }
        if (!dto.getAvailableFrom().isBefore(dto.getAvailableTo())) {
            throw new BadRequestException("Available from time must be earlier than available to time");
        }
        if (dto.getStatus() == null) {
            throw new BadRequestException("Status is required");
        }
    }
}