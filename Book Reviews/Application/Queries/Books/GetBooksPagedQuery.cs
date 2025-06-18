using Application.DTOs;
using MediatR;

namespace Application.Queries.Books;

public record GetBooksPagedQuery(int PageNumber, int PageSize) 
    : IRequest<PagedResult<BookDto>>
{
    public string? Search { get; init; }
    public int?    CategoryId { get; init; }
}