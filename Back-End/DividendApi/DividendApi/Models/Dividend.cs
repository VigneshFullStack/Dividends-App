namespace DividendApi.Models
{
    public class Dividend
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public decimal DividendAmount { get; set; }
        public decimal  DividendYield { get; set; }
        public int Year { get; set; }

        public Company Company { get; set; }
    }
}
