using DividendApi.Models;
using DividendApi.Repository;
using Microsoft.AspNetCore.Mvc;

namespace DividendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DividendsController : ControllerBase
    {
        private readonly IDividendRepository _dividendRepository;
        private readonly ILogger<DividendsController> _logger;

        public DividendsController(IDividendRepository dividendRepository, ILogger<DividendsController> logger)
        {
            _dividendRepository = dividendRepository;
            _logger = logger;
        }

        // Get all dividends
        [HttpGet]
        public async Task<IActionResult> GetAllDividends()
        {
            try
            {
                var dividends = await _dividendRepository.GetAllDividendsAsync();
                if (dividends == null || !dividends.Any())
                {
                    _logger.LogInformation("No dividends found.");
                    return NotFound("No dividends found.");
                }

                return Ok(dividends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving all dividends.");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }


        // Get dividends for a specific company
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetDividendsByCompanyId(int companyId)
        {
            try
            {
                if (companyId <= 0)
                {
                    _logger.LogWarning("Invalid company ID {CompanyId} provided.", companyId);
                    return BadRequest("Invalid company ID.");
                }

                var dividends = await _dividendRepository.GetDividendsByCompanyAsync(companyId);
                if (dividends == null || !dividends.Any())
                {
                    _logger.LogInformation("No dividends found for company ID {CompanyId}.", companyId);
                    return NotFound($"No dividends found for company ID {companyId}.");
                }

                return Ok(dividends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving dividends for company ID {CompanyId}.", companyId);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        // Add a new dividend
        [HttpPost]
        public async Task<IActionResult> AddDividend([FromBody] AddDividendRequest request)
        {
            try
            {
                if (request == null || request.CompanyId <= 0)
                {
                    return BadRequest("Invalid dividend data.");
                }

                var result = await _dividendRepository.AddDividendAsync(request);
                if (result > 0)
                {
                    return Ok(new { Id = result });
                }

                return StatusCode(500, "Error occurred while adding the dividend.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a dividend.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update an existing dividend
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDividend(int id, [FromBody] AddDividendRequest request)
        {
            try
            {
                if (id <= 0 || request == null || request.CompanyId <= 0)
                {
                    return BadRequest("Invalid dividend data.");
                }

                var updatedDividend = await _dividendRepository.UpdateDividendAsync(id, request);
                if (updatedDividend != null)
                {
                    return Ok(updatedDividend);
                }

                return NotFound($"Dividend with ID {id} not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating dividend with ID {Id}.", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // Delete a dividend
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDividend(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid dividend ID.");
                }

                var isDeleted = await _dividendRepository.DeleteDividendAsync(id);
                if (isDeleted)
                {
                    return NoContent();
                }

                return NotFound($"Dividend with ID {id} not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting dividend with ID {Id}.", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
