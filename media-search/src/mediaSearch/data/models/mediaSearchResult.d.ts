export interface MediaSearchResult {
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