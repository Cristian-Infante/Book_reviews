using Application.Commands.Categories;
using Application.DTOs;
using Application.Queries.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController(IMediator mediator) : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll(CancellationToken ct = default)
        {
            var list = await mediator.Send(new GetCategoriesQuery(), ct);
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<CategoryDto>> GetById(int id, CancellationToken ct = default)
        {
            var dto = await mediator.Send(new GetCategoryByIdQuery(id), ct);
            return Ok(dto);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<int>> Create(
            [FromBody] CreateCategoryCommand command,
            CancellationToken ct = default)
        {
            var createdCategory = await mediator.Send(command, ct);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdCategory.Id },
                createdCategory.Id
            );
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateCategoryCommand command,
            CancellationToken ct = default)
        {
            if (id != command.Id)
                return BadRequest("No se encontró la categoría con el ID especificado.");

            await mediator.Send(command, ct);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
        {
            await mediator.Send(new DeleteCategoryCommand(id), ct);
            return NoContent();
        }
    }