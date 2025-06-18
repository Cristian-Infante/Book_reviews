using Application.DTOs;
using MediatR;

namespace Application.Queries.Categories;

public record GetCategoryByIdQuery(int Id) : IRequest<CategoryDto>;