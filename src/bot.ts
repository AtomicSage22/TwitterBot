// import { tweet, fetchTweets } from './utils/twitterClient';  // Updated to include fetchTweets for fetching tweets
import dotenv from 'dotenv';
import cron from 'node-cron';
import { rephraseTweet } from './utils/rephraseModelHelper'; // Import rephrasing helper
import { fetchTweets, tweet } from './utils/twitterClient';  // Import fetchTweets for fetching tweets

// Initialize environment variables
dotenv.config();

// Function to generate tweet content based on fetched and rephrased tweets

// Fetch and rephrase tech news tweet for 9 AM
const generateTechNewsTweet = async (): Promise<string | null> => {
  try {
    // Fetch tweets related to 'JavaScript' or 'Tech News'
    const fetchedTweets = await fetchTweets(`"tech news" OR "latest technology" OR "technology trends" OR "AI updates" OR "software updates" OR 
               "developer updates" OR "tech industry news" OR "programming news" OR #TechNews OR #AI OR #TechTrends 
               -ad -sponsored -giveaway -is:retweet lang:en min_faves:10 min_retweets:5`, 10);  // Get 1 tweet related to JavaScript

    if (!fetchedTweets || fetchedTweets.length === 0) {
      throw new Error('No tweets found for JavaScript.');
    }

    // Log the fetched tweet for testing purposes
    console.log('Fetched tweet:', fetchedTweets[0].text);

    // Rephrase the tweet
    const tweetToRephrase = fetchedTweets[0].text;
    return await rephraseTweet(tweetToRephrase);
  } catch (error) {
    console.error('Error fetching or rephrasing tech news tweet:', error);
    return null;  // Return null to prevent posting a generic tweet
  }
};

// Fetch and rephrase development-related tweet for 12 PM
const generateDevTweet = async (): Promise<string | null> => {
  try {
    // Fetch tweets related to 'MERN Stack'
    const fetchedTweets = await fetchTweets(`"MERN Stack" OR "MongoDB Express React Node" OR #MERN OR #FullStack OR #JavaScript OR #WebDevelopment 
               -ad -sponsored -giveaway -is:retweet lang:en min_faves:5 min_retweets:3`, 10);  // Get 1 tweet related to MERN Stack

    if (!fetchedTweets || fetchedTweets.length === 0) {
      throw new Error('No tweets found for MERN Stack.');
    }

    // Log the fetched tweet for testing purposes
    console.log('Fetched tweet:', fetchedTweets[0].text);

    // Rephrase the tweet
    const tweetToRephrase = fetchedTweets[0].text;
    // const tweetToRephrase = "MERN Stack is a collection of JavaScript-based technologies — MongoDB, Express.js, React, and Node.js — used to build full-stack web applications";
    const rephrasedTweet = await rephraseTweet(tweetToRephrase);
    if (rephrasedTweet === tweetToRephrase) {
      throw new Error('Failed to rephrase tweet.');
    }
    return rephrasedTweet;
  } catch (error) {
    console.error('Error fetching or rephrasing dev tweet:', error);
    return null;  // Return null to prevent posting a generic tweet
  }
};

// // Fetch and rephrase humorous tweet for 6 PM
const generateHumorTweet = async (): Promise<string | null> => {
  try {
    // Fetch tweets related to developer humor
    const fetchedTweets = await fetchTweets(`"tech humor" OR "programmer jokes" OR "coding humor" OR "developer memes" OR "tech memes" OR 
               "funny programming" OR "tech news jokes" OR #ProgrammingHumor OR #TechHumor OR #DevJokes 
               -ad -sponsored -giveaway -is:retweet lang:en min_faves:10 min_retweets:5`, 1);  // Get 1 tweet related to Developer Humor

    if (!fetchedTweets || fetchedTweets.length === 0) {
      throw new Error('No tweets found for Developer Humor.');
    }

    // Log the fetched tweet for testing purposes
    console.log('Fetched tweet:', fetchedTweets[0].text);

    // Rephrase the tweet
    const tweetToRephrase = fetchedTweets[0].text;
    return await rephraseTweet(tweetToRephrase);
  } catch (error) {
    console.error('Error fetching or rephrasing humor tweet:', error);
    return null;  // Return null to prevent posting a generic tweet
  }
};

// // Function to post the tweet
const postTweet = async (tweetContent: string) => {
  try {
    await tweet(tweetContent);
    console.log('Tweet posted:', tweetContent);
  } catch (error) {
    console.error('Failed to post tweet:', error);
  }
};

// Schedule tweets at specific times
cron.schedule('0 9 * * *', async () => {
  const techNewsTweet = await generateTechNewsTweet();
  if (techNewsTweet) {
    await postTweet(techNewsTweet);
  }
});

cron.schedule('0 12 * * *', async () => {
  const devTweet = await generateDevTweet();
  if (devTweet) {
    await postTweet(devTweet);
  }
});

cron.schedule('0 18 * * *', async () => {
  const humorTweet = await generateHumorTweet();
  if (humorTweet) {
    await postTweet(humorTweet);
  }
});

// Main bot logic
const main = () => {
  console.log('Twitter bot started!');
  console.log('Fetching and posting tweets at scheduled times...');
  console.log(generateDevTweet());

};

main();
