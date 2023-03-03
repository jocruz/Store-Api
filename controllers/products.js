const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = "ab";
  const products = await Product.find({
    // name:{$regex: search, $options:'i'},
    price: { $gt: 30 },
  })
    .sort("price")
    .select("name price");
  res.status(200).json({ products, nbHits: products.length });
};
/**
 * * if the value of featured in the request URL is "true" (a string), then queryObject.featured will be set to true (a boolean).
 * * If the value of featured is "false" or any other string value, queryObject.featured will be set to false.
 * * For the sort() method, we would chain .sort() to  const products = await Product.find(queryObject)
 * * however because we want to sort the information before it gets assign to the products variable
 * * we have to
 */
const getAllProducts = async (req, res) => {
  // Extract query parameters from the request object
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  // Create an object to hold the MongoDB query parameters
  const queryObject = {};
  // Create an object to hold the MongoDB query parameters
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  // Add the "company" query parameter to the query object
  if (company) {
    queryObject.company = company;
  }
  // Add the "name" query parameter to the query object
  if (name) {
    // Use a regular expression to perform a case-insensitive search
    queryObject.name = { $regex: name, $options: "i" };
  }
  // Process the "numericFilters" query parameter
  if (numericFilters) {
    // Define a map of operators that will be used to replace the operators
    // in the numericFilters parameter
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    // Define a regular expression to match the operators in the numericFilters parameter
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;

    // Use the replace() method to replace the operators in the numericFilters parameter
    // with the corresponding MongoDB operators using the operatorMap object
    // !the match argument gets passed automatically by the .replace() method, so for every match that it finds
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-` // A callback function that gets called for each match found
      // The callback function takes the matched string as its argument (automatically passed by replace())
      // price-<-50,rating-<=-4 the symbols get replaced by gt or gte, so mongoose can read it better
    );
    // Define an array of field options that can be filtered by numeric values
    const options = ["price", "rating"];
    // Split the filters string by commas, and for each item...
    // ! price-$gt-50,rating-$gte-4 remember these are the items we are iterating through
    filters = filters.split(",").forEach((item) => {
      // Destructure the item string into field, operator, and value
      const [field, operator, value] = item.split("-");
      // Check if the field is one of the numeric filter options
      if (options.includes(field)) {
        // If the field property already exists in the query object, update its value
        // with a new object that has the operator key-value pair
        queryObject[field] = { [operator]: Number(value) }; //If the field property already exists, it will not be overwritten, but instead, its value will be updated with the new object that has the operator key-value pair.
      }
    });
  }

  // *To answer your question, the reason we would want to sort the query before resolving it is that sorting the results after they have been returned to the user may be less efficient and could result in slower performance.
  // *By sorting the results before they are returned, we can ensure that the results are sorted correctly and efficiently.
  let result = Product.find(queryObject);
  //sort
  if (sort) {
    console.log(sort);
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
    console.log("BEFORE AWAIT KEYWORD", result);
  } else {
    result = result.sort("createdAt");
  }
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  /**
   * The page is which page the user is on, the limit is how many results the user will get back, and the skip will be how many results the page is being limited to showing
   * That is why it has the formula page - 1 multiplied by the limit
   * Depending on what page the user is one, by default its 1, if the user sets a limit then that is how many
   */
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  /**
   * ! When you use the await keyword with a Mongoose query, it implicitly calls the exec() method and waits for the promise to be resolved with the query results.
   * In the Mongoose library, the exec() method is used to execute a query and return a Promise.
   * When you chain the exec() method to a query, it returns a Promise that resolves with the results of the query.
   * The await keyword is used to wait for this Promise to resolve before moving on to the next line of code.
   * So, when you use the Mongoose library and chain the exec() method to a query,
   * ! it is the await keyword that calls the exec() method and waits for the query results.
   * If you don't use the await keyword, you can call the exec() method manually to execute the query and get the results.
   * ! If we use the await keyword with a Mongoose query, the exec() method is automatically called for us and the result is returned as a resolved promise.
   */
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
