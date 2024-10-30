using Microsoft.AspNetCore.Identity;
using SmartList.Server.Entities.Bases;

namespace SmartList.Server.Entities;

public class User : IdentityUser<Guid>, IAuditable
{
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid UpdatedBy { get; set; }

    public virtual ICollection<UserRole> Roles { get; } = [];

    public User()
    {
    }

    public User(Guid createdById)
    {
        SetCreatedAndUpdated(createdById);
    }

    public void SetCreatedAndUpdated(Guid userId)
    {
        CreatedAt = DateTime.Now;
        CreatedBy = userId;
        UpdatedAt = DateTime.Now;
        UpdatedBy = userId;
    }
}

public sealed class UserRole : IdentityUserRole<Guid>
{
    public required User User { get; set; }
    public IdentityRole<Guid> Role { get; set; } = new();
}