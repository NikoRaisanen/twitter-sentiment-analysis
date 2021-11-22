// Steps for backend twitter tweet api:
// Get 6 tweets with the twitter api
// Pass tweets list through google natural language api
// Take score + magnitude results and create weighted score

// const AWS = require('aws-sdk')
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


function parse_tweets(jsonResponse, callback) {
    callback = analyze_tweets
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
    // console.log(jsonResponse.statuses.length)
    for (var i = 0; i < jsonResponse.statuses.length; i++) {
        tweets[i].id = jsonResponse.statuses[i].id
        tweets[i].text = jsonResponse.statuses[i].text
    }
    console.log(tweets)
    callback(tweets)
}


async function analyze_tweets(tweetJson, callback) {
    callback = calculate_sentiment;
    // console.log(`Received the following data from parse_tweets\n${JSON.stringify(tweetJson)}`);
    console.log(`passed stringified data: ${JSON.stringify(tweetJson)}`)
    console.log(`length of passed json: ${Object.keys(tweetJson).length}`)
    const language = require('@google-cloud/language');

    // Establish NL API Client
    const client = new language.LanguageServiceClient();
    var totalMagnitude = 0;
    for (var i = 0; i < Object.keys(tweetJson).length; i++) {
        const document = {
            content: tweetJson[i].text,
            type: 'PLAIN_TEXT',
        };
        var [result] = await client.analyzeSentiment({document: document});
        var sentiment = result.documentSentiment;
        
        tweetJson[i].score = sentiment.score
        tweetJson[i].magnitude = sentiment.magnitude
        totalMagnitude += sentiment.magnitude
    }

    console.log(`now that everything is said and done, here is the new json object:\n${JSON.stringify(tweetJson)}`);
    console.log(`total magnitude: ${totalMagnitude}`)

    // calculate sentiment
    return callback(tweetJson, totalMagnitude);
}


function calculate_sentiment(tweetJson, totalMagnitude) {
    // Calculate weighted sentiment...
    // For each: 
    // tweetJson[i].score * ( tweetJson[i].magnitude / totalMagnitude )
    var finalSentiment = 0;
    for (var i = 0; i < Object.keys(tweetJson).length; i++) {
        tweetWeight = tweetJson[i].score * (tweetJson[i].magnitude / totalMagnitude);
        finalSentiment += tweetWeight
    }
    console.log(`The final sentiment is ${finalSentiment}`)
}


/* Flow:
    call_twitter api ->
    parse_tweets ->
    analyze_tweets ->
    calculate_sentiment ->
*/
function main() {
    call_twitter_api("happy", parse_tweets)
}


// exports.handler = async function(event, context) {
//     var response = {
//         "statusCode": 200,
//         "headers": {
//             "Content-Type": "application/json"
//         },
//         "body": "Hey this is my body text lol"
//     } // end response

//     console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
//     console.log('## CONTEXT: ' + serialize(context))
//     console.log('## EVENT: ' + serialize(event))
//     try {
//       return response
//     } catch(error) {
//       return error
//     } // end try
//   } // end lambda handler


main()