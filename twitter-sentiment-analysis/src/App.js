import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNav from './components/TopNav';
import Header from './components/Header';
import MainText from './components/MainText';

function App() {
  return (
    <div className='App'>
      <TopNav />
      <Header />
      <MainText />
    </div>
  );
}

export default App;
