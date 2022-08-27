import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './TopNav.css'

function TopNav() {
    return(
        <Navbar bg='myDark' variant='dark' sticky='top' expand='sm' className='fullNav'>
            <Navbar.Brand className='navBrand' href='/'>Twitter Sentiment Analysis</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
            <Nav>
                <Nav.Link href='/statistics'>Usage Statistics</Nav.Link>
                <Nav.Link href='/recent-searches'>Recent Searches</Nav.Link>
                <Nav.Link href='/about'>About this project</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
        
    )
}

export default TopNav;