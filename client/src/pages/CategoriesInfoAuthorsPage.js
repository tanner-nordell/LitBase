import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Divider, Grid } from '@mui/material';
// import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function CategoriesInfoAuthorsPage() {
  const { category } = useParams();
  
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/categoriesAuthors/${category}`)
      .then(res => res.json())
      .then(resJson => setAuthors(resJson));
  }, [authors]);

  // flexFormat to display 
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    
    // empty object {} in the Container attribute sx with flexFormat.
    // <Container style={flexFormat}> {/*flexFormat converts into square*/}
    <Grid container xs={12} padding={'10px 10px 10px 10px'}>
       <Grid item xs={12} paddingLeft={'10px'} paddingTop={'10px'}>
       <h1>Top Authors for {category} based on Number of Reviews and Ratings</h1>
      </Grid>     
      
      <Divider />

      {authors.map((author) =>

        <Grid container xs={12} spacing={2} padding={'15px 15px 15px 15px'}>
          <Grid item xs={4}>
            <img

              src={author.image_url} 
              alt={`${author.image_url}`}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid item xs={12}>
              <h2>{author.name}</h2>
            </Grid>

            <Grid item xs={12}>
              <h6> About: {author.about}</h6>
            </Grid>

            <Grid item xs={12}>
              <h6> # of Fans: {author.fan_count}. Influence: {author.influence}</h6>
            </Grid>
            <Grid item xs={12}>
              <h6> Gender: {author.gender}</h6>
            </Grid>
            <Grid item xs={12}>
              <h6> Workcount: {author.workcount}</h6>
            </Grid>
            <Grid item xs={12}>
              <h6> Born: {author.born} Died: {author.died}</h6>
            </Grid>
            <Grid item xs={12}>
              <h6> Hometown: {author.original_hometown}</h6>
            </Grid>
            <Grid item xs={12}>
              <h6> Website: {author.website}</h6>
            </Grid>
    
          </Grid>
         


        </Grid>
     
      )}
    {/* </Container> */}
    </Grid>
  );
}