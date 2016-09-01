using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.Web.Controllers
{
    // [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View(); //Redirect("~/index.html");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
