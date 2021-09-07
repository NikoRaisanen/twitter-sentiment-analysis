package sentiment;

import java.io.IOException;

//Imports the Google Cloud client library
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.Document.Type;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;

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

	public static String[] getTweetInfo() {

		// Below 2 lines are placeholder
		String[] ph = new String[] { "a", "b" };
		return ph;
	}

	public static void main(String[] args) {
		String[] sResult = getSentiment("test I am very happy :D");
		String sScore = sResult[0];
		String sMagnitude = sResult[1];
		System.out.printf("Score: %s\nMagnitude: %s", sScore, sMagnitude);

	}

}
