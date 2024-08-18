using DividendApi.Models;

namespace DividendApi.Repository
{
    public interface IDividendRepository
    {
        Task<IEnumerable<Dividend>> GetAllDividendsAsync();
        Task<int> AddDividendAsync(AddDividendRequest dividendRequest);
        Task<IEnumerable<Dividend>> GetDividendsByCompanyAsync(int companyId);
        Task<Dividend> UpdateDividendAsync(int id, AddDividendRequest dividendRequest);
        Task<bool> DeleteDividendAsync(int id);
    }
}
