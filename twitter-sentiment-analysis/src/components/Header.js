import Button from 'react-bootstrap/Button'
import './Header.css'

function Header() {
    return(
        // Take up full viewport
        <div className='headerContainer'>
            <div class="h-100 p-5 text-white bg-dark">
            <div className='headerContent'>
                <h2 class='title mb-4'>Twitter Sentiment Analysis</h2>
                <p class='smallText'>Get a pulse for the thoughts of your fellow twitter-using humans</p>
                <Button className="btn btn-outline-light mt-5" type="button">Get Started</Button>
            </div>
            </div>
            
        </div>
    )
}

export default Header;