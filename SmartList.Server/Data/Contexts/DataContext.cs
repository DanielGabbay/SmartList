using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartList.Server.Entities;

namespace SmartList.Server.Data.Contexts;

public class DataContext : IdentityDbContext<User, IdentityRole<Guid>, Guid, IdentityUserClaim<Guid>, UserRole,
    IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    // For system entities:
    public new DbSet<User> Users { get; set; }
    public new DbSet<UserRole> UserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // For system entities:
        // User Entity
        builder.Entity<User>(entity =>
        {
            entity.Property(u => u.CreatedAt).IsRequired();
            entity.Property(u => u.CreatedBy).IsRequired();
            entity.Property(u => u.UpdatedAt).IsRequired();
            entity.Property(u => u.UpdatedBy).IsRequired();
        });

        // Role Entity
        builder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });
            entity.HasOne(ur => ur.User).WithMany(u => u.Roles).HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ur => ur.Role).WithMany().HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}