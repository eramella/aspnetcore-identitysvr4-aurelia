using Microsoft.EntityFrameworkCore;

namespace LegacyData.LegacyIdentity
{
    public class LegacyIdentityContext : DbContext
    {
        public LegacyIdentityContext(DbContextOptions<LegacyIdentityContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //TABLES
            var user = modelBuilder.Entity<User>();
            user.ToTable("Users");
            user.HasKey(u => u.UserId).HasName("UserID");
            user.HasMany(u => u.UserRoles).WithOne(u => u.User);
            user.HasMany(u => u.PrimaryEmails).WithOne(u => u.User);

            var userRole = modelBuilder.Entity<UserRole>();
            userRole.ToTable("UserRole");
            userRole.HasKey(ur => ur.UserRoleId).HasName("UserRoleID");
            userRole.HasOne(ur => ur.User).WithMany(ur => ur.UserRoles);
            userRole.HasOne(ur => ur.Role).WithMany(ur => ur.UserRoles);

            var moduleAction = modelBuilder.Entity<ModuleAction>();
            moduleAction.ToTable("ModuleAction");
            moduleAction.HasKey(ma => ma.ActionId).HasName("ActionID");
            moduleAction.Property(p => p.ModuleId).HasColumnName("ModuleID");
            moduleAction.HasMany(ma => ma.RoleActions).WithOne(ma => ma.ModuleAction);
            moduleAction.HasOne(ma => ma.Module).WithMany(ma => ma.ModuleActions);
            
            var module = modelBuilder.Entity<Module>();
            module.ToTable("Modules");
            module.HasKey(m => m.ModuleId).HasName("ModuleID");
            module.HasMany(m => m.ModuleActions).WithOne(m => m.Module);

            var role = modelBuilder.Entity<Role>();
            role.ToTable("Roles");
            role.HasKey(r => r.RoleId);
            role.HasMany(r => r.RoleActions).WithOne(r => r.Role);
            role.HasMany(r => r.UserRoles).WithOne(r => r.Role);

            var roleAction = modelBuilder.Entity<RoleAction>();
            roleAction.ToTable("RoleAction");
            roleAction.HasKey(ra => ra.RoleActionId).HasName("RoleActionID");
            roleAction.HasOne(ra => ra.Role).WithMany(ra => ra.RoleActions);
            roleAction.HasOne(ra => ra.ModuleAction).WithMany(ra => ra.RoleActions);

            var primaryEmail = modelBuilder.Entity<PrimaryEmail>();
            primaryEmail.ToTable("PrimaryEmails");
            primaryEmail.HasKey(k => k.PrimaryEmailId).HasName("PrimaryEmailID");
            primaryEmail.Property(p => p.UserId).HasColumnName("UserID");
            primaryEmail.HasOne(p => p.User);

            //VIEWS
            //var userModules = modelBuilder.Entity<uv_UserModules>();
            //userModules.ToTable("uv_UserModules");
            //userModules.Property(p => p.UserId).HasColumnName("UserID");
            //userModules.Property(p => p.ActionId).HasColumnName("ActionID");
            //userModules.Property(p => p.ModuleId).HasColumnName("ModuleID");
        }

        public virtual DbSet<ModuleAction> ModuleActions { get; set; }
        public virtual DbSet<Module> Modules { get; set; }
        public virtual DbSet<RoleAction> RoleActions { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<PrimaryEmail> PrimaryEmails { get; set; }
        //public virtual DbSet<uv_UserModules> uv_UserModules { get; set; }
    }
}
