CREATE TABLE Companies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL
);


INSERT INTO Companies (Name) VALUES
    ('Apple Inc.'),
    ('Microsoft Corp.'),
    ('Google LLC'),
    ('Amazon.com Inc.'),
    ('Tesla Inc.'),
    ('Meta Platforms Inc.'),
    ('NVIDIA Corporation'),
    ('Samsung Electronics');
