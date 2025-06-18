using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace Presentation.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new { message = "Ha ocurrido un error interno." };
            var payload  = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(payload);
        }
    }
}