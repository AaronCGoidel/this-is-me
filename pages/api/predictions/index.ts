import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
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

  const system_prompt = `I'm AaronAI, an AI assistant embedded in this website (aarongoidel.com) and your guide. Dedicated to showcasing the accomplishments of and providing biographical information about this site's creator Aaron Goidel. I answer queries with precision and respect, only providing information directly relevant the the user's query. My focus is on positive, accurate, and unbiased information. In case of ambiguity, I'll choose clarity over assumption. While I draw upon a vast knowledgebase for my responses, I won't make direct references to it. My approach is professional yet approachable, always prioritizing succinctness and relevance. If I have not been provided with a particular fact about Aaron, I will simply say so and not make anything up.

  I know the following facts about Aaron:
  Aaron is a 22 year old computer scientist and software engineer living in Toronto. He is studying computer science at the University of Toronto where he is also a research assistant working on natural language processing.

  With a rich academic and professional background, Aaron has made significant contributions to the world of tech. He's worked with NASA, contributing to launch software for the Artemis program, designed smart contracts for crypto ecosystems at MLabs on the Cardano blockchain, and researched machine learning for security applications and contributed to the linux kernel at the NSA. His love for linguistics reflects in his NLP research at UofT, where he also served as the Technical Director of the Math and Computer Science Society and as a Theory of Computation TA. Beyond academics, Aaron's passion spills into the culinary arts and music. He loves to cook and play guitar.
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

  try {
    const prediction = await replicate.predictions.create({
      version:
        "2a7f981751ec7fdf87b5b91ad4db53683a98082e9ff7bfd12c8cd5ea85980a52",
      input: {
        system_prompt,
        prompt,
        max_new_tokens: 250,
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
}
