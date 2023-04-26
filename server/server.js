const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author);
app.get('/random', routes.random);

// GT
app.get('/categories', routes.categories); 
app.get('/top_books_category', routes.top_books_category);
app.get('/top_authors_category', routes.top_authors_category);
app.get('/categories/:category', routes.categories_category);

app.get('/categoriesAuthors/:category', routes.categories_author); //clicking on a category will lead to CategoriesInfoAuthorsPage
app.get('/authors/:author', routes.authors_author);
app.get('/authorsBook/:book', routes.books_book);
app.get('/authors', routes.authors);
app.get('/search_books', routes.search_books);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
