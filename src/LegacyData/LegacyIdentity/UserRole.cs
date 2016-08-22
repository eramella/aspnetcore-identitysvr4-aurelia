using System;

namespace LegacyData.LegacyIdentity
{
    public class UserRole
    {
        public Guid UserRoleId { get; set; }
        public Guid? UserID { get; set; }
        public Guid RoleID { get; set; }
        public DateTime? Date { get; set; }

        public virtual Role Role { get; set; }
        public virtual User User { get; set; }
    }
}