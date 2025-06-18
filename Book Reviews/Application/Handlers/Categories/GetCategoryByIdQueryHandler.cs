using Application.DTOs;
using Application.Queries.Categories;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Categories;

public class GetCategoryByIdQueryHandler(ICategoryRepository repo, IMapper mapper)
    : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
{
    public Task<CategoryDto> Handle(GetCategoryByIdQuery q, CancellationToken ct)
    {
        var c   = repo.GetById(q.Id);
        var dto = mapper.Map<CategoryDto>(c);
        return Task.FromResult(dto);
    }
}