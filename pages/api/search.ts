import { NextApiRequest, NextApiResponse } from "next";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INDEX_NAME = process.env.PINECONE_INDEX_NAME;

const searchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const query = req.query.query;
    if (!query || typeof query !== "string") {
      res
        .status(400)
        .json({ error: "Query parameter is missing or not a string" });
      return;
    }
    const num_results_int = parseInt(req.query.n as string);
    const n = isNaN(num_results_int) ? 8 : num_results_int;

    const PINECONE_API_KEY =
      process.env.PINECONE_API_KEY;
    const PINECONE_ENVIRONMENT =
      process.env.PINECONE_ENVIRONMENT || "gcp-starter";
    const pinecone = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });

    const index = pinecone.index(INDEX_NAME);

    const embedding_res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float",
    });
    const features = embedding_res.data[0].embedding

    const queryRequest = {
      vector: features,
      topK: n,
      includeValues: true,
      includeMetadata: true,
    };
    const queryResponse = await index.query(queryRequest);

    res
      .status(200)
      .json(
        queryResponse.matches.map((match) =>
          match.metadata && match.metadata["paragraph"] && match.metadata["file"] ? `\n${match.metadata["paragraph"]}` : ""
        )
      );
  } else {
    res.status(405).end();
  }
};

export default searchHandler;
