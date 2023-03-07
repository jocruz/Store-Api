# controllers/products.js

## Summary

The code defines two asynchronous functions to handle the GET requests to a server.

The first function, ***getAllProductsStatic***, retrieves all products in the database whose price is greater than 30 and returns them sorted by price in ascending order. It then sends a JSON response to the client containing the list of products and the number of products that matched the query. This function was created to just test some of the functionality of the methods we'd be using from mongoose, such as select(), sort() and find(). Anything that worked here would be brought along to the ***main function*** which is the ***getAllProducts()*** function or the second function

The second function, ***getAllProducts***, retrieves the query parameters from the request object and creates a MongoDB query object. If the ***featured***, ***company***, and ***name*** parameters are present in the query string, they are added to the ***query object***. If the ***numericFilters*** parameter is present, the function replaces the operators in the string with their corresponding MongoDB operators and adds the filter to the query object. If the sort parameter is present, the results are sorted by the specified field(s), and if the ***fields*** parameter is present, only the specified fields are returned in the response.

The reason for ***sorting the query before*** resolving it is to ensure that the results are ***sorted correctly and efficiently***.

Right off the bat starting with the concept of destructuring, we have the following code



```
  // Extract query parameters from the request object
const { featured, company, name, sort, fields, numericFilters } = req.query;

//This can be rewritten as below

<!-- 
const featured = req.query.featured;
const company = req.query.company;
const name = req.query.name;
const sort = req.query.sort;
const fields = req.query.fields;
const numericFilters = req.query.numericFilters; -->
```


Then we have this object

```
// Create an object to hold the MongoDB query parameters
  const queryObject = {};
```

The reason for this empty object is because when making a request to a web server that uses MongoDB as its database, the server would typically receive an HTTP request and use a MongoDB driver or client library to interact with the database. The queryObject would be used as an argument to a method like find or update on the database collection object.

Think of it this way, in our previous project we did the following

```
const getTask = asyncWrapper(async (req, res, next) => 
  /**
   * const taskID = req.params.id;
   */
  const { id: taskID } = req.params;
  console.log({ id: taskID }); //{ id: '63f982dab64f7f5f2fc3caa4' }

  const task = await Task.findOne({ _id: taskID });
  ```
Notice how in this function we already assigned const taskID to a part of the request object, the request.params.id. Then we use a MongoDB method findOne() and directly use an object inside that method that directly references the _id from our MongodDB document and set it equal to our taskID which comes from the request.params.id. 

This is why we use an empty object because we are going to be adding in every part that we get from the request object. If our Store API gets a request with some of the things for our store such as company name, feature, price etc, then we just append it to the empty object that we will eventually return our respond back 

```
res.status(200).json({ products, nbHits: products.length });
```

we send back products which is equal to

```
  const products = await result;
```

## if (name)

***MongoDB manual***
$regex
Provides regular expression capabilities for pattern matching strings in queries.

i
Case insensitivity to match upper and lower cases. For an example, see 
Perform Case-Insensitive Regular Expression Match.

## if (numericFilters)

### Function Summary
The provided code is a function that takes in a queryString object as a parameter and returns a MongoDB query object.

If the numericFilters property exists in the queryString object, the function replaces the comparison operators with their MongoDB equivalent (e.g., > becomes $gt), splits the resulting string into individual filters, and adds each filter to the queryObject object.

The function then checks if each filter's field is a valid filter option (either "price" or "rating") and updates the corresponding queryObject property with an object containing the operator key-value pair.

MongooseDB Functions
- replace(): This method is used to replace the comparison operators in the numericFilters string with their MongoDB equivalent using the operatorMap object.

- split(): This method is used to split the resulting filters string by commas, returning an array of individual filters.

- forEach(): This method is used to iterate through each individual filter in the filters array and add it to the queryObject object if the filter's field is a valid option.

- Number(): This function is used to convert the filter's value from a string to a number before adding it to the queryObject object.