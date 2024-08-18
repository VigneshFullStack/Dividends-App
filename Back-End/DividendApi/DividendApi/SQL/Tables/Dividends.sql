CREATE TABLE Dividends (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DividendAmount DECIMAL(10,2) NOT NULL,
    DividendYield DECIMAL(5,2) NOT NULL,
    CompanyId INT NOT NULL,
    Year INT NOT NULL,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
);

INSERT INTO Dividends (DividendAmount, DividendYield, CompanyId, Year) VALUES
    (2.50, 3.50, 1, 2021),
    (2.60, 3.60, 1, 2022),
    (2.70, 3.70, 1, 2023),
    (1.75, 2.80, 2, 2021),
    (1.80, 2.90, 2, 2022),
    (1.85, 3.00, 2, 2023),
    (3.20, 4.10, 3, 2021),
    (3.30, 4.20, 3, 2022),
    (3.40, 4.30, 3, 2023),
    (2.00, 2.90, 4, 2021),
    (2.10, 3.00, 4, 2022),
    (2.20, 3.10, 4, 2023),
    (4.50, 5.00, 5, 2021),
    (4.60, 5.10, 5, 2022),
    (4.70, 5.20, 5, 2023),
    (1.90, 3.00, 6, 2021),
    (2.00, 3.10, 6, 2022),
    (2.10, 3.20, 6, 2023),
    (3.80, 4.50, 7, 2021),
    (3.90, 4.60, 7, 2022),
    (4.00, 4.70, 7, 2023),
    (2.25, 3.20, 8, 2021),
    (2.30, 3.30, 8, 2022),
    (2.35, 3.40, 8, 2023);
