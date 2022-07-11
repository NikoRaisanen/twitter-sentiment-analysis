import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import TopNav from './TopNav';
import ResultGraph from './ResultGraph';
import {stringifyResult, sentimentToPercentage, createResultGraph} from '../helpers';
import search from '../media/search-outline.svg';
import './searchPage.css'

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [result, setResult] = useState({});

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSubmit = async (e) => {
        // make api call and return data
        e.preventDefault();
        const res = await fetch(`https://92ctge8hl1.execute-api.us-east-2.amazonaws.com/prod/sentiment-analysis?searchTerm=${searchTerm}&searchType=mixed`)
        setResult(await res.json());
        setShowResults(true);
    }

    return (
        <>
        <div className='searchPage'>
        <TopNav />
        <div className="search-box">
            <form onSubmit={handleSubmit}>
                <input type="text" value={searchTerm} onChange={handleChange} className="search-txt" name="" placeholder=""/>
                <input type="submit" className="search-btn" value=""/>
            </form>
            {/* <input type="image" src={search} name="saveForm" className="search-btn" id="saveForm" /> */}
            {/* <a href="#" className="search-btn">
            <img id="search" src={search} />
            </a> */}
        </div>
        {/* <form onSubmit={handleSubmit}>
            <label>
            Search for a word
            </label>
                <input type="text" value={searchTerm} onChange={handleChange}/>
            <input type="submit" value="Search" />
        </form> */}
        <h1>Searching for: {searchTerm}</h1>
        </div>
        {showResults && 
            <>
            <ResultGraph sentiment={sentimentToPercentage(result.finalSentiment)}/>
            <p>{stringifyResult(result.finalSentiment, searchTerm).statement}</p>
            </>
        }
        </>
    );
}

export default SearchPage;
