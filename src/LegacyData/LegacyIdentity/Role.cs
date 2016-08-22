using System;
using System.Collections.Generic;

namespace LegacyData.LegacyIdentity
{
    public class Role
    {
        public Guid RoleId { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public bool? IsMaster { get; set; }
        public bool? IsActive { get; set; }
        public int? RoleType { get; set; }

        public virtual ICollection<RoleAction> RoleActions { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
