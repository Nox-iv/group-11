import { Client } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import path from 'path';
import fs from 'fs';

const client = new Client({ node: process.env.ELASTICSEARCH_URL });

const dataPath = path.join(process.env.DATA_FILE_PATH as string);

console.log(dataPath);

const readData = () => {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
};

const seedElasticsearch = async () => {
  try {
    const data = readData();

    const locationsMap: { [key: string]: string } = {};
    data.locations.forEach((location: { locationId: string; locationName: string }) => {
      locationsMap[location.locationId] = location.locationName;
    });

    const branchesMap: { [key: string]: { locationId: string; locationName: string } } = {};
    data.branches.forEach((branch: { branchId: string; locationId: string; locationName: string }) => {
      branchesMap[branch.branchId] = {
        locationId: branch.locationId,
        locationName: locationsMap[branch.locationId],
      };
    });

    const mediaStockMap: { [key: string]: { [key: string]: { locationId: string; locationName: string; stockCount: number } } } = {};

    data.mediaInventory.forEach((inventory: {
      mediaId: string;
      branchId: string;
      availability: number;
    }) => {
      const { mediaId, branchId, availability } = inventory;
      const { locationId, locationName } = branchesMap[branchId];

      if (!mediaStockMap[mediaId]) {
        mediaStockMap[mediaId] = {};
      }

      if (!mediaStockMap[mediaId][locationId]) {
        mediaStockMap[mediaId][locationId] = {
          locationId,
          locationName,
          stockCount: 0,
        };
      }

      mediaStockMap[mediaId][locationId].stockCount += availability;
    });

    const bulkOperations: any[] = [];

    data.media.forEach((media: {
      mediaId: string;
      title: string;
      mediaTypeName: string;
      author: string;
      description: string;
      releaseDate: string;
      assetUrl: string;
      genres: string[];
    }) => {
      const mediaStockArray = Object.values(mediaStockMap[media.mediaId]);

      const mediaDocument = {
        mediaId: media.mediaId,
        title: media.title,
        type: media.mediaTypeName, 
        author: media.author,
        description: media.description,
        releaseDate: media.releaseDate,
        imageUrl: media.assetUrl,
        genres: media.genres,
        mediaStock: mediaStockArray,
      };

      bulkOperations.push(
        { create: { _index: 'm_index', _id: media.mediaId } },
        mediaDocument
      );
    });

    if (bulkOperations.length === 0) {
      console.log('No media documents to index.');
      return;
    }

    const bulkResponse = await client.bulk({ refresh: true, body: bulkOperations });

    if (bulkResponse.errors) {
      const erroredDocuments: any[] = [];
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0] as estypes.BulkOperationType;
        if (action[operation]?.error) {
          // Log the document that failed to index
          erroredDocuments.push({
            status: action[operation]?.status,
            error: action[operation]?.error,
            operation: bulkOperations[i * 2],
            document: bulkOperations[i * 2 + 1],
          });
        }
      });

      console.log('Some documents failed to index:');
      erroredDocuments.forEach((doc) => {
        if (doc.error.type === 'version_conflict_engine_exception') {
          console.log(`Document already exists. ID: ${doc.operation.create._id}`);
        } else {
          console.log(`Error indexing document ID ${doc.operation.create._id}:`, doc.error);
        }
      });
    } else {
      console.log('All media documents indexed successfully.');
    }
  } catch (error) {
    console.error('Error seeding Elasticsearch:', error);
  } finally {
    await client.close();
  }
};

seedElasticsearch();
