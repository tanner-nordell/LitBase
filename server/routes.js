const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Group AGPT';
  
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Only valid type is 'name'.`);
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  connection.query(`
    SELECT *
    FROM Authors
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // there is only one song so we just directly access the first element of the query results array (data)
      res.json({
        gender: data[0].gender,
        name: data[0].name
      });
    }
  });
} 

/********************************
 * CATEGORIES ROUTES *
 ********************************/
// Route 1: GET /categories
const categories = async function(req, res) {
  // ternary operator to check the value of request query values to set default value of queries
  // const explicit = req.query.explicit === 'true' ? 1 : 0;
  // ORDER BY RAND()

  connection.query(`
    SELECT A.name AS Author
    FROM Books B JOIN Title_to_author TA ON B.title = TA.title JOIN Authors A ON TA.author = A.name
    WHERE about IS NOT NULL and gender <> "unknown"
    
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Return results of the query as an object, keeping only relevant data - first element of the query results array (data)
      // res.json({Author: data[0].Author});
      res.json(data[0]);
    }
  });
} 

// Route 2: GET /top_books_category 
// returns the highest rated book in top n reviewed categories

const top_books_category = async function(req, res) {
  const page = req.query.page;
  
  // ternary (or nullish) operator to set the pageSize based on the query or default to 5
  const pageSize = req.query.page_size ?? 5; 

  if (!page) {
    connection.query(`
    WITH temp AS (
      SELECT B.categories AS Category, MAX(B.ratingsCount) AS NumRatings, B.title, B.publishedDate
      FROM Books B
      GROUP BY B.categories
	HAVING NumRatings IS NOT NULL
      ORDER BY NumRatings DESC
      )
      
      SELECT T.Category AS Category, T.NumRatings AS NumRatings, Round(AVG(R.reviewScore),2) AS MaxAvgRating, R.title AS Title, T.publishedDate AS PublishedDate, TA.author AS Author
      FROM temp T 
            JOIN Books_rating R ON T.title = R.title
              JOIN Title_to_author TA ON T.title = TA.title
	      JOIN Authors A ON TA.author = A.name
      GROUP BY Category, NumRatings, Title, PublishedDate, Author
      ORDER BY NumRatings DESC, MaxAvgRating DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
    });
  } else {
    connection.query(`
    WITH temp AS (
      SELECT B.categories AS Category, MAX(B.ratingsCount) AS NumRatings, B.title, B.publishedDate
      FROM Books B
      GROUP BY B.categories
	HAVING NumRatings IS NOT NULL
      ORDER BY NumRatings DESC
      )
      
	SELECT T.Category AS Category, T.NumRatings AS NumRatings, Round(AVG(R.reviewScore),2) AS MaxAvgRating, R.title AS Title, 	T.publishedDate AS PublishedDate, TA.author AS Author
      FROM temp T 
            JOIN Books_rating R ON T.title = R.title
              JOIN Title_to_author TA ON T.title = TA.title
	      JOIN Authors A ON TA.author = A.name
      GROUP BY Category, NumRatings, Title, PublishedDate, Author
      ORDER BY NumRatings DESC, MaxAvgRating DESC
      LIMIT ${pageSize} OFFSET ${(page-1) * pageSize}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
    });
  }
}

// GT Route 3: GET /top_authors_category
// returns the authors with most number of work in each category, along with the author’s most reviewed work
const top_authors_category = async function(req, res) {
    
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 5; 

  if (!page) {
  
    connection.query(`
    WITH temp1 AS (
      SELECT DISTINCT B.categories AS Category, A.name AS Author, COUNT(*) AS WorkCount, B.title
      FROM Books B JOIN Title_to_author TA ON B.title = TA.title
      JOIN Authors A ON TA.author = A.name
      WHERE B.categories IS NOT NULL AND B.ratingsCount IS NOT NULL
      GROUP BY B.categories, A.name
      ORDER BY COUNT(*) DESC)
            
      SELECT T.Category, T.WorkCount AS WorkCountInCat, T.Author AS Author, T.title AS Title, MAX(T.WorkCount) AS MostReviewedWork
      FROM temp1 T 
      GROUP BY T.Category, T.WorkCount, T.Author
      `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
    });
  } else {
    
    connection.query(`
    WITH temp1 AS (
      SELECT DISTINCT B.categories AS Category, A.name AS Author, COUNT(*) AS WorkCount, B.title
      FROM Books B JOIN Title_to_author TA ON B.title = TA.title
      JOIN Authors A ON TA.author = A.name
      WHERE B.categories IS NOT NULL AND B.ratingsCount IS NOT NULL
      GROUP BY B.categories, A.name
      ORDER BY COUNT(*) DESC)
            
      SELECT T.Category, T.WorkCount AS WorkCountInCat, T.Author AS Author, T.title AS Title, MAX(T.WorkCount) AS MostReviewedWork
      FROM temp1 T 
      GROUP BY T.Category, T.WorkCount, T.Author
      LIMIT ${pageSize} OFFSET ${(page-1) * pageSize}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
    });
  }
}

