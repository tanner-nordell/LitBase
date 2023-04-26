import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import AuthorCard from '../components/AuthorCard';
import BookCard from '../components/BookCard';
const config = require('../config.json');

export default function CategoriesPage() {
  // setState hook to persist information across renders (such as the result of our API calls)
  // const [authorOfTheDay, setAuthorOfTheDay] = useState({});
  
  const [appAuthor, setAppAuthor] = useState("");

  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);

  // useEffect hook runs the provided callback after every render; (optional) argument [] - run the callback if value changes
  useEffect(() => {
    // Fetch request to get author/category
    // fetch(`http://${config.server_host}:${config.server_port}/categories`)
    //   .then(res => res.json())
    //   .then(resJson => setAuthorOfTheDay(resJson));

    // fetch call to get the app author
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(resJson => setAppAuthor(resJson));

  }, []);

  // Array of objects - field (column), headerNam, renderCell (optional)
  const topBooksColumns = [
    {
      field: 'Category',
      headerName: 'Category',
      renderCell: (row) => <NavLink to={`/categories/${row.Category}`}>{row.Category}</NavLink> // A NavLink component is used to create a link to the category page      
    },
    {
      field: 'Title',
      headerName: 'Book',
      renderCell: (row) => <Link onClick={() => setSelectedBook(row.Title)}>{row.Title}</Link> // A Link component is used just for formatting purposes   
    },
    {
      field: 'NumRatings',
      headerName: '# of Reviews',
      
    },
    {
      field: 'MaxAvgRating',
      headerName: 'Average Rating'
    },
    {
      field: 'Author',
      headerName: 'Author',   
      renderCell: (row) => <Link onClick={() => setSelectedAuthor(row.Author)}>{row.Author}</Link> // A Link component is used just for formatting purposes
    },
    
  ];

  const topAuthorsColumns = [
    {
      field: 'Category',
      headerName: 'Category',
      renderCell: (row) => <NavLink to={`/categoriesAuthors/${row.Category}`}>{row.Category}</NavLink> // A NavLink component is used to create a link to the album page      
    },
    {
      field: 'Author',
      headerName: 'Author',
      renderCell: (row) => <Link onClick={() => setSelectedAuthor(row.Author)}>{row.Author}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'WorkCountInCat',
      headerName: 'Work Count'      
    },
    {
      field: 'Title',
      headerName: 'Most Reviewed Book',
      renderCell: (row) => <Link onClick={() => setSelectedBook(row.Title)}>{row.Title}</Link> // A Link component is used just for formatting purposes
    },
    
  ]

  return (
    <Container>
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedAuthor && <AuthorCard author={selectedAuthor} handleClose={() => setSelectedAuthor(null)} />}
      {selectedBook && <BookCard book={selectedBook} handleClose={() => setSelectedBook(null)} />}

      {/* <h2>Check out author {selectedAuthor.Author}&nbsp; */}
        {/* <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link> */}
        {/* from category <NavLink to={`/categories/${authorOfTheDay.Category}`}>{authorOfTheDay.Category}</NavLink> */}
      {/* </h2> */}
      
      <Divider />
      <h2>Top Books in each Category based on Number of Reviews and Average Ratings</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_books_category`} columns={topBooksColumns} />
      <Divider />
      
      {/* h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top Authors in each Category based on Work Count</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_authors_category`} columns={topAuthorsColumns} defaultPageSize={5} rowsPerPageOptions={[5,10]}/>
      <Divider />
      
      {/* paragraph (<p>text</p>) that displays the value of your author state variable */}
      <p>{appAuthor}
      </p>

    </Container>
  );
};