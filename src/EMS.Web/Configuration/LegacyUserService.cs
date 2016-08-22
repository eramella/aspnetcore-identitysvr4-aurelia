using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using EMS.Web.Models;
using Claim = System.Security.Claims.Claim;
using LegacyData.LegacyIdentity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EMS.Web.Data;
using System;

namespace EMS.Web.Configuration
{
    public class LegacyUserService
    {
        private UserManager<ApplicationUser> _userManager;
        private LegacyIdentityContext _legacyDb;
        private RoleManager<ApplicationRole> _roleManager;
        private ApplicationDbContext _DbContext;

        //private EMSRoleManager _roleManager;


        public LegacyUserService(UserManager<ApplicationUser> userManager, ApplicationDbContext DbContext, LegacyIdentityContext legacyDb, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _legacyDb = legacyDb;
            _roleManager = roleManager;
            _DbContext = DbContext;
        }
 

        public async Task<bool> ImportUser(string userName)
        {
            var legacyUser = await _legacyDb.Users.Include(p => p.PrimaryEmails)
                .Include(p => p.UserRoles)
                .ThenInclude(p => p.Role)
                .ThenInclude(p =>p.RoleActions)
                .ThenInclude(p => p.ModuleAction)
                .ThenInclude(p => p.Module)
                .FirstOrDefaultAsync(u => u.Username == userName);

            if (legacyUser != null)
            {
                var newEmsUser = await _userManager.FindByIdAsync(legacyUser.UserId.ToString());
                IdentityResult userCreateResult = null;
                if (newEmsUser == null)
                {
                    newEmsUser = new ApplicationUser();

                    newEmsUser.Id = legacyUser.UserId;
                    newEmsUser.Email = legacyUser.PrimaryEmails.FirstOrDefault(e => e.IsDefault).Email;
                    newEmsUser.UserName = legacyUser.Username;
                    newEmsUser.EmailConfirmed = true; //Confirming e-mail is not necessary as it comes from corporate.
                    userCreateResult = await _userManager.CreateAsync(newEmsUser);
                    if (!userCreateResult.Succeeded)
                        return false;
                }

                if (newEmsUser.Roles.Count == 0)
                {
                    var userClaims = new List<Claim>
                    {
                        new Claim(JwtClaimTypes.FamilyName, legacyUser.LastName),
                        new Claim(JwtClaimTypes.GivenName, legacyUser.FirstName),
                        new Claim(JwtClaimTypes.Name, legacyUser.FirstName + " " + legacyUser.LastName)
                    };
                    IdentityResult claimsAddResult = await _userManager.AddClaimsAsync(newEmsUser, userClaims);

                    IList<UserRole> userRoles = legacyUser.UserRoles.ToList();
                    
                    for (int i = 0; i < userRoles.Count; i++)
                    {
                        var roleExist = await _roleManager.RoleExistsAsync(userRoles[i].Role.RoleName);
                        if (!roleExist)
                        {
                            CreateRolesAndClaims(userRoles[i].Role);
                        }
                        await _userManager.AddToRoleAsync(newEmsUser, userRoles[i].Role.RoleName);
                    }
                }

                return true;
            }

            return false;
        }

        private async void CreateRolesAndClaims(Role role)
        {

            var roleCreated = await _roleManager.CreateAsync(new ApplicationRole(role.RoleName));
            
            if (roleCreated.Succeeded)
            {
                var newRole = await _roleManager.FindByNameAsync(role.RoleName);
                IList<RoleAction> roleActions = role.RoleActions.ToList();
                //List<Claim> claims = new List<Claim>();
                for (int i = 0; i < roleActions.Count(); i++)
                {
                    var claimValue = roleActions[i].ModuleAction.Module.ModuleName.Replace(" ", "") + "." + roleActions[i].ModuleAction.ActionName.Replace(" ", "");
                    var claim = new Claim("Permission", claimValue);
                    IdentityRoleClaim<Guid> newClaim = new IdentityRoleClaim<Guid>()
                    {
                        ClaimType = claim.Type,
                        ClaimValue = claim.Value,
                        RoleId = newRole.Id
                    };
                    _DbContext.RoleClaims.Add(newClaim);
                    //await _roleManager.AddClaimAsync(newRole, claim);
                    //claims.Add(claim);
                }
                await _DbContext.SaveChangesAsync();
                //for (int i = 0; i < claims.Count; i++)
                //{
                //    await _roleManager.AddClaimAsync(newRole, claims[i]);

                //}


            }

        }
    }
}
