using Dapper;
using DividendApi.Models;
using System.Data.SqlClient;

namespace DividendApi.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<CompanyRepository> _logger;

        public CompanyRepository(IConfiguration configuration, ILogger<CompanyRepository> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private string? ConnectionString => _configuration.GetConnectionString("DefaultConnection");

        public async Task<IEnumerable<Company>> GetCompaniesAsync()
        {
            using var connection = new SqlConnection(ConnectionString);
            var query = "SELECT * FROM Companies";
            return await connection.QueryAsync<Company>(query);
        }

        public async Task<Company> GetCompanyByIdAsync(int id)
        {
            using var connection = new SqlConnection(ConnectionString);
            var query = "SELECT * FROM Companies WHERE Id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Company>(query, new { Id = id });
        }

        public async Task<int> AddCompanyAsync(Company company)
        {
            try
            {
                using var connection = new SqlConnection(ConnectionString);
                var query = "INSERT INTO Companies (Name) VALUES (@Name)";
                return await connection.ExecuteAsync(query, company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a new company.");
                throw new Exception("Error occurred while adding a new company.");
            }
        }

        public async Task<int> UpdateCompanyAsync(Company company)
        {
            try
            {
                using var connection = new SqlConnection(ConnectionString);
                var query = "UPDATE Companies SET Name = @Name WHERE Id = @Id";
                return await connection.ExecuteAsync(query, company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the company.");
                throw new Exception("Error occurred while updating the company.");
            }
        }

        public async Task<int> DeleteCompanyAsync(int id)
        {
            try
            {
                using var connection = new SqlConnection(ConnectionString);
                var query = "DELETE FROM Companies WHERE Id = @Id";
                return await connection.ExecuteAsync(query, new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting the company.");
                throw new Exception("Error occurred while deleting the company.");
            }
        }
    }
}