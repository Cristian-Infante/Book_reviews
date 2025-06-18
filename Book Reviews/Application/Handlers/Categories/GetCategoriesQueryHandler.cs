using Application.DTOs;
using Application.Queries.Categories;
using AutoMapper;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Categories;

public class GetCategoriesQueryHandler(ICategoryRepository repo, IMapper mapper)
    : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    public Task<IEnumerable<CategoryDto>> Handle(GetCategoriesQuery q, CancellationToken ct)
    {
        var list = repo.GetAll();
        var dtos = mapper.Map<IEnumerable<CategoryDto>>(list);
        return Task.FromResult(dtos);
    }
}