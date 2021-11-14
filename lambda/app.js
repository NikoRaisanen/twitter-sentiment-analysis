// Steps for backend twitter tweet api:
// Get 6 tweets with the twitter api
// Pass tweets list through google natural language api
// Take score + magnitude results and create weighted score

const https = require('https');

function call_twitter_api(searchTerm) {

    const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: `/1.1/search/tweets.json?count=6&lang=en&tweetmode=extended&q=${encodeURIComponent(searchTerm)}`,
        method: 'GET',
        headers: { authorization: process.env.TWITTER_BEARER },
    };
    
    jsonResponse = ''
    const req = https.request(options, res => {
        var body = ''
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', data => {
            body = body + data
        });
    
        res.on('end', function() {
            // console.log("Body: " + body)
            if (res.statusCode != 200) {
                console.log(`Failed with response code ${res.statusCode}`);
            }
            jsonResponse = JSON.parse(body)
            console.log(jsonResponse.statuses[0].created_at)
            // console.dir(jsonResponse, {depth: null, colors: true})
        });
    });
    
    
    
    req.on('error', error => {
        console.error(error)
    });
    req.end()

} // end call_twitter_api

call_twitter_api("happy to be alive")

