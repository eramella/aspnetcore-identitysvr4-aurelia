using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace EMS.Web.Controllers
{
    public class MailTestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public  IActionResult Send()
        {
            const string email = "e.ramella@seeamericatravel.com";
            const string subject = "Testing this email";
            const string message = "This is the boby";

            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress("See America Travel", "info@seeamericatravel.com"));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("plain") { Text = message };
            using (var client = new SmtpClient(new ProtocolLogger("smpt.log")))
            {
                client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.Auto).ConfigureAwait(true);
                client.AuthenticateAsync("b.baldereschi@seeamericatravel.com", "bruno01").ConfigureAwait(true);
                client.SendAsync(emailMessage).ConfigureAwait(true);
                client.DisconnectAsync(true).ConfigureAwait(true);
            }

            return View("Index");
        }
    }
}