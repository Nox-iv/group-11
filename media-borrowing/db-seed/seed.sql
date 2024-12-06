INSERT INTO Locations (locationName) VALUES ('Sheffield');
INSERT INTO Locations (locationName) VALUES ('Manchester');

INSERT INTO MediaBorrowingConfig (renewalLimit, maximumBorrowingDurationInDays) VALUES (1, 14);
INSERT INTO MediaBorrowingConfig (renewalLimit, maximumBorrowingDurationInDays) VALUES (2, 7);

INSERT INTO Branches (
    locationId,
    branchName,
    mediaBorrowingConfigId,
    address,
    phoneNumber,
    email
) VALUES (
    1, 
    'Sheffield Central Library', 
    1,
    '123 Main St', 
    '01234567890', 
    'sheffieldcentral@library.com'
);

INSERT INTO Branches (
    locationId,
    branchName,
    mediaBorrowingConfigId,
    address,
    phoneNumber,
    email
) VALUES (
    1,
    'Sheffield South Library',
    2,
    '456 South St',
    '01234567891',
    'sheffieldsouth@library.com'
);

INSERT INTO Branches (
    locationId,
    branchName,
    mediaBorrowingConfigId,
    address,
    phoneNumber,
    email
) VALUES (
    2,
    'Manchester Central Library',
    1,
    '789 Central St',
    '01234567892',
    'manchestercentral@library.com'
);

INSERT INTO Branches (
    locationId,
    branchName,
    mediaBorrowingConfigId,
    address,
    phoneNumber,
    email
) VALUES (
    2,
    'Manchester South Library',
    2,
    '101 South St',
    '01234567893',
    'manchestersouth@library.com'
);

DO $$ 
DECLARE
    branch_id INT;
    day_of_week INT;
BEGIN
    FOR branch_id IN 1..(SELECT COUNT(*) FROM Branches) LOOP
        FOR day_of_week IN 0..6 LOOP
            INSERT INTO BranchOpeningHours (
                branchId,
                dayOfWeek,
                openingTime,
                closingTime
            ) VALUES (
                branch_id, day_of_week, 900, 1700
            );
        END LOOP;
    END LOOP;
END $$;

DO $$
DECLARE 
    day_of_week INT;
BEGIN
    FOR day_of_week IN 0..6 LOOP
        INSERT INTO BranchOpeningHours (
            branchId,
            dayOfWeek,
            openingTime,
            closingTime
        ) VALUES (1, day_of_week, 0, 200);
    END LOOP;
END $$;

INSERT INTO Users (
    locationId,
    firstName,
    lastName,
    emailAddress,
    phoneNumber
) VALUES (
    1,
    'Johnny', 
    'Sheffield', 
    'johnny.sheffield@example.com', 
    '07777777777'
);

INSERT INTO Users (
    locationId,
    firstName,
    lastName,
    emailAddress,
    phoneNumber
) VALUES (
    1,
    'Jane',
    'Sheffield',
    'jane.sheffield@example.com',
    '07777777778'
);

INSERT INTO Users (
    locationId,
    firstName,
    lastName,
    emailAddress,
    phoneNumber
) VALUES (
    2,
    'John',
    'Manchester',
    'john.manchester@example.com',
    '07777777779'
);

INSERT INTO MediaTypes (mediaTypeName) VALUES ('Book');
INSERT INTO MediaTypes (mediaTypeName) VALUES ('DVD');

INSERT INTO Media (
    mediaTypeId,
    title,
    author,
    assetUrl
) VALUES (
    1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'https://example.com/the-great-gatsby.pdf'
);

INSERT INTO Media (
    mediaTypeId,
    title,
    author,
    assetUrl
) VALUES (
    2, 'Inception', 'Christopher Nolan', 'https://example.com/inception.mp4'
);

INSERT INTO Media (
    mediaTypeId,
    title,
    author,
    assetUrl
) VALUES (
    1, 'The Hobbit', 'J.R.R. Tolkien', 'https://example.com/the-hobbit.pdf'
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    1, 1, 1
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    2, 1, 2
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    1, 2, 1
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    1, 3, 10
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    2, 3, 0
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    3, 3, 10
);

INSERT INTO MediaInventory (
    mediaId,
    branchId,
    availability
) VALUES (
    3, 4, 10
);