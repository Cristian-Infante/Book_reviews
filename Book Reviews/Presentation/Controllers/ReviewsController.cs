using System.Security.Claims;
using Application.Commands.Reviews;
using Application.DTOs;
using Application.Queries.Reviews;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController(IMediator mediator) : ControllerBase
    {
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<ReviewDto>> GetById(int id, CancellationToken ct = default)
        {
            var dto = await mediator.Send(new GetReviewByIdQuery(id), ct);
            return Ok(dto);
        }

        [HttpGet("book/{bookId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResult<ReviewDto>>> GetByBook(
            int bookId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken ct = default)
        {
            var result = await mediator.Send(
                new GetReviewsByBookPagedQuery(bookId, pageNumber, pageSize),
                ct
            );
            return Ok(result);
        }

        [HttpGet("user/{userId:int}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByUser(
            int userId,
            CancellationToken ct = default)
        {
            var list = await mediator.Send(new GetReviewsByUserQuery(userId), ct);
            return Ok(list);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<int>> Create(
            [FromBody] CreateReviewCommand command,
            CancellationToken ct = default)
        {
            var createdReview = await mediator.Send(command, ct);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdReview.Id },
                createdReview.Id
            );
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateReviewCommand command,
            CancellationToken ct = default)
        {
            if (id != command.Id)
                return BadRequest("No se encontró la reseña con el ID especificado.");

            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var existing = await mediator.Send(new GetReviewByIdQuery(id), ct);
            if (existing.UserId != currentUserId)
                return Forbid();

            await mediator.Send(command, ct);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var existing = await mediator.Send(new GetReviewByIdQuery(id), ct);
            if (existing.UserId != currentUserId)
                return Forbid();

            await mediator.Send(new DeleteReviewCommand(id), ct);
            return NoContent();
        }
    }
