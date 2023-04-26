import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import SongCard from '../components/SongCard';
//import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function HomeBooksPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [title, setTitle] = useState('');
  const [ratingsCount, setRatingsCount] = useState([0, 500]);
  
  // const [categorized, setCategorized] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_books`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((book) => ({ id: book.title, ...book }));
        setData(songsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_books?title=${title}` +
      `&ratingsCount_low=${ratingsCount[0]}&ratingsCount_high=${ratingsCount[1]}`
      
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        // const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        // setData(songsWithId);
        const songsWithId = resJson.map((book) => ({ id: book.title, ...book }));
        setData(songsWithId);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    // { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
    //     <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    // ) },
    { field: 'title', headerName: 'Title' , minWidth: 450 },

    { field: 'authors', headerName: 'Author' , minWidth: 300 },
    
    { field: 'categories', headerName: 'Categories' , minWidth: 250,
    renderCell: (params) => ( <a href={`/categories/${params.value}`}>{params.value}</a> )},
    
    { field: 'ratingsCount', headerName: 'Ratings Count' , minWidth: 150 },
    
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Search Books</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={6}>
          <p>Ratings Count</p>
          <Slider
            value={ratingsCount}
            min={0}
            max={500}
            step={5}
            onChange={(e, newValue) => setRatingsCount(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>

      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight

      />
    </Container>
  );
} 