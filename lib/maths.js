const maths = {};

// Create an m * n sized matrix
maths.zeros2d = (m, n) => {
  const arr = [];
  for (let i = 0; i < m; i++) {
    arr[i] = [];
    for (let j = 0; j < n; j++) {
      arr[i][j] = 0;
    }
  }
  // allow us to quickly get the shape
  arr.shape = () => [m, n];
  return arr;
};

// calculate cosine similarity between two vectors
maths.calculateCosineSimilarity = (a, b) => {
  if (a.length !== b.length) {
    throw new Error("a and b have to have the same length");
  }
  const dotProduct = maths.dotProduct(a, b);
  const magA = maths.mag(a);
  const magB = maths.mag(b);
  let product = magA * magB;
  product = product === 0 ? 1 : product;
  return dotProduct / product;
};

maths.dotProduct = (a, b) => {
  if (a.length !== b.length) {
    throw new Error("a and b have to have the same length");
  }
  let dotProduct = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
  }
  return dotProduct;
};

maths.mag = a => Math.sqrt(maths.dotProduct(a, a));

module.exports = maths;
