using DividendApi.Models;
using DividendApi.Repository;
using Microsoft.AspNetCore.Mvc;

namespace DividendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly ILogger<CompaniesController> _logger;

        public CompaniesController(ICompanyRepository companyRepository, ILogger<CompaniesController> logger)
        {
            _companyRepository = companyRepository;
            _logger = logger;
        }

        // Get all companies
        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            try
            {
                var companies = await _companyRepository.GetCompaniesAsync();
                return Ok(companies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching companies.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get a company by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            try
            {
                var company = await _companyRepository.GetCompanyByIdAsync(id);
                if (company == null)
                {
                    return NotFound();
                }
                return Ok(company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching company with id {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Add a new company
        [HttpPost]
        public async Task<IActionResult> AddCompany([FromBody] Company company)
        {
            try
            {
                if (company == null)
                {
                    return BadRequest("Invalid company data.");
                }

                var result = await _companyRepository.AddCompanyAsync(company);
                if (result > 0)
                {
                    return Ok("Company added successfully.");
                }

                return StatusCode(500, "Error occurred while adding the company.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a company.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update a company by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] Company company)
        {
            try
            {
                if (company == null || company.Id != id)
                {
                    return BadRequest("Invalid company data.");
                }

                var existingCompany = await _companyRepository.GetCompanyByIdAsync(id);
                if (existingCompany == null)
                {
                    return NotFound();
                }

                var result = await _companyRepository.UpdateCompanyAsync(company);
                if (result > 0)
                {
                    return Ok("Company updated successfully.");
                }

                return StatusCode(500, "Error occurred while updating the company.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating company with id {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // Delete a company by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            try
            {
                var existingCompany = await _companyRepository.GetCompanyByIdAsync(id);
                if (existingCompany == null)
                {
                    return NotFound();
                }

                var result = await _companyRepository.DeleteCompanyAsync(id);
                if (result > 0)
                {
                    return Ok("Company deleted successfully.");
                }

                return StatusCode(500, "Error occurred while deleting the company.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting company with id {id}.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
