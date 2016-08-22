﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using EMS.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using IdentityModel;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using IdentityServer4;

namespace EMS.Web.Configuration
{
    public class IdentityServerUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
    {
        public IdentityServerUserClaimsPrincipalFactory(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IOptions<IdentityOptions> optionsAccessor) : base(userManager, roleManager, optionsAccessor)
        {
        }

        public async override Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var cp = await base.CreateAsync(user);

            var id = cp.Identities.First();
            var sub = cp.FindFirst(JwtClaimTypes.Subject);

            id.AddClaim(new Claim(JwtClaimTypes.IdentityProvider, sub.Issuer == ClaimsIdentity.DefaultIssuer ? Constants.BuiltInIdentityProvider : sub.Issuer));
            id.AddClaim(new Claim(JwtClaimTypes.AuthenticationTime, DateTime.UtcNow.ToEpochTime().ToString()));

            return cp;
        }
    }
}