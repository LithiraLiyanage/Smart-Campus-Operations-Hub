package backend.Service;

import backend.Dto.ResourceRequestDto;
import backend.Dto.ResourceStatusUpdateDto;
import backend.Enum.ResourceStatus;
import backend.Enum.ResourceType;
import backend.Model.Resource;

import java.util.List;

public interface ResourceService {

    Resource createResource(ResourceRequestDto dto);

    List<Resource> getAllResources();

    Resource getResourceById(String id);

    Resource updateResource(String id, ResourceRequestDto dto);

    void deleteResource(String id);

    Resource updateResourceStatus(String id, ResourceStatusUpdateDto dto);

    List<Resource> searchResources(ResourceType type, Integer capacity, String location, ResourceStatus status);
}