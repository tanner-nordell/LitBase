import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { green, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
// import HomePage from './pages/HomePage';
// import AlbumsPage from './pages/AlbumsPage';
// import SongsPage from './pages/SongsPage';
// import AlbumInfoPage from './pages/AlbumInfoPage'
import HomeBooksPage from './pages/HomeBooksPage'
import AuthorsPage from './pages/AuthorsPage'

import CategoriesPage from './pages/CategoriesPage'
import CategoriesInfoBooksPage from './pages/CategoriesInfoBooksPage'
import CategoriesInfoAuthorsPage from './pages/CategoriesInfoAuthorsPage'
import { GridEvents } from "@mui/x-data-grid";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: {
      //light: '#757ce8',
      main: '#008771',
      //dark: '#002884',
      //contrastText: '#fff',
    },
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          {/* <Route path="/albums" element={<AlbumsPage />} /> */}
          {/* <Route path="/albums/:album_id" element={<AlbumInfoPage />} /> */}
          {/* <Route path="/songs" element={<SongsPage />} /> */}
          <Route path="/" element={<HomeBooksPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:category" element={<CategoriesInfoBooksPage />} />
          <Route path="/categoriesAuthors/:category" element={<CategoriesInfoAuthorsPage />} />
          
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}