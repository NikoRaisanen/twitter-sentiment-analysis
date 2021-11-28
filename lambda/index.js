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
                if (res.statusCode != 200) {
                    console.log(`Failed with response code ${res.statusCode}`);
                    reject("PROMISE REJECTED!!!")
                }
                jsonResponse = JSON.parse(body)
                resolve(jsonResponse)
            });
        });
        
        req.on('error', error => {
            console.error(error)
        });
        req.end()
    }); // end promise creation
} // end call_twitter_api


async function parse_tweets(jsonResponse) {
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

    tweetJson.totalMagnitude = totalMagnitude
    return tweetJson
}


async function calculate_sentiment(tweetJson) {
    // Calculate weighted sentiment...
    // For each: 
    // tweetJson[i].score * ( tweetJson[i].magnitude / totalMagnitude )
    var totalMagnitude = tweetJson.totalMagnitude
    var finalSentiment = 0;
    maxWeight = 0
    var impactTweet = {}
    // iterate over len of keys - 1 to exclude "total magnitude"
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


async function craft_response(finalSentiment, impactTweet) {
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
        "body": JSON.stringify(returnData)
    } // end response
    return response
}


exports.handler = async function(event, context) {
    console.log('## CONTEXT: ' + JSON.stringify(context))
    console.log('## EVENT: ' + JSON.stringify(event))
    console.log(`Here is the detected searchTerm:\n${event.queryStringParameters.searchTerm}`)

    jsonResp = await call_twitter_api(event.queryStringParameters.searchTerm)
    tweets = await parse_tweets(jsonResp)
    console.log(tweets)
    result = await analyze_tweets(tweets)
    sentimentResults = await calculate_sentiment(result)
    console.log(sentimentResults)
    sentiment = sentimentResults[0]
    selectedTweet = sentimentResults[1]
    responseObj = await craft_response(sentiment, selectedTweet)
    console.log("printing responseObj:")
    console.log(responseObj)
    return responseObj
  } // end lambda handler
