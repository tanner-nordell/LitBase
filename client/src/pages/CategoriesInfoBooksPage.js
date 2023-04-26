import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Divider, Grid } from '@mui/material';
// import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function CategoriesInfoBooksPage() {
  const { category } = useParams();
  
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/categories/${category}`)
      .then(res => res.json())
      .then(resJson => setBooks(resJson));
  }, [category]);

  // flexFormat to display 
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    
    // empty object {} in the Container attribute sx with flexFormat.
    // <Container style={flexFormat}> {/*flexFormat converts into square*/}
    <Grid container xs={12} padding={'10px 10px 10px 10px'}>
       <Grid item xs={12} paddingLeft={'10px'} paddingTop={'10px'}>
       <h1>Top Books for {category} based on Number of Reviews and Ratings</h1>
      </Grid>     
      
      <Divider />

      {books.map((book) =>

        <Grid container xs={6} spacing={2} padding={'15px 15px 15px 15px'}>
          <Grid item xs={3}>
            <img

              src={book.Image} 
              alt={`${book.Title}`}
            />
          </Grid>
          <Grid item xs={9}>
            <Grid item xs={12}>
              <h2>{book.Title}</h2>
            </Grid>

            <Grid item xs={12}>
              <h4> Author: {book.Author}</h4>
            </Grid>

            <Grid item xs={12}>
              <h4> # of Ratings: {book.NumRatings}</h4>
            </Grid>
            <Grid item xs={12}>
              <h4> Rating: {book.Rating}</h4>
            </Grid>
          </Grid>
         


        </Grid>
      
        // <Box
        //   key={book.Title}
        //   p={3}
        //   m={2}
        //   style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        // >
        //   {/*adds images to the flexbox*/}
        //   <img
        //     src={book.Image}
        //     alt={`${book.Title}`}
        //   />
        //   <Grid item xs={12}>
        //     <h4>{book.Title}</h4>
        //   </Grid>
        //   <Grid item xs={6}>
        //     <h4> # of Ratings: ${book.NumRatings}</h4>
        //   </Grid>
        //   <Grid item xs={6}>
        //     <h4> Rating: ${book.Rating}</h4>
        //   </Grid>
         
        //   <h4>{book.Title}, # of Ratings: {book.NumRatings}, Rating: {book.Rating}</h4>
        // </Box>
      )}
    {/* </Container> */}
    </Grid>
  );
}