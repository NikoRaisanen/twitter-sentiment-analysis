package sentiment;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;


class SentimentAnalysisTest {
	@Test
	final void testGetSentiment() {
		System.out.println("executing GetSentiment()");
		String[] sResult= NLApi.getSentiment("tweet text");
		Assertions.assertTrue(sResult instanceof String[]);
	}

	@Test
	final void testGetTweetInfo() {
		Assertions.fail("Not yet implemented");
	}

	@Test
	final void testCalculateWeightedSentiment() {
		Assertions.fail("Not yet implemented"); // TODO
	}

}
