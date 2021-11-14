// Steps for backend twitter tweet api:
// Get 6 tweets with the twitter api
// Pass tweets list through google natural language api
// Take score + magnitude results and create weighted score

const https = require('https');

function call_twitter_api(searchTerm, callback) {

    const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: `/1.1/search/tweets.json?count=6&lang=en&tweetmode=extended&q=${encodeURIComponent(searchTerm)}`,
        method: 'GET',
        headers: { authorization: process.env.TWITTER_BEARER },
    };
    
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
            callback(jsonResponse);
        });
    });
    
    
    
    req.on('error', error => {
        console.error(error)
    });
    req.end()

} // end call_twitter_api

function parse_tweets(jsonResponse) {
    // console.log(jsonResponse.statuses)
    // Info needed for each tweet:
    // full_text
    // id -- FORMAT: `twitter.com/anyuser/<tweetID>`
    var tweets = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
    };
    console.log(jsonResponse.statuses.length)
    for (var i = 0; i < jsonResponse.statuses.length; i++) {
        console.log(jsonResponse.statuses[i].id)
        tweets[i].id = jsonResponse.statuses[i].id
        tweets[i].text = jsonResponse.statuses[i].text
    }
    // jsonResponse.statuses.forEach(function(element) {
    //     tweets.t0 = element.id
    //     console.log(element.id)
    //     console.log(element.text)
    // })
    console.log(tweets)
}

function main() {
    call_twitter_api("sad", parse_tweets)
}

main()