import Jumbotron from '../Jumbotron';
import './homePage.css';
import {Container, Row, Col} from 'react-bootstrap';

function HomePage() {
    return(
        <>
        <Jumbotron/>
        <Container className="myContainer">
            <Row>
                <Col md="6" className='columnStyle'>
                <p>
                    Perform a search on any word and discover how the people of Twitter feel about it.
                    <br />
                    <br />
                    In a world of biased sources, querying the thoughts of everyday people can lead to interesting insights
                </p>
                </Col>
                <Col md="6" className='columnStyle'>
                <p>
                    Test your assumptions with this app, you might be surprised
                    <br />
                    <br />
                    <br />
                    <a href="https://github.com/NikoRaisanen/twitter-sentiment-analysis/blob/main/README.md" className='link mt-5'>How it works &gt;</a>
                    <br />
                    <br />
                    <a className='link mt-5' href='/search'>Search now &gt;</a>
                </p>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default HomePage;