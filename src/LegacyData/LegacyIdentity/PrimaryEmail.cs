using System;

namespace LegacyData.LegacyIdentity
{
    public class PrimaryEmail
    {
        public Guid PrimaryEmailId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Guid? SMTPID { get; set; }
        public Guid? IMAPID { get; set; }
        public string Signature { get; set; }
        public Guid? UserId { get; set; }
        public bool IsDefault { get; set; }

        public virtual User User { get; set; }
    }
}