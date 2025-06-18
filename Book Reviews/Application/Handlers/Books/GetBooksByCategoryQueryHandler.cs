using Application.DTOs;
using Application.Queries.Books;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Books;

public class GetBooksByCategoryQueryHandler(IBookRepository repo, IMapper mapper)
    : IRequestHandler<GetBooksByCategoryQuery, IEnumerable<BookDto>>
{
    public Task<IEnumerable<BookDto>> Handle(GetBooksByCategoryQuery q, CancellationToken ct)
    {
        var dtos = repo
            .GetByCategory(q.CategoryId)
            .AsQueryable()
            .ProjectTo<BookDto>(mapper.ConfigurationProvider)
            .ToList();
        return Task.FromResult<IEnumerable<BookDto>>(dtos);
    }
}