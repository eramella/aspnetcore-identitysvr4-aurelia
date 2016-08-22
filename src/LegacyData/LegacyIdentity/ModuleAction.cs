using System;
using System.Collections.Generic;

namespace LegacyData.LegacyIdentity
{
    public class ModuleAction
    {
        public int ActionId { get; set; }
        public Guid ModuleId { get; set; }
        public string ActionName { get; set; }
        public string Description { get; set; }
        public bool? IsActive { get; set; }

        public virtual Module Module { get; set; }
        public virtual ICollection<RoleAction> RoleActions { get; set; }
    }
}
