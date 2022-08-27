import './App.css';
// import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import MainText from './components/MainText';
import gif from './media/mind-blown-amazed.gif';
import SearchPage from './components/pages/SearchPage';
import AppRouter from './components/AppRouter';
import Header from './components/Header';

function App() {
  return (
    <div className='App'>
    <AppRouter/>
    </div>
    
  );
}

export default App;
