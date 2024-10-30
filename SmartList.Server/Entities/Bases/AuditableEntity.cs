namespace SmartList.Server.Entities.Bases;

public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    Guid CreatedBy { get; set; }
    DateTime UpdatedAt { get; set; }
    Guid UpdatedBy { get; set; }
}

public class AuditableEntity : IAuditable
{
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid UpdatedBy { get; set; }

    public void SetCreated(Guid userId)
    {
        CreatedAt = DateTime.Now;
        CreatedBy = userId;
    }

    public void SetUpdated(Guid userId)
    {
        UpdatedAt = DateTime.Now;
        UpdatedBy = userId;
    }

    public void SetCreatedAndUpdated(Guid userId)
    {
        SetCreated(userId);
        SetUpdated(userId);
    }
}