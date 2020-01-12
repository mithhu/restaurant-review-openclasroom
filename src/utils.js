export const api_key = process.env.REACT_APP_API_KEY; //getting my google map api key from .env file

export const averageStar = (ratings) => {
    let totalStar = 0;
    let avgStar;
    ratings.map((rating) => {
        totalStar = totalStar + rating.stars
    })
    avgStar = totalStar / ratings.length
    return avgStar;
}
