package sentiment;

import java.io.IOException;

//Imports the Google Cloud client library
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.Document.Type;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.gson.*;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NLApi {

	public static String[] getSentiment(String content) {
		try (LanguageServiceClient language = LanguageServiceClient.create()) {
			// The text to analyze
			String text = content;
			Document doc = Document.newBuilder().setContent(text).setType(Type.PLAIN_TEXT).build();

			// Detects the sentiment of the text
			Sentiment sentiment = language.analyzeSentiment(doc).getDocumentSentiment();
			String[] sentimentArray = new String[] {Float.toString(sentiment.getScore()), Float.toString(sentiment.getMagnitude())};
			return sentimentArray;
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			System.out.println("GENERAL EXCEPTION CATCH EXECUTED... SKIPPING THIS ITERATION");
			return null;
		}
		
		// Placeholder to satisfy return requirement
		return new String[] {};
	}

	public static String[] getTweetInfo(String searchTerm) {
		int numTweets = 5;
		String language = "en";
		String tweetsApi = "https://api.twitter.com/1.1/search/tweets.json";
		
		// Adding search term, authentication, and language
		tweetsApi += "?q=" + searchTerm + "&count=" + numTweets + "&lang=" + language + "&tweet_mode=extended";
		System.out.println("Getting info from:" + tweetsApi);
		String twitterBearer = System.getenv("TWITTER_BEARER");
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest request = HttpRequest.newBuilder(
				URI.create(tweetsApi))
				.header("Authorization", twitterBearer)
				.build();
		
		// Get response object
		HttpResponse<String> response = null;
		try {
		response = client.send(request, BodyHandlers.ofString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		// Converting twitter response from string to JSON
		Gson gson = new Gson();
		JsonObject body = gson.fromJson(response.body(), JsonObject.class);
		JsonArray statuses = body.get("statuses").getAsJsonArray();
		
		String[] tweetsArray = new String[statuses.size()];
		for (int i = 0; i < statuses.size(); i++) {
			try {
			JsonObject result = statuses.get(i).getAsJsonObject();
			JsonElement full_text = result.get("full_text");
			tweetsArray[i] = full_text.getAsString();
			} catch (IndexOutOfBoundsException e) {
				System.out.println("Out of bounds executed, continuing...");
				continue;
			}
		}
		return tweetsArray;
	}
	
	private static String urlEncodeInput(String input) {
		return URLEncoder.encode(input);
	}
	
	public static HashMap<String, String> calculateWeightedSentiment(String[] tweets) {
		Map <Integer, String[]> map = new HashMap<Integer, String[]>();
		float totalMagnitude = (float) 0.0;
		float weightedScore = (float) 0.0;
		int counter = 0;
		// Populate hashmap with relevant information and get totalMagnitude
		for (String tweet : tweets) {
			if (tweet != null) {
				String[] sResult = getSentiment(tweet);
				map.put(counter, sResult);
				totalMagnitude += Float.parseFloat(sResult[1]);
				counter++;
			}
		} // end for loop	
		// for loop to calculate weighted sentiment
		// Specific weightedScore = (Specific sScore) * [(Specific sMagnitude)/(sum of sMagnitudes)]
		// weightedScore = sum of all specific weightedScores
		for (int i = 0; i < map.size(); i++) {
			String[] sResult = map.get(i);
			float sScore = Float.parseFloat(sResult[0]);
			float sMagnitude = Float.parseFloat(sResult[1]);
			weightedScore += (sScore * (sMagnitude / totalMagnitude));
		}
		String sentiment = "";
		if (weightedScore >= 0.1 && weightedScore < 0.4)
			sentiment = "Slightly Positive";
		else if (weightedScore >= 0.4)
			sentiment = "Very Positive";
		else if (weightedScore <= -0.1 && weightedScore > -0.4)
			sentiment = "Slightly Negative";
		else if (weightedScore <= -0.4)
			sentiment = "Very Negative";
		else
			sentiment = "Neutral";
		
		System.out.println(map);
		System.out.println("Size of hashmap:" + map.size());
		System.out.println("Total magnitude: " + totalMagnitude);
		System.out.println("Weighted score is: " + weightedScore);
		System.out.println("The sentiment is: " + sentiment);
		
		HashMap <String, String> sMap = new HashMap<String, String>();
		sMap.put("sentiment", sentiment);
		sMap.put("weightedScore", Float.toString(weightedScore));
		// Return array of strings with weighted score and stringified sentiment
		return sMap;
	}
	
	public static void main(String[] args) {
		String searchTerm = "depress";
		System.out.println("Gathering sentiment based on the following search term: " + searchTerm);

		String[] tweets = getTweetInfo(urlEncodeInput(searchTerm));
		HashMap<String, String> results = calculateWeightedSentiment(tweets);
		System.out.printf("\n%s returns a %s sentiment on Twitter with a score of %s", searchTerm, results.get("sentiment"), results.get("weightedScore"));
		System.out.println("\nDone executing");
	}

}
