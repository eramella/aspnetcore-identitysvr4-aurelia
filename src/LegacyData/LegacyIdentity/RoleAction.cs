using System;

namespace LegacyData.LegacyIdentity
{
    public class RoleAction
    {
        public Guid RoleActionId { get; set; }
        public Guid? RoleId { get; set; }
        public int? ActionId { get; set; }

        public virtual ModuleAction ModuleAction { get; set; }
        public virtual Role Role { get; set; }
    }
}
