import { NextApiRequest, NextApiResponse } from "next";
import { pipeline } from "@xenova/transformers";
import { PineconeClient } from "@pinecone-database/pinecone";

let extractor: any;

// singleton for lazy construction of the pipeline
class PipelineSingleton {
  static task: string = "feature-extraction";
  static model: string = "Xenova/distilbert-base-uncased";
  static instance: any = null;

  static async getInstance(progress_callback?: any): Promise<any> {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        progress_callback,
        revision: "default",
      });
    }
    return this.instance;
  }
}

const INDEX_NAME = "aaronai-kb";

const searchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const query = req.query.query;

    if (!query || typeof query !== "string") {
      res
        .status(400)
        .json({ error: "Query parameter is missing or not a string" });
      return;
    }

    if (!extractor) {
      extractor = await PipelineSingleton.getInstance();
    }

    const features = await extractor(query, {
      pooling: "mean",
      normalize: true,
    });

    const pinecone = new PineconeClient();
    const PINECONE_API_KEY =
      process.env.PINECONE_API_KEY;
    const PINECONE_ENVIRONMENT =
      process.env.PINECONE_ENVIRONMENT || "gcp-starter";
    await pinecone.init({
      environment: PINECONE_ENVIRONMENT,
      apiKey: PINECONE_API_KEY,
    });

    const index = pinecone.Index(INDEX_NAME);

    const queryRequest = {
      vector: Array.from(features.data) as number[],
      topK: 3,
      includeValues: true,
      includeMetadata: true,
    };
    const queryResponse = await index.query({ queryRequest });

    res
      .status(200)
      .json(
        queryResponse.matches.map((match) =>
          match.metadata && match.metadata["text"] && match.metadata["file"] ? `\n${match.metadata["text"]}` : ""
        )
      );
  } else {
    res.status(405).end();
  }
};

export default searchHandler;
