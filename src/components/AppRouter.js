import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Jumbotron';
import SearchPage from '../components/pages/SearchPage';
import HomePage from './pages/HomePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
            <Route path="search" element={<SearchPage/>} />
            <Route path="header" element={<Header/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
