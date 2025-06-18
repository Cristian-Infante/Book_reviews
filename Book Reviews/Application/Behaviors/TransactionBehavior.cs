using Application.Interfaces;
using Domain.Interfaces;
using MediatR;

namespace Application.Behaviors;

public class TransactionBehavior<TRequest, TResponse>(IUnitOfWork uow) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not ICommand<TResponse>)
            return await next(cancellationToken);

        await uow.BeginTransactionAsync();
        try
        {
            var response = await next(cancellationToken);
            await uow.CommitTransactionAsync();
            return response!;
        }
        catch
        {
            await uow.RollbackTransactionAsync();
            throw;
        }
    }
}
