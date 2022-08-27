import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import TopNav from '../TopNav';
import ResultGraph from '../ResultGraph';
import { stringifyResult, sentimentToPercentage } from '../../helpers';
import './searchPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [result, setResult] = useState({});
    const resultDiv = useRef(null);
    const newSearchButton = useRef(null);
    const formContainer = useRef(null);
    const searchText = useRef(null);
    let staticSearchText;

    useEffect(() => {
        console.log('useEffect');
        if (showResults) {
            scrollTo(resultDiv);
        }
        
        
    }, [result])


    const scrollTo = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'});
    }

    const handleNewSearch = async (e) => {
        e.preventDefault();
        window.scrollTo(0,0);
        resultDiv.current.className = resultDiv.current.className+" fadeOut";
        formContainer.current.className = formContainer.current.className+" fadeIn";

        setTimeout(() => {
            setShowResults(false);
            setResult({});
            setSearchTerm('');
        }, 500);
    }


    const handleSubmit = async (e) => {
        // make api call and return data
        e.preventDefault();
        staticSearchText = searchText.current.value;
        setSearchTerm(searchText.current.value)
        const res = await fetch(`https://92ctge8hl1.execute-api.us-east-2.amazonaws.com/prod/sentiment-analysis?searchTerm=${staticSearchText}&searchType=mixed`)
        setResult(await res.json());
        formContainer.current.className = formContainer.current.className+" fadeOut";
        setShowResults(true);
    }

    return (
        <>
        <div className='searchPage'>
        <TopNav />
        <div className="container">

            <div ref={formContainer} className="row search-bar d-flex justify-content-center align-items-center">

              <div className="col-md-6">

                <form onSubmit={handleSubmit}>
                <FontAwesomeIcon className='leftIcon' icon={faTwitter}></FontAwesomeIcon>
                  <input ref={searchText} type="text" className="form-control form-input" placeholder="Search anything..."/>
                  <span className="left-pan"><FontAwesomeIcon onClick={handleSubmit} icon={faSearch}></FontAwesomeIcon></span>
                
                </form>
                
              </div>
              
            </div>
            {/* } */}
          </div>
        </div>
        {showResults && 
            <div className='resultDiv' ref={resultDiv}>
            <ResultGraph sentiment={sentimentToPercentage(result.finalSentiment)}/>
            <p>{stringifyResult(result.finalSentiment, searchTerm).statement}</p>
            <button type="submit" onClick={handleNewSearch}>Do another search</button>
            </div>
        }
        </>
    );
}

export default SearchPage;
