import { Navbar, Nav } from 'react-bootstrap';

function TopNav() {
    return(
        <Navbar bg='dark' variant='dark' fixed='top' expand='sm'>
            <Navbar.Brand href='/'>Twitter Sentiment Analysis</Navbar.Brand>
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