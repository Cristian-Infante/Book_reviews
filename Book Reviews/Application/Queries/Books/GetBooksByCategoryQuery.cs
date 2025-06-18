using Application.DTOs;
using MediatR;

namespace Application.Queries.Books;

public record GetBooksByCategoryQuery(int CategoryId) : IRequest<IEnumerable<BookDto>>;