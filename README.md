# Twitter Sentiment Analysis
See what the people of twitter think about any topic at https://peopleoftwitter.com/

### Search types
- `recent` -- pull the most recent tweets for the search term
- `popular` -- pull the most popular tweets from the last 7 days
- `mixed` -- pull a mix of the most recent and most popular tweets

### Architecture
![Architecture map](.img/completeSAGraph.png)

### Security
- unicode encoded api endpoint to hopefully reduce automated static scanning
- rate limiting api calls based on source IP with AWS WAF
- forcing a secure connection to peopleoftwitter.com
- javascript `.innerHTML` never used for data that users can modify

I was originally planning to create an edge lambda that would dinject security headers to the responses on peopleoftwitter.com (deployed on my cloudfront distribution). Overall, I decided not to implement it because the both the probability and impact of compromise are very low.

