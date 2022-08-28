import Button from 'react-bootstrap/Button';
import './Jumbotron.css';
import Container from 'react-bootstrap/Container';

function Jumbotron() {
    return(
        // Take up full viewport
        <div className='main'>
            <div className="h-100 p-5 text-white">
            <div className='headerContent'>
                <h2 className='title mb-4'>Twitter Sentiment Analysis</h2>
                <p className='smallText'>Get a pulse for the thoughts of your fellow twitter-using humans</p>
                <Button className="btn btn-outline-light mt-5" type="button">Get Started</Button>
            </div>
            </div>
            
        </div>
    )
}

export default Jumbotron;