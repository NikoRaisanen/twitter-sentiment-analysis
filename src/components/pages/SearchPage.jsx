import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import TopNav from '../TopNav';
import ResultGraph from '../ResultGraph';
import { stringifyResult, sentimentToPercentage } from '../../helpers';
import './SearchPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [result, setResult] = useState({});
    const resultDiv = useRef(null);
    const formContainer = useRef(null);
    const searchText = useRef(null);
    let staticSearchText;

    useEffect(() => {
        console.log('useEffect');
        if (!showResults) {
            formContainer.current.className += ' fadeIn'

            // const transition = resultDiv.current.className.split(' ')[-1];

            // if (transition === 'fadeOut') {
            //     formContainer.current.className = formContainer.current.className.replace('fadeOut', 'fadeIn'); 
            // } else if (transition !== 'fadeIn') {
            //     formContainer.current.className += ' fadeIn';
            // }
        }
    }, [showResults]);

    const handleNewSearch = async (e) => {
        e.preventDefault();
        // toggleVisibility(formContainer);
        // window.scrollTo(0,0);
        // setShowResults(false);
        resultDiv.current.className = resultDiv.current.className+" fadeOut";
        // formContainer.current.className = formContainer.current.className+" fadeIn";
        setTimeout(() => {
            setShowResults(false);
            setResult({});
            setSearchTerm('');
        }, 500);
    }


    const handleSubmit = async (e) => {
        // make api call and return data
        e.preventDefault();
        console.log(`before classchange: ${formContainer.current.className}`);
        formContainer.current.className = formContainer.current.className.replace('fadeIn', 'fadeOut');
        console.log(`after classchange: ${formContainer.current.className}`);
        staticSearchText = searchText.current.value;
        setSearchTerm(searchText.current.value)
        const res = await fetch(`https://92ctge8hl1.execute-api.us-east-2.amazonaws.com/prod/sentiment-analysis?searchTerm=${staticSearchText}&searchType=mixed`)
        setResult(await res.json());
        setTimeout(() => {
            // toggleVisibility(formContainer);
            setShowResults(true);
        }, 500);
        // setShowResults(true);
        
    }

    return (
        <>
        <div className='searchPage'>
        <TopNav />
        <div className="container">
            { !showResults && 
            <div ref={formContainer} className="row search-bar d-flex justify-content-center align-items-center start-transparent">

              <div className="col-md-6">

                <form onSubmit={handleSubmit}>
                <FontAwesomeIcon className='leftIcon' icon={faTwitter}></FontAwesomeIcon>
                  <input ref={searchText} type="text" className="form-control form-input" placeholder="Search anything..."/>
                  <span className="left-pan"><FontAwesomeIcon onClick={handleSubmit} icon={faSearch}></FontAwesomeIcon></span>
                
                </form>
                
              </div>
              
            </div>
            }
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
