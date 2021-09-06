package sentiment;

import java.io.IOException;

//Imports the Google Cloud client library
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.Document.Type;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;

public class NLApi {
	
	public static String getSentiment(String content) {
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
		      String strScore = Float.toString(sentiment.getScore());
		      return strScore;
		    } catch (IOException e) {
		    	e.printStackTrace();
		    } // end try block
	    return "hi";
	}
	public static void main(String[] args) {
		String sentimentRating = getSentiment("WOW, I love pie it is SOOOO good and amazing!!!");
		System.out.printf("This is the sentiment score: %s", sentimentRating);

	}

}
