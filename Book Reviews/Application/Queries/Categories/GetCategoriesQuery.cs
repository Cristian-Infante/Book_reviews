using Application.DTOs;
using MediatR;

namespace Application.Queries.Categories;

public record GetCategoriesQuery() : IRequest<IEnumerable<CategoryDto>>;