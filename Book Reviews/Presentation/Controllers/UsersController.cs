using System.Security.Claims;
using Application.Commands.Users;
using Application.DTOs;
using Application.Queries.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(
    IMediator mediator)
    : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll(CancellationToken ct = default)
    {
        var list = await mediator.Send(new GetUsersQuery(), ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetById(int id, CancellationToken ct = default)
    {
        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (currentUserId != id)
            return Forbid();

        var dto = await mediator.Send(new GetUserByIdQuery(id), ct);
        return Ok(dto);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateUserCommand command,
        CancellationToken ct = default)
    {
        if (id != command.Id)
            return BadRequest("No se encontró el usuario con el ID especificado.");

        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (currentUserId != id)
            return Forbid();

        await mediator.Send(command, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (currentUserId != id)
            return Forbid();

        await mediator.Send(new DeleteUserCommand(id), ct);
        return NoContent();
    }
    
    [HttpPost("{id:int}/photo")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadPhoto(
        int id,
        [FromForm] UploadPhotoRequest request,
        CancellationToken ct = default)
    {
        if (request.File.Length == 0)
            return BadRequest("Debe enviar un archivo válido.");

        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (id != currentUserId) return Forbid();

        await using var ms = new MemoryStream();
        await request.File.CopyToAsync(ms, ct);
        var bytes = ms.ToArray();

        await mediator.Send(new UploadUserPhotoCommand(id, bytes), ct);
        return NoContent();
    }
    
    [HttpDelete("{id:int}/photo")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
        await mediator.Send(new DeleteUserPhotoCommand(id));
        return NoContent();
    }
}