import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState, useRef} from 'react';
import TopNav from './TopNav';
import ResultGraph from './ResultGraph';
import {stringifyResult, sentimentToPercentage, createResultGraph} from '../helpers';
import search from '../media/search-outline.svg';
import './searchPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCropSimple, faSearch } from '@fortawesome/free-solid-svg-icons';
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

    // const handleChange = (e) => {
    //     setSearchTerm(e.target.value);
    // }


    const scrollTo = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'});
    }

    const handleNewSearch = () => {
        window.scrollTo(0,0);
        resultDiv.current.className = resultDiv.current.className+" myFade";
        setTimeout(() => {
            setShowResults(false);
            setResult({});
            setSearchTerm('');
        }, 3000);
        // setShowResults(false);
        // setResult({});
        // setSearchTerm('');
    }


    const handleSubmit = async (e) => {
        // make api call and return data
        staticSearchText = searchText.current.value;
        setSearchTerm(searchText.current.value)
        e.preventDefault();
        const res = await fetch(`https://92ctge8hl1.execute-api.us-east-2.amazonaws.com/prod/sentiment-analysis?searchTerm=${staticSearchText}&searchType=mixed`)
        setResult(await res.json());
        setShowResults(true);
        // setTimeout(() => {
        //     scrollTo(useResultRef);
        // } , 2000);
        // scrollTo(useResultRef);
    }

    return (
        <>
        <div className='searchPage'>
        <TopNav />
        {/* <div className="search-container">
            <form onSubmit={handleSubmit} className="search-container">
                    <input type="text" value={searchTerm} onChange={handleChange} className="search-txt" name="search" id='search-bar'/>
                    <FontAwesomeIcon icon={faSearch} size='xs' className="search-icon"></FontAwesomeIcon>
                <button type="submit" className="search-btn" value="">
                    <span>Search</span>
                </button>
            </form>
         
        </div> */}
        <div className="container">

            <div ref={formContainer} className="row search-bar d-flex justify-content-center align-items-center">

              <div className="col-md-6">

                <form onSubmit={handleSubmit}>
                {/* <span className='wrapper'> */}
                <FontAwesomeIcon className='leftIcon' icon={faTwitter}></FontAwesomeIcon>
                  <input ref={searchText} type="text" className="form-control form-input" placeholder="Search anything..."/>
                  <span className="left-pan"><FontAwesomeIcon onClick={handleSubmit} icon={faSearch}></FontAwesomeIcon></span>
                {/* </span> */}
                
                </form>
                
              </div>
              
            </div>
            
          </div>
        {/* <form onSubmit={handleSubmit}>
            <label>
            Search for a word
            </label>
                <input type="text" value={searchTerm} onChange={handleChange}/>
            <input type="submit" value="Search" />
        </form> */}
        {/* <h1>Searching for: {searchTerm}</h1> */}
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
