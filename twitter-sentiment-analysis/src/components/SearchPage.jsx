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
    const useResultRef = useRef(null);

    useEffect(() => {
        console.log('useEffect');
        if (showResults) {
            scrollTo(useResultRef);
        }
        
    }, [showResults])

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }


    const scrollTo = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'});
    }


    const handleSubmit = async (e) => {
        // make api call and return data
        e.preventDefault();
        const res = await fetch(`https://92ctge8hl1.execute-api.us-east-2.amazonaws.com/prod/sentiment-analysis?searchTerm=${searchTerm}&searchType=mixed`)
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

            <div className="row search-bar d-flex justify-content-center align-items-center">

              <div className="col-md-6">

                <form onSubmit={handleSubmit}>
                {/* <span className='wrapper'> */}
                <FontAwesomeIcon className='leftIcon' icon={faTwitter}></FontAwesomeIcon>
                  <input type="text" className="form-control form-input" value={searchTerm} onChange={handleChange} placeholder="Search anything..."/>
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
            <div className='resultDiv' ref={useResultRef}>
            <ResultGraph onShow={() => {console.log('showing')}} sentiment={sentimentToPercentage(result.finalSentiment)}/>
            <p>{stringifyResult(result.finalSentiment, searchTerm).statement}</p>
            </div>
        }
        </>
    );
}

export default SearchPage;