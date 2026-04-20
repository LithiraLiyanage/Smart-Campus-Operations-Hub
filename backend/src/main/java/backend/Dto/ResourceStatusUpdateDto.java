package backend.Dto;

import backend.Enum.ResourceStatus;
import jakarta.validation.constraints.NotNull;

public class ResourceStatusUpdateDto {

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    public ResourceStatusUpdateDto() {
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }
}