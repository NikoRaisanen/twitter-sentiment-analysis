import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNav from './components/TopNav';
import Header from './components/Header';
import MainText from './components/MainText';
import gif from './media/mind-blown-amazed.gif';
import SearchPage from './components/SearchPage';

function App() {
  return (
    <div className='App'>
      {/* <TopNav />
      <Header />
      <MainText /> */}
      <SearchPage />
    </div>
  );
}

export default App;
