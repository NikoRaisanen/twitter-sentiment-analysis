import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import TopNav from './TopNav';
import ResultGraph from './ResultGraph';
import {stringifyResult, sentimentToPercentage, createResultGraph} from '../helpers';

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

    if (showResults) {
        return(
            <>
            <h2>{ JSON.stringify(result) }</h2>
            <p>{stringifyResult(result.finalSentiment, searchTerm)}</p>
            <ResultGraph />
            </>
        )
    
    }
    return (
        <div className='searchPage'>
        <TopNav />
        <form onSubmit={handleSubmit}>
            <label>
            Search for a word
            </label>
                <input type="text" value={searchTerm} onChange={handleChange}/>
            <input type="submit" value="Search" />
        </form>
        <h1>Searching for: {searchTerm}</h1>
        </div>
    );
}

export default SearchPage;
