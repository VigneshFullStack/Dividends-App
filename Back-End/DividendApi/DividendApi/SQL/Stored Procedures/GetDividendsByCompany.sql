CREATE OR ALTER PROCEDURE GetDividendsByCompany
(
	@CompanyId	INT
)
AS
BEGIN
	SELECT d.Id, d.CompanyId, d.DividendAmount, d.DividendYield, d.Year, c.Id, c.Name
	FROM Dividends d
	INNER JOIN Companies c
	ON d.CompanyId = c.Id
	WHERE d.CompanyId = @CompanyId
	ORDER BY d.Year
END