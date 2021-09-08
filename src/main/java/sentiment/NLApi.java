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
import java.util.List;

public class NLApi {

	public static String[] getSentiment(String content) {
		try (LanguageServiceClient language = LanguageServiceClient.create()) {
			// The text to analyze
			String text = content;
			Document doc = Document.newBuilder().setContent(text).setType(Type.PLAIN_TEXT).build();
			System.out.println(doc);

			// Detects the sentiment of the text
			Sentiment sentiment = language.analyzeSentiment(doc).getDocumentSentiment();
			System.out.println(sentiment);
			System.out.printf("Text: %s%n", text);
			System.out.printf("Sentiment: %s, %s%n", sentiment.getScore(), sentiment.getMagnitude());
			String[] sentimentArray = new String[] {Float.toString(sentiment.getScore()), Float.toString(sentiment.getMagnitude())};
			return sentimentArray;
		} catch (IOException e) {
			e.printStackTrace();
		} // end try block
		
		// Placeholder to satisfy return requirement
		String[] ph = new String[] {};
		return ph;
	}

	public static String[] getTweetInfo(String searchTerm) {
		int numTweets = 5;
		String language = "en";
		String tweetsApi = "https://api.twitter.com/1.1/search/tweets.json";
		
		// Adding search term, authentication, and language
		tweetsApi += "?q=" + searchTerm;
		System.out.println("Getting info from: " + tweetsApi + "&count=" + numTweets + "&lang=" + language);
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
		
		String[] tweetsArray = new String[numTweets];
		for (int i = 0; i < numTweets; i++) {
			JsonObject result = statuses.get(i).getAsJsonObject();
			JsonElement tweetText = result.get("text");
			tweetsArray[i] = tweetText.getAsString();
		}
		
//		System.out.println("\n\nARRAY CONTENTS\n");
//		for (String tweet : tweetsArray) {
//			System.out.println(tweet);
//		}

		return tweetsArray;
	}
	
	private static String urlEncodeInput(String input) {
		return URLEncoder.encode(input);
	}
	
	public static void main(String[] args) {
//		String[] sResult = getSentiment("test I am very happy :D");
//		String sScore = sResult[0];
//		String sMagnitude = sResult[1];
//		System.out.printf("Score: %s\nMagnitude: %s", sScore, sMagnitude);
		String searchTerm = "Covid 19";
		searchTerm = urlEncodeInput(searchTerm);
		System.out.println(searchTerm);
		
		String[] tweets = getTweetInfo(searchTerm);
		for (String tweet : tweets) {
			System.out.println(tweet);
		}
		System.out.println("\nDone executing");
	}

}
