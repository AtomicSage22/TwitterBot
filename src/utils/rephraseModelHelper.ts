import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config({path: '../.env'});


export const rephraseTweet = async (input: string): Promise<string> => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Ensure this is set in your environment variables.

  if (!OPENROUTER_API_KEY) {
    console.error("Error: OpenRouter API key is missing.");
    return input; // Return the original tweet if API key is missing.
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.2-3b-instruct:free", // Use the free Gemini 2.0 model.
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Paraphrase this: ${input}`, // Provide the text input for paraphrasing.
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the paraphrased response from the returned data.
    const reply = response.data.choices?.[0]?.message?.content;
    if (reply) {
      console.log("Rephrased tweet:", reply);
      return reply;
    }

    throw new Error("Unexpected API response format.: " + JSON.stringify(response.data.choices[0].message.content));
  } catch (error: any) {
    console.error("Error rephrasing tweet:", error.response?.data || error.message);
    return input; // Return the original tweet if there's an error.
  }
};




