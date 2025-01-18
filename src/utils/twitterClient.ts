import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

const bearerToken = process.env.TWITTER_BEARER_TOKEN; // Get bearer token from the environment variable

// Function to post a tweet
export const tweet = async (text: string) => {
  if (!bearerToken) {
    throw new Error('Bearer token not available');
  }

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      { status: text }, // Tweet text payload
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );
    console.log('Tweet posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
};

export const fetchTweets = async (query: string, count: number): Promise<any[]> => {
  try {
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`, // Bearer token for authentication
      },
      params: {
        query: query,
        max_results: count, // Fetch the specified number of tweets
      },
    });

    return response.data.data; // Return the fetched tweets
  } catch (error: any) {
    if (error.response?.status === 429) {
      const resetTimestamp = parseInt(error.response.headers['x-rate-limit-reset']);
      console.log("Rate limit exceeded. Waiting until reset...");
      await waitUntilReset(resetTimestamp);
      return fetchTweets(query, count); // Retry after reset
    }

    console.error('Error fetching tweets:', error);
    console.log('This is the bearer token:', process.env.TWITTER_BEARER_TOKEN);
    return []; // Return an empty array in case of error
  }
};

  const waitUntilReset = async (resetTimestamp: number) => {
    const waitTime = resetTimestamp * 1000 - Date.now();
    if (waitTime > 0) {
      console.log(`Waiting for ${waitTime / 1000} seconds before retrying...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  };