using Application.DTOs;
using Application.Queries.Books;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Books;

public class SearchBooksQueryHandler(IBookRepository repo, IMapper mapper)
    : IRequestHandler<SearchBooksQuery, IEnumerable<BookDto>>
{
    public Task<IEnumerable<BookDto>> Handle(SearchBooksQuery q, CancellationToken ct)
    {
        var dtos = repo
            .SearchByTitleOrAuthor(q.Term)
            .AsQueryable()
            .ProjectTo<BookDto>(mapper.ConfigurationProvider)
            .ToList();
        return Task.FromResult<IEnumerable<BookDto>>(dtos);
    }
}