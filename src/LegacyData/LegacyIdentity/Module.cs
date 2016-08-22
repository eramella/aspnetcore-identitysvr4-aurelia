using System;
using System.Collections.Generic;

namespace LegacyData.LegacyIdentity
{
    public class Module
    {
        public Guid ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string Description { get; set; }
        public bool? IsActive { get; set; }

        public virtual ICollection<ModuleAction> ModuleActions { get; set; }
    }
}
