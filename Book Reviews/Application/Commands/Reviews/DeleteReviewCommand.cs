using Application.Interfaces;
using MediatR;

namespace Application.Commands.Reviews;


public record DeleteReviewCommand(int Id) : ICommand<Unit>;