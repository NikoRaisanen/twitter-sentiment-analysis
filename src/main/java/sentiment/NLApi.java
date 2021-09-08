package sentiment;

import java.io.IOException;

//Imports the Google Cloud client library
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.Document.Type;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.gson.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;

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
		String tweetsApi = "https://api.twitter.com/1.1/search/tweets.json";
		// Adding search term and authentication
		tweetsApi += "?q=" + searchTerm + "&count=1";
		System.out.println("Getting info from: " + tweetsApi);
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
		System.out.print("Response body: " + response.body());
		System.out.println("\nResponse.toString(): " + response.toString());
		System.out.println("response.request(): " + response.request());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Gson gson = new Gson();
		JsonObject body = gson.fromJson(response.body(), JsonObject.class);
		JsonArray statuses = body.get("statuses").getAsJsonArray();
		JsonObject firstResult = statuses.get(0).getAsJsonObject();
		JsonElement tweetText = firstResult.get("text");
		
		
		
		System.out.printf("Here is json formatted tweet text: %s", tweetText.getAsString());
		// Below 2 lines are placeholder
		String[] ph = new String[] { "a", "b" };
		return ph;
	}

	public static void main(String[] args) {
//		String[] sResult = getSentiment("test I am very happy :D");
//		String sScore = sResult[0];
//		String sMagnitude = sResult[1];
//		System.out.printf("Score: %s\nMagnitude: %s", sScore, sMagnitude);
		getTweetInfo("Spiderman");
		System.out.print("\nDone executing");
	}

}
