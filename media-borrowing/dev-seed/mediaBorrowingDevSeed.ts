import path from 'path';
import { Pool } from 'pg';
import fs from 'fs';

const pool = new Pool();


const dataPath = path.join(__dirname, '../../dev-seed/data.json');

const readData = () => {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
};

const seedDatabase = async () => {
  try {
    await pool.connect();

    const data = readData();

    for (const location of data.locations) {
      const query = `
        INSERT INTO Locations (locationId, locationName)
        VALUES ($1, $2)
        ON CONFLICT (locationId) DO NOTHING;
      `;
      await pool.query(query, [location.locationId, location.locationName]);
    }

    for (const config of data.mediaBorrowingConfigs) {
      const query = `
        INSERT INTO MediaBorrowingConfig (mediaBorrowingConfigId, renewalLimit, maximumBorrowingDurationInDays)
        VALUES ($1, $2, $3)
        ON CONFLICT (mediaBorrowingConfigId) DO NOTHING;
      `;
      await pool.query(query, [config.mediaBorrowingConfigId, config.renewalLimit, config.maximumBorrowingDurationInDays]);
    }

    for (const branch of data.branches) {
      const query = `
        INSERT INTO Branches (branchId, locationId, mediaBorrowingConfigId, branchName, address, phoneNumber, email)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (branchId) DO NOTHING;
      `;
      await pool.query(query, [
        branch.branchId,
        branch.locationId,
        branch.mediaBorrowingConfigId,
        branch.branchName,
        branch.address,
        branch.phoneNumber,
        branch.email,
      ]);
    }

    for (const hours of data.branchOpeningHours) {
      const query = `
        INSERT INTO BranchOpeningHours (branchOpeningHoursId, branchId, dayOfWeek, openingTime, closingTime)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (branchOpeningHoursId) DO NOTHING;
      `;
      await pool.query(query, [
        hours.branchOpeningHoursId,
        hours.branchId,
        hours.dayOfWeek,
        hours.openingTime,
        hours.closingTime,
      ]);
    }

    for (const mediaType of data.mediaTypes) {
      const query = `
        INSERT INTO MediaTypes (mediaTypeId, mediaTypeName)
        VALUES ($1, $2)
        ON CONFLICT (mediaTypeId) DO NOTHING;
      `;
      await pool.query(query, [mediaType.mediaTypeId, mediaType.mediaTypeName]);
    }

    for (const mediaItem of data.media) {
      const query = `
        INSERT INTO Media (mediaId, mediaTypeId, title, author, assetUrl, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (mediaId) DO NOTHING;
      `;
      await pool.query(query, [
        mediaItem.mediaId,
        mediaItem.mediaTypeId,
        mediaItem.title,
        mediaItem.author,
        mediaItem.assetUrl,
        mediaItem.description,
      ]);
    }

    for (const inventory of data.mediaInventory) {
      const query = `
        INSERT INTO MediaInventory (mediaInventoryId, mediaId, branchId, availability)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (mediaInventoryId) DO NOTHING;
      `;
      await pool.query(query, [
        inventory.mediaInventoryId,
        inventory.mediaId,
        inventory.branchId,
        inventory.availability,
      ]);
    }

    for (const user of data.users) {
      const query = `
        INSERT INTO Users (userId, locationId, firstName, lastName, emailAddress, phoneNumber)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (userId) DO NOTHING;
      `;
      await pool.query(query, [
        user.userId,
        user.locationId,
        user.firstName,
        user.lastName,
        user.emailAddress,
        user.phoneNumber,
      ]);
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();
