import { Navbar, Nav } from 'react-bootstrap';
import './TopNav.css'

function TopNav() {
    return(
        <Navbar bg='myDark' variant='dark' sticky='top' expand='sm' className='fullNav'>
            <Navbar.Brand className='navBrand' href='/'>Twitter Sentiment Analysis</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
            <Nav>
                <Nav.Link href='/'>Usage Statistics</Nav.Link>
                <Nav.Link href='/'>Recent Searches</Nav.Link>
                <Nav.Link href='/'>About this project</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
        
    )
}

export default TopNav;