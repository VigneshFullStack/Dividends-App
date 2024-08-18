namespace DividendApi.Models
{
    public class AddDividendRequest
    {
        public int CompanyId { get; set; }
        public decimal DividendAmount { get; set; }
        public decimal DividendYield { get; set; }
        public int Year { get; set; }
    }
}
