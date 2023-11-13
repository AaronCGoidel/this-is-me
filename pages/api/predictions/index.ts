import Replicate from "replicate";
import rateLimit from "../../../utils/rateLimit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const limiter = rateLimit({
  interval: 20 * 60 * 1000, // 20 minutes
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export default async function handler(req, res) {
  try {
    await limiter.check(res, 24, 'CACHE_TOKEN');

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error(
        "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
      );
    }

    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const user_prompt = req.body.user_prompt;
    const chat_history = req.body.chat_history;
    const knowledge = req.body.knowledge;

    const system_prompt = `I'm AaronAI, an AI assistant embedded in this website (aarongoidel.com) and your guide. Dedicated to showcasing the accomplishments of and providing biographical information about this site's creator Aaron Goidel. I answer queries with precision and respect, only providing information directly relevant the the user's query. My focus is on positive, accurate, and unbiased information. In case of ambiguity, I'll choose clarity over assumption. While I draw upon a vast knowledgebase for my responses, I won't make direct references to it. My approach is professional yet approachable, always prioritizing succinctness and relevance. If I have not been provided with a particular fact about Aaron, I will simply say so and not make anything up. I will format my responses legibly links, text decorations, lists, and code blocks with markdown. When answering I will be to-the point. I always answer in a brief paragraph.
  
  I can use the following knowledge when relevant to answer questions about Aaron Goidel:
  Aaron is a 22 year old computer scientist and software engineer living in Toronto. He is studying computer science at the University of Toronto where he is also a research assistant working on natural language processing.

  ${knowledge}  
  `;

    let prompt = "";

    if (chat_history && chat_history.length > 0) {
      let chat_sequence = "";
      for (let i = 0; i < chat_history.length; i += 2) {
        chat_sequence += `[INST] ${chat_history[i]} [/INST]\n${
          chat_history[i + 1]
        }\n`;
      }
      console.log(chat_sequence);
      prompt += chat_sequence;
    }

    prompt += `[INST] ${user_prompt} [/INST]`;

    console.log("[MODEL] Prompting model with:\n", prompt);

    const model_id =
      "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d";

    try {
      const prediction = await replicate.predictions.create({
        version: model_id,
        input: {
          system_prompt,
          prompt,
          max_new_tokens: 175,
          temperature: 0.7,
          top_p: 1,
          top_k: 20,
          repetition_penalty: 1.2,
          repetition_penalty_sustain: 256,
          token_repetition_penalty_decay: 128,
        },
      });

      console.log("[MODEL] Response:\n", prediction);

      if (prediction?.error) {
        res.status(500).json({ error: prediction.error });
        return;
      }
      res.json(prediction);
    } catch (error) {
      console.error("Error querying model:", error);
      res.status(500).json({ error: "Failed to query the model." });
    }
  } catch (err) {
    console.error(err);
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
