using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LegacyData.LegacyIdentity
{
    [Table("Users")]
    public class User
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Address { get; set; }
        public string Zip { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsLocked { get; set; }
        public Guid CityId { get; set; }
        public bool IsNewUser { get; set; }
        public string LogoPath { get; set; }
        public string LogoOriginalPath { get; set; }
        public string Notes { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; }
        public virtual ICollection<PrimaryEmail> PrimaryEmails { get; set; }
    }
}