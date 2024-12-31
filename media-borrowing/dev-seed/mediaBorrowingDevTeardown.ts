import { Pool } from 'pg';

const pool = new Pool();

const teardownDatabase = async () => {
  try {
    await pool.connect();

    const teardownQuery = `
      TRUNCATE TABLE 
        ArchivedMediaBorrowingRecords,
        MediaBorrowingRecords,
        MediaInventory,
        Media,
        MediaTypes,
        Users,
        BranchOpeningHours,
        Branches,
        MediaBorrowingConfig,
        Locations
      RESTART IDENTITY;
    `;

    await pool.query(teardownQuery);
    console.log('Database teardown completed successfully.');
  } catch (error) {
    console.error('Error during database teardown:', error);
  } finally {
    await pool.end();
  }
};

// Execute the teardown
teardownDatabase();