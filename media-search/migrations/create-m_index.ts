import { Client } from '@elastic/elasticsearch';
import { log } from 'console';
import fs from 'fs';

export async function createMediaIndex() {
    const elasticSearchClient = new Client({ node: process.env.ELASTICSEARCH_URL });

    try {

        console.log('Deleting index...')
        await elasticSearchClient.indices.delete({ index: 'm_index' });
        console.log('Done!')

        console.log('Deleting index template...')
        await elasticSearchClient.indices.deleteTemplate({ name: 'media-template' });
        console.log('Done!')

        log('1) Reading index template file...')
        const mediaIndexTemplateString = fs.readFileSync(`${__dirname}/../src/elasticsearch/templates/media-template.json`, 'utf8');
        const mediaIndexTemplate = JSON.parse(mediaIndexTemplateString);

        log('Done!')

        log(mediaIndexTemplate)

        log('2) Creating index template...')
        await elasticSearchClient.indices.putTemplate({
            name: 'media-template',
            body: mediaIndexTemplate,
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        log('Done!')

        log('3) Creating index...')
        await elasticSearchClient.indices.create({ index: 'm_index' });

        log('Done!')
    } catch (error) {
        log('Error creating media index:', error);
        throw error;
    } finally {
        await elasticSearchClient.close();
    }
}

if (require.main === module) {
    createMediaIndex()
        .then(() => log('Media index created successfully'))
        .catch(error => {
            log('Failed to create media index:', error);
            process.exit(1);
        });
}