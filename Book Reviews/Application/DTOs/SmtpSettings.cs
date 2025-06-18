namespace Application.DTOs;

public class SmtpSettings
{
    public string Host { get; set; } = null!;
    public int Port { get; set; }
    public bool UseSsl { get; set; }
    public string User { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string From { get; set; } = null!;
}