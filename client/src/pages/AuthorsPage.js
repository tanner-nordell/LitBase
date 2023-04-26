import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import AuthorCard from '../components/AuthorCard';
import BookCard from '../components/BookCard';
const config = require('../config.json');

export default function AuthorsPage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [authorOfTheDay, setAuthorOfTheDay] = useState({});
  
  // add a state variable to store the app author (default to '')
  const [appAuthor, setAppAuthor] = useState("");

  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the Author of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/categories`)
      .then(res => res.json())
      .then(resJson => setAuthorOfTheDay(resJson));

    // fetch call to get the app author (name not pennkey) and store it in the state variable
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(resJson => setAppAuthor(resJson));
    

  }, []);

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const authorColumns = [
    {
      field: 'author',
      headerName: 'Author',
      renderCell: (row) => <Link onClick={() => setSelectedAuthor(row.author)}>{row.author}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'title',
      headerName: 'Title', //this might be incorrect... what is row.title?    
      renderCell: (row) => <Link onClick={() => setSelectedBook(row.title)}>{row.title}</Link> // A Link component is used just for formatting purposes   
    },
    {
      field: 'ratingsCount',
      headerName: 'Ratings Count'
    },
  ];

  return (
    <Container>
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedAuthor && <AuthorCard author={selectedAuthor} handleClose={() => setSelectedAuthor(null)} />}
      {selectedBook && <BookCard book={selectedBook} handleClose={() => setSelectedBook(null)} />}

      <h2>Check out author of the day:&nbsp;
        <Link onClick={() => setSelectedAuthor(authorOfTheDay.Author)}>{authorOfTheDay.Author}</Link>
      </h2>
      <Divider />
      
      <h2>Top authors based on review counts</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/authors`} columns={authorColumns} />
      <Divider />
      
      {/* paragraph (<p>text</p>) that displays the value of your author state variable */}
      <p>{appAuthor}
      </p>

    </Container>
  );
};