using Dapper;
using DividendApi.Models;
using System.Data.SqlClient;

namespace DividendApi.Repository
{
    public class DividendRepository : IDividendRepository
    {
        private readonly string? _connectionString;
        private readonly ILogger<DividendRepository> _logger;

        public DividendRepository(IConfiguration configuration, ILogger<DividendRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger = logger;
        }

        // Fetch all dividends
        public async Task<IEnumerable<Dividend>> GetAllDividendsAsync()
        {
            const string sql = @"
                                SELECT * 
                                FROM Dividends
                                ORDER BY CompanyId, Year;";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var dividends = await connection.QueryAsync<Dividend>(sql);
                    return dividends;
                }
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while fetching all dividends.");
                throw new ApplicationException("Database operation failed.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all dividends.");
                throw;
            }
        }

        // Add a new dividend
        public async Task<int> AddDividendAsync(AddDividendRequest dividendRequest)
        {
            const string sql = @"
                INSERT INTO Dividends (CompanyId, Year, DividendAmount, DividendYield)
                VALUES (@CompanyId, @Year, @DividendAmount, @DividendYield);
                SELECT CAST(SCOPE_IDENTITY() AS INT);";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var parameters = new
                    {
                        dividendRequest.CompanyId,
                        dividendRequest.Year,
                        dividendRequest.DividendAmount,
                        dividendRequest.DividendYield
                    };

                    var result = await connection.QuerySingleAsync<int>(sql, parameters);
                    return result;
                }
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while adding dividend.");
                throw new ApplicationException("Database operation failed.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding dividend.");
                throw;
            }
        }

        // Fetch dividends by company ID
        public async Task<IEnumerable<Dividend>> GetDividendsByCompanyAsync(int companyId)
        {
            const string sql = @"
                SELECT * FROM Dividends
                WHERE CompanyId = @CompanyId
                ORDER BY Year;";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var parameters = new { CompanyId = companyId };
                    var dividends = await connection.QueryAsync<Dividend>(sql, parameters);
                    return dividends;
                }
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while fetching dividends for company ID {CompanyId}.", companyId);
                throw new ApplicationException("Database operation failed.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching dividends for company ID {CompanyId}.", companyId);
                throw;
            }
        }

        // Update an existing dividend
        public async Task<Dividend> UpdateDividendAsync(int id, AddDividendRequest dividendRequest)
        {
            // Ensure that the ID and request are valid
            if (id <= 0 || dividendRequest == null || dividendRequest.CompanyId <= 0)
            {
                throw new ArgumentException("Invalid dividend data.");
            }

            // SQL query to update the dividend and fetch the updated record
            const string sql = @"
                                UPDATE Dividends
                                SET CompanyId = @CompanyId,
                                    Year = @Year,
                                    DividendAmount = @DividendAmount,
                                    DividendYield = @DividendYield
                                WHERE Id = @Id;

                                -- Return the updated dividend
                                SELECT * FROM Dividends WHERE Id = @Id;";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var parameters = new
                    {
                        Id = id,
                        CompanyId = dividendRequest.CompanyId,
                        Year = dividendRequest.Year,
                        DividendAmount = dividendRequest.DividendAmount,
                        DividendYield = dividendRequest.DividendYield
                    };

                    // Execute the query and return the updated dividend
                    var updatedDividend = await connection.QuerySingleOrDefaultAsync<Dividend>(sql, parameters);
                    if (updatedDividend == null)
                    {
                        // If no record is found, throw an exception
                        throw new KeyNotFoundException($"Dividend with ID {id} not found.");
                    }

                    return updatedDividend;
                }
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while updating dividend with ID {Id}.", id);
                throw new ApplicationException("Database operation failed.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating dividend with ID {Id}.", id);
                throw;
            }
        }

        // Delete a dividend
        public async Task<bool> DeleteDividendAsync(int id)
        {
            const string sql = @"
                DELETE FROM Dividends
                WHERE Id = @Id;";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var parameters = new { Id = id };
                    var rowsAffected = await connection.ExecuteAsync(sql, parameters);
                    return rowsAffected > 0;
                }
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "SQL error occurred while deleting dividend with ID {Id}.", id);
                throw new ApplicationException("Database operation failed.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting dividend with ID {Id}.", id);
                throw;
            }
        }
    }
}
