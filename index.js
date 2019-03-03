const fs = require("fs");
const maths = require("./lib/maths");
const Engine = require("./lib/engine");

// Bring in the data
const ratingData = fs.readFileSync("./data/responses.json", "utf-8");
const itemData = fs.readFileSync("./data/attractions.json", "utf-8");

// Parse the data. We have no data on users so we will extrapolate
// from responses
const ratings = JSON.parse(ratingData);
const items = JSON.parse(itemData);

// get recommendations for an existing user
const { recommendations } = new Engine()
  .fit(ratings, items)
  .calculateSimilarities()
  .getRecommendationForExisting("ekovacs");

console.log(
  recommendations.slice(0, 10).map(recommendation => recommendation.name)
);

// and now for a new one that has just a few ratings
const test = {
  scores: [
    {
      attractionId: "67",
      rating: 0.2
    },
    {
      attractionId: "68",
      rating: 1
    },
    {
      attractionId: "149",
      rating: 0.2
    }
  ]
};

const results = new Engine()
  .fit(ratings, items)
  .calculateSimilarities()
  .getRecommendationForNew(test).recommendations;

console.log(results.map(r => r.name).slice(0, 10));
