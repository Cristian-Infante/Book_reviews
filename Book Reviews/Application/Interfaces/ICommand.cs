using MediatR;

namespace Application.Interfaces;

public interface ICommand<TResponse> : IRequest<TResponse> { }
