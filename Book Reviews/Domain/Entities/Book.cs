using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Book
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Author { get; set; } = null!;

    [Required, MaxLength(1000)]
    public string Summary { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}