// Route 4: GET /categories/:category
// Returns top books based on review counts and average ratings in category
const categories_category = async function(req, res) {
  
  const category = req.params.category;
  
  connection.query(`
    SELECT B.image AS Image, SUM(B.ratingsCount) AS NumRatings, FORMAT(AVG(R.reviewScore), 2) AS Rating, R.title AS Title, B.publishedDate AS PublishedDate, A.name AS Author, A.workcount AS NumWork
    FROM Books B 
    JOIN Books_rating R ON B.title = R.title
    JOIN Title_to_author TA ON B.title = TA.title
    JOIN Authors A on A.name = TA.author
    WHERE B.categories = "${category}" AND B.image IS NOT NULL
    GROUP BY Title, PublishedDate
    ORDER BY NumRatings DESC, Rating DESC
    LIMIT 20
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}



// Route 5: GET /authors/:author
// Returns author data based on which author is clicked
const authors_author = async function(req, res) {
  
  const author = req.params.author;
  
  connection.query(`
    SELECT *
    FROM Authors
    WHERE name = "${author}"
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data[0]);
    }
  });
}

// Route 6: GET /authors
// Returns top authors based on review counts and average ratings
const authors = async function(req, res) {
    
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 5; 

  if (!page) {
  
    connection.query(`
    SELECT SELECT B.title AS title, A.name AS author, ratingsCount
    FROM Books B JOIN Title_to_author TA ON B.title = TA.title
    JOIN Authors A ON TA.author = A.name
    WHERE ratingsCount > 5
      ORDER BY ratingsCount DESC
      `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
    });
  } else {
    
    connection.query(`
    SELECT B.title AS title, A.name AS author, ratingsCount
      FROM Books B JOIN Title_to_author TA ON B.title = TA.title
      JOIN Authors A ON TA.author = A.name
      WHERE ratingsCount > 5
        ORDER BY ratingsCount DESC
      
      LIMIT ${pageSize} OFFSET ${(page-1) * pageSize}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
    });
  }
}

// Route 7: GET /books/:title
// Returns book data based on which book is clicked
const books_book = async function(req, res) {

  const title = req.params.book;
  console.log(req.params);
  console.log(title);
  connection.query(`
    SELECT *
    FROM Books
    WHERE title = "${title}"
    LIMIT 1
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log("this is an error, route 7", err, data);
      res.json([]);
    } else {
      res.json(data[0]);
    }
  });
}

// Route 9: GET /search_books
const search_books = async function(req, res) {
  // return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';

  // publishedDate, ratingsCount NOT null 
  const ratingsCountLow = req.query.ratingsCount_low ?? 0;
  const ratingsCountHigh = req.query.ratingsCount_high ?? 500;

  // const explicit = req.query.explicit === 'true' ? NOT NULL : NULL;
  
  if (!title) {
  
    connection.query(`
    SELECT *
    FROM Books
    WHERE (ratingsCount BETWEEN ${ratingsCountLow} AND ${ratingsCountHigh}) AND
          publishedDate IS NOT NULL AND categories IS NOT NULL 
    ORDER BY title;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
    })
  } else {
    
    connection.query(`
    SELECT *
    FROM Books
    WHERE (title LIKE "%${title}%") AND
          (ratingsCount BETWEEN ${ratingsCountLow} AND ${ratingsCountHigh}) AND
          publishedDate IS NOT NULL AND categories IS NOT NULL 
    ORDER BY title;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
    })
  }
}

// Route 10: GET /categoriesAuthors/:category
// Returns top books based on review counts and average ratings in category
const categories_author = async function(req, res) {
  
  const category = req.params.category;
  
  connection.query(`
  SELECT A.name, A.workcount, A.fan_count, A.gender, A.image_url, A.about, A.born, A.died, A.influence, A.website, A.twitter, A.original_hometown,
   SUM(B.ratingsCount) AS NumRatings, FORMAT(AVG(R.reviewScore), 2) AS Rating, R.title AS Title
  FROM Books B
  JOIN Books_rating R ON B.title = R.title
  JOIN Title_to_author TA ON B.title = TA.title
  JOIN Authors A on A.name = TA.author
  WHERE B.categories = "${category}" AND A.image_url IS NOT NULL
  GROUP BY Title, PublishedDate
  ORDER BY NumRatings DESC, Rating DESC
  LIMIT 20
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  author,
  random,
  categories,
  top_books_category,
  top_authors_category,
  categories_category,
  categories_author,
  authors_author,
  books_book,
  authors,
  search_books,
}
