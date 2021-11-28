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

async function parse_tweets(jsonResponse) {
    // console.log(jsonResponse.statuses)
    // Info needed for each tweet:
    // full_text
    // id -- FORMAT: `twitter.com/anyuser/<tweetID>`
    var tweets = {};
    console.log(jsonResponse.statuses.length)
    for (var i = 0; i < jsonResponse.statuses.length; i++) {
        tweets[i] = {}
        tweets[i].id = jsonResponse.statuses[i].id_str
        tweets[i].text = jsonResponse.statuses[i].text
    }
    return tweets
}


async function analyze_tweets(tweetJson) {
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

    // console.log(`now that everything is said and done, here is the new json object:\n${JSON.stringify(tweetJson)}`);
    // console.log(`total magnitude: ${totalMagnitude}`)
    tweetJson.totalMagnitude = totalMagnitude

    // console.log("Here is my json object before returning:")
    // console.log(tweetJson)
    // calculate sentiment
    return tweetJson
}


function calculate_sentiment(tweetJson) {
    // Calculate weighted sentiment...
    // For each: 
    // tweetJson[i].score * ( tweetJson[i].magnitude / totalMagnitude )
    var totalMagnitude = tweetJson.totalMagnitude
    var finalSentiment = 0;
    maxWeight = 0
    var impactTweet = {}
    // iterate until len of keys - 1 to exclude "total magnitude"
    for (var i = 0; i < Object.keys(tweetJson).length - 1; i++) {
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
    return [finalSentiment, impactTweet.data]
}

function craft_response(finalSentiment, impactTweet) {
    console.log("***** CRAFT_RESPONSE BLOCK *****")
    console.log(`Final sentiment: ${finalSentiment}\nImpact Tweet: ${impactTweet.id}`)
    // json object with final sentiment score + highest impact tweet
    returnData = {
        'finalSentiment': finalSentiment,
        'selectedTweet': impactTweet.id
    }

    console.log(`final data:\n${returnData.finalSentiment}\n${returnData.selectedTweet}`)

    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": returnData
    } // end response
    return response


}
async function main() {
    jsonResp = await call_twitter_api("MF")
    tweets = await parse_tweets(jsonResp)
    console.log(tweets)
    result = await analyze_tweets(tweets)
    sentimentResults = await calculate_sentiment(result)
    sentiment = await sentimentResults[0]
    selectedTweet = await sentimentResults[1]
    responseObj = await craft_response(sentiment, selectedTweet)
    console.log("printing responseObj:")
    console.log(responseObj)
    

}
// main()

/* Flow:
    call_twitter api ->
    parse_tweets ->
    analyze_tweets ->
    calculate_sentiment ->
*/


exports.handler = async function(event, context) {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## CONTEXT: ' + JSON.stringify(context))
    console.log('## EVENT: ' + JSON.stringify(event))
    console.log("Hello, end of execution reached")

    jsonResp = await call_twitter_api("sad")
    tweets = await parse_tweets(jsonResp)
    console.log(tweets)
    result = await analyze_tweets(tweets)
    sentimentResults = calculate_sentiment(result)
    console.log(sentimentResults)
    sentiment = sentimentResults[0]
    selectedTweet = sentimentResults[1]
    responseObj = craft_response(sentiment, selectedTweet)
    console.log("printing responseObj:")
    console.log(responseObj)
    return responseObj
  } // end lambda handler