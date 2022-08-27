import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainText from './MainText';
import Header from './Header';
import SearchPage from '../components/pages/SearchPage';

function AppRouter() {
  return (
    // <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage/>} />
            <Route path="main" element={<MainText/>} />
            <Route path="header" element={<Header/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
