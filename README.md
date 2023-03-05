# controllers/products.js

## Summary

The code defines two asynchronous functions to handle the GET requests to a server.

The first function, ***getAllProductsStatic***, retrieves all products in the database whose price is greater than 30 and returns them sorted by price in ascending order. It then sends a JSON response to the client containing the list of products and the number of products that matched the query. This function was created to just test some of the functionality of the methods we'd be using from mongoose, such as select(), sort() and find(). Anything that worked here would be brought along to the ***main function*** which is the ***getAllProducts()*** function or the second function

The second function, ***getAllProducts***, retrieves the query parameters from the request object and creates a MongoDB query object. If the ***featured***, ***company***, and ***name*** parameters are present in the query string, they are added to the ***query object***. If the ***numericFilters*** parameter is present, the function replaces the operators in the string with their corresponding MongoDB operators and adds the filter to the query object. If the sort parameter is present, the results are sorted by the specified field(s), and if the ***fields*** parameter is present, only the specified fields are returned in the response.

The reason for ***sorting the query before*** resolving it is to ensure that the results are ***sorted correctly and efficiently***.

Right off the bat starting with the concept of destructuring, we have the following code



```
const featured = req.query.featured;
const company = req.query.company;
const name = req.query.name;
const sort = req.query.sort;
const fields = req.query.fields;
const numericFilters = req.query.numericFilters;
```
