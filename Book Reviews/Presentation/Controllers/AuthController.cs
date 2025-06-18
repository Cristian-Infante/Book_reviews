using System.Security.Claims;
using Application.Commands.Auth;
using Application.Commands.Users;
using Application.DTOs;
using Application.Interfaces;
using Application.Queries.Users;
using Application.Utilities;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IMediator mediator,
    IUserRepository userRepo,
    IJwtTokenService jwtService)
    : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<int>> Register(
        [FromBody] CreateUserCommand command,
        CancellationToken ct = default)
    {
        var createdUser = await mediator.Send(command, ct);
        return CreatedAtAction(
            actionName: nameof(UsersController.GetById),
            controllerName: "Users",
            routeValues: new { id = createdUser.Id },
            value: createdUser.Id
        );
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public ActionResult<AuthResultDto> Login([FromBody] LoginRequest req)
    {
        var user = userRepo.GetByEmail(req.Email);
        if (user == null || !PasswordHasher.VerifyPassword(req.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Email o contraseña inválidos." });
        }

        var auth = jwtService.GenerateToken(user);
        return Ok(auth);
    }
    
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResultDto>> Refresh(
        [FromBody] RefreshRequest req,
        CancellationToken ct = default)
    {
        try
        {
            var result = await mediator.Send(
                new RefreshTokenCommand(req.RefreshToken),
                ct
            );
            return Ok(result);
        }
        catch (ApplicationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
    
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequest req,
        CancellationToken ct = default)
    {
        await mediator.Send(
            new GeneratePasswordResetTokenCommand(req.Email),
            ct
        );
        return Accepted();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest req,
        CancellationToken ct = default)
    {
        try
        {
            await mediator.Send(
                new ResetPasswordCommand(req.Token, req.NewPassword),
                ct
            );
            return NoContent();
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

}