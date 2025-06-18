using Application.Commands.Books;
using Application.DTOs;
using Application.Queries.Books;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize   = 10,
        [FromQuery] string? search  = null,
        [FromQuery] int? categoryId = null,
        CancellationToken ct = default)
    {
        var query = new GetBooksPagedQuery(pageNumber, pageSize)
        {
            Search = string.IsNullOrWhiteSpace(search) ? null : search,
            CategoryId = categoryId
        };

        var pagedResult = await mediator.Send(query, ct);
        return Ok(pagedResult);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookDto>> GetById(int id, CancellationToken ct = default)
    {
        var dto = await mediator.Send(new GetBookByIdQuery(id), ct);
        return Ok(dto);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<int>> Create(
        [FromBody] CreateBookCommand command,
        CancellationToken ct = default)
    {
        var createdBook = await mediator.Send(command, ct);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdBook.Id },
            createdBook.Id
        );
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateBookCommand command,
        CancellationToken ct = default)
    {
        if (id != command.Id)
            return BadRequest("No se encontró el libro con el ID especificado.");

        await mediator.Send(command, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        await mediator.Send(new DeleteBookCommand(id), ct);
        return NoContent();
    }
}