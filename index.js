const fs = require("fs");
const maths = require("./lib/maths");

// Bring in the data
const ratingData = fs.readFileSync("./data/responses.json", "utf-8");
const itemData = fs.readFileSync("./data/attractions.json", "utf-8");

// Parse the data. We have no data on users so we will extrapolate
// from responses
const ratings = JSON.parse(ratingData);
const items = JSON.parse(itemData);
const users = [];

const ratingsArray = [];

// Create the user array and also parse the responses into a usable format
for (let key in ratings.responses) {
  const response = ratings.responses[key];
  const individualRatings = response.scores;
  users.push({
    userId: key,
    userName: response.userName,
    location: response.location
  });
  for (let score of individualRatings) {
    score.userName = response.userName;
    ratingsArray.push(score);
  }
}

// Create an users * items shaped matrix filled with zeros
const matrix = maths.zeros2d(users.length, items.attractions.length);

// Remember the order of columns and rows
const colLabels = items.attractions.map(attraction => attraction.name);
const cols = items.attractions.map(attraction => attraction.attractionId + "");
const rows = users.map(user => user.userName);

// And build the users to items matrix
for (let ratingInstance of ratingsArray) {
  const { userName, attractionId, rating } = ratingInstance;
  const i = rows.indexOf(userName);
  const j = cols.indexOf(attractionId);
  matrix[i][j] = rating;
}

// Calculate the similarities by comparing each user to each other user.
// Build an object that shows who is being compared to who and sort users
// in descending order of similarity
const similarities = [];
for (let i = 0; i < matrix.length; i++) {
  const a = matrix[i];
  const userSimilarity = { userName: rows[i], to: [] };
  for (let j = 0; j < matrix.length; j++) {
    if (j === i) {
      continue;
    }
    const b = matrix[j];
    userSimilarity.to.push({
      userName: rows[j],
      similarity: maths.calculateCosineSimilarity(a, b)
    });
  }
  userSimilarity.to.sort((a, b) => {
    return b.similarity - a.similarity;
  });
  similarities.push(userSimilarity);
}

for (let similarity of similarities) {
  console.log(similarity);
}
