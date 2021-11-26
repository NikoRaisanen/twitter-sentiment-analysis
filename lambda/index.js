// Steps for backend twitter tweet api:
// Get 6 tweets with the twitter api
// Pass tweets list through google natural language api
// Take score + magnitude results and create weighted score

// const AWS = require('aws-sdk')
const https = require('https');
const language = require('@google-cloud/language');

async function call_twitter_api(searchTerm) { 

    const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: `/1.1/search/tweets.json?count=6&lang=en&tweetmode=extended&q=${encodeURIComponent(searchTerm)}`,
        method: 'GET',
        headers: { authorization: process.env.TWITTER_BEARER },
    };
    
    return new Promise(function(resolve, reject) {
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
                    reject("PROMISE REJECTED!!!")
                }
                jsonResponse = JSON.parse(body)
                // console.log(jsonResponse)
                resolve(jsonResponse)
            });
        });
        
        req.on('error', error => {
            console.error(error)
        });
        req.end()
    

    }); // end promise creation
    // console.log(`My Promise obj: ${myPromise}`)
    
} // end call_twitter_api

async function main() {
    jsonResp = await call_twitter_api("depressed")
    console.log(`Here is my json response:`)
    console.log(jsonResp)
    console.log(jsonResp.statuses.length)
}
main()
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
        tweets[i].id = jsonResponse.statuses[i].id_str
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

    // Establish NL API Client
    try {
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
    } // end for loop
    } catch(e) {
        console.log(e)
    }

    console.log(`now that everything is said and done, here is the new json object:\n${JSON.stringify(tweetJson)}`);
    console.log(`total magnitude: ${totalMagnitude}`)

    // calculate sentiment
    return callback(tweetJson, totalMagnitude);
}


function calculate_sentiment(tweetJson, totalMagnitude) {
    callback = craft_response
    // Calculate weighted sentiment...
    // For each: 
    // tweetJson[i].score * ( tweetJson[i].magnitude / totalMagnitude )
    var finalSentiment = 0;
    maxWeight = 0
    var impactTweet = {}
    for (var i = 0; i < Object.keys(tweetJson).length; i++) {
        tweetWeight = tweetJson[i].score * (tweetJson[i].magnitude / totalMagnitude);
        finalSentiment += tweetWeight

        // pull out the most relevant tweet to show users
        if (Math.abs(tweetWeight) > Math.abs(maxWeight)) {
            maxWeight = tweetWeight
            impactTweet.data = tweetJson[i]
        }
        
    }
    finalSentiment = Math.round(finalSentiment * 100) / 100
    // console.log(`Here is the most impactful tweet obj ${JSON.stringify(impactTweet)}`)
    callback(finalSentiment, impactTweet.data)
}

function craft_response(finalSentiment, impactTweet) {
    console.log("***** CRAFT_RESPONSE BLOCK *****")
    console.log(`Final sentiment: ${finalSentiment}\nImpact Tweet: ${impactTweet.id}`)
    // json object with final sentiment score + highest impact tweet
    returnData = {
        'finalSentiment': finalSentiment,
        'impactId': impactTweet.id
    }

    console.log(`final data:\n${returnData.finalSentiment}\n${returnData.impactId}`)

    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": "Hey this is my body text lol"
    } // end response
    return response


}

/* Flow:
    call_twitter api ->
    parse_tweets ->
    analyze_tweets ->
    calculate_sentiment ->
*/
// main()


// exports.handler = function(event, context) {
//     console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
//     console.log('## CONTEXT: ' + JSON.stringify(context))
//     console.log('## EVENT: ' + JSON.stringify(event))
//     result = await call_twitter_api("genocide", parse_tweets)
//     console.log("Hello, end of execution reached")
//   } // end lambda handler