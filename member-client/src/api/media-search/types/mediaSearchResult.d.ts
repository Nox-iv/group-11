export interface MediaSearchResult {
    totalHits : number,
    data : MediaDocument[]
}

export interface MediaDocument {
    mediaId : number,
    title : string,
    type : string,
    author : string,
    description : string,
    releaseDate : string,
    imageUrl : string
    genres : string[]
    mediaStock : MediaStock[]
}

interface MediaStock {
    locationId : number,
    locationName : string,
    stockCount : number
}