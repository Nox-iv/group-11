# Media Template JSON Structure

### This document provides an overview of the `media-template.json` file, which defines the structure and settings for the media search index. Below is the JSON structure followed by an explanation of each attribute.

```json
{
  "index_patterns": ["m_index"],
  "mappings": {
    "properties": {
      "mediaId": {
        "type": "keyword"
      },
      "title": {
        "type": "text"
      },
      "type": {
        "type": "keyword"
      },
      "author": {
        "type": "text"
      },
      "description": {
        "index": false,
        "type": "text"
      },
      "releaseDate": {
        "type": "date"
      },
      "imageUrl": {
        "type": "text",
        "index": false
      },
      "genres": {
        "type": "keyword"
      },
      "mediaStock": {
        "type": "nested",
        "properties": {
          "locationId": {
            "type": "keyword"
          },
          "locationName": {
            "type": "text"
          },
          "stockCount": {
            "type": "integer"
          }
        }
      }
    }
  },
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "aliases": {
    "media": {}
  }
}
```
## Usage of Field Types
During the development of the media search API, the field types were modified to enable varying search behaviours. This section lists the field types used, a brief description of their behaviour, and the rationale for their usage along with examples.

- **keyword**: The keyword field type means that the field is matched against as a single token. This is useful for exact matching and for filtering. The `mediaId` field is stored as a `keyword` because it is a unique identifier for the media, and we want to be able to retrieve a media item by this field. It's also being used for the type and genre properties since these properties are used for filtering.

- **text**: The text field type means that the field is filtered and tokenized prior to indexing. This is useful for full-text search capabilities, e.g. searching for "The Lord of" will return "The Lord of the Rings". This field type has been used for the title and author fields to allow users to search for media items by these fields. 

- **date**: The date field allows the associated document property to be used in a range filerting query, this is exactly what was needed for the `releaseDate` field. A string could also be used for this field, but we'd lose the ability to filter by release date.

- **integer**: The integer field type means that the field is matched against as an integer, and can also be used in comparison when filtering. The media search API uses this field to allow users to only show items in their location that have a stock count greater than 0.

- **nested**: Elasticsearch has no concept of inner-objects, object hierarchies are flattened into a single field. This means that fields belonging to a single object lose their association with the parent object, making it difficult to query objects independently of one another. The `mediaStock` field is a hierarchial object that we need to be able to query as a single entity, for this reason it's been stored as a `nested` field.

Elasticsearch automatically supports multi-value fields, so we don't need to specify array types in the mappings.

## Indexing Decisions

The `description` field is stored as `text` but not indexed for search. Querying against the description worsened the quality of the search results, since descriptions tend to contain a large amount of text that is not a good indicator of relevance. This could be counteracted by applying boosts to other more informative fields, however the simpler, more effective solution is just to remove the field. Additionally, given the potential size of the description field, it's likely that index performance would be worsened if it were to be included. Generally, index performance is inversely proportional to the size of the index.

The `imageUrl` field is also stored as `text` but not indexed for search. A user would not search for a media item using an image URL, so adding this field to the search index would not improve the overall search experience, and would just add bloat to the index.

## Attributes

- **index_patterns**: Elasticsearch applies template mappings by matching index names against pattern. In this case, the index pattern is `m_index`, which means if we create an index with the name `m_index`, the template will be applied. The media search index has been named `m-index`, so this template will be applied. To ensure that the template is applied, we need to make sure the template is present on the Elasticsearch cluster prior to creation of the index.

- **mappings**: Defines the structure of the documents in the index and the behaviour of elasticsearch with regards to each field.
  - **properties**: Defintion of the document structure, in this case media items.
    - **mediaId**: A unique identifier for the media, stored as a `keyword` for exact matches. This ID is presumed to be generated by a separate procurement service, and will not be assigned when a document is indexed.
    - **title**: The title of the media, stored as `text` to allow for full-text search.
    - **type**: The type of media (e.g., book, movie), stored as a `keyword`.
    - **author**: The author of the media, stored as `text` for full-text search capabilities.
    - **description**: A description of the media, stored as `text` but not indexed for search.
    - **releaseDate**: The release date of the media, stored as a `date`.
    - **imageUrl**: The URL of the media's image, stored as `text` but not indexed - this field is not used for search so there is no need to index it.
    - **genres**: The genres associated with the media, stored as `keyword` for exact matches.
    - **mediaStock**: A nested object containing stock information.
      - **locationId**: The identifier for the stock location, stored as a `keyword`.
      - **locationName**: The name of the stock location, stored as `text`.
      - **stockCount**: The number of items in stock, stored as an `integer`.

- **settings**: Configures the index settings - for the sake of simplicity during development, the number of shards & replicas are set to 1. In a production environment, it'd be preferable to set these to a higher number depending on budget and overall risk tolerance.
  - **number_of_shards**: The number of primary shards for the index, set to 1.
  - **number_of_replicas**: The number of replica shards, set to 1.

- **aliases**: Provides an alias for the index, in this case, `media`, which can be used to reference the index in various queries, e.g. retrieving the metadata for the index.
