using Application.DTOs;
using Application.Interfaces;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Application.Services;

public class SmtpEmailService(IOptions<SmtpSettings> opts) : IEmailService
{
    private readonly SmtpSettings _opts = opts.Value;

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        var msg = new MimeMessage();
        msg.From.Add(MailboxAddress.Parse(_opts.From));
        msg.To.Add(MailboxAddress.Parse(to));
        msg.Subject = subject;
        msg.Body    = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(_opts.Host, _opts.Port, _opts.UseSsl).ConfigureAwait(false);

        // si tu SMTP exige autenticación
        if (!string.IsNullOrWhiteSpace(_opts.User))
            await client.AuthenticateAsync(_opts.User, _opts.Password).ConfigureAwait(false);

        await client.SendAsync(msg).ConfigureAwait(false);
        await client.DisconnectAsync(true).ConfigureAwait(false);
    }
}