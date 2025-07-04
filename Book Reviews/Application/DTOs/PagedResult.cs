﻿namespace Application.DTOs;

public class PagedResult<T>(IEnumerable<T> items, int pageNumber, int pageSize, int totalCount)
{
    public IEnumerable<T> Items { get; } = items;
    public int PageNumber { get; } = pageNumber;
    public int PageSize { get; } = pageSize;
    public int TotalCount { get; } = totalCount;
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}