import { PineconeClient } from "@pinecone-database/pinecone";
import { promises as fs } from "fs";
import path from "path";

let transformers;

async function loadModules() {
  transformers = await import("@xenova/transformers");
}

const MODEL_NAME = "Xenova/distilbert-base-uncased";

const readMarkdownFiles = async (filepath) => {
  return await fs.readFile(filepath, "utf8");
};

const getAllFiles = async () => {
  const projectFiles = await fs.readdir(path.join("kb", "projects"));
  const mdFiles = projectFiles
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join("projects", file));
  return ["bio.md", "resume.md", "profile.md", "birthday.md", ...mdFiles];
};

const chunkText = (text) => {
  const paragraphs = text.split("\n\n");
  const sentences = [];
  for (const paragraph of paragraphs) {
    const paragraphSentences = paragraph.split(/(?<=[.?!])\s+(?=[A-Z])/);
    for (const sentence of paragraphSentences) {
      sentences.push({ sentence, paragraph });
    }
  }
  return sentences;
};

const main = async () => {
  await loadModules();

  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey:
      "13183aa4-cec7-4e7a-97ca-9708af445b30",
    environment: "gcp-starter",
  });

  const allFiles = await getAllFiles();
  const fileContents = {};

  for (const file of allFiles) {
    fileContents[file] = await readMarkdownFiles(path.join("kb", file));
  }

  const chunkedFileContents = {};
  for (const [file, content] of Object.entries(fileContents)) {
    chunkedFileContents[file] = chunkText(content);
  }

  const featureExtractor = await transformers.pipeline(
    "feature-extraction",
    MODEL_NAME,
    { revision: "default" }
  );

  const embeddings = {};

  for (const [file, chunks] of Object.entries(chunkedFileContents)) {
    console.log(`Extracting embeddings for ${file}`);
    const chunkEmbeddings = await Promise.all(
      chunks.map(({ sentence }) =>
        featureExtractor(sentence, { pooling: "mean", normalize: true })
      )
    );
    embeddings[file] = chunkEmbeddings.map((embedding) =>
      Array.from(embedding.data)
    );
  }

  const index = pinecone.Index("aaronai-kb");

  for (const [file, chunkEmbeddings] of Object.entries(embeddings)) {
    for (let idx = 0; idx < chunkEmbeddings.length; idx++) {
      const vec = chunkEmbeddings[idx];
      const {sentence, paragraph} = chunkedFileContents[file][idx];
      if (sentence.trim() === "") {
        continue;
      }
      const key = `${file}-${idx}`;
      console.log(`Adding vector for ${key}`);
      const upsertRequest = {
        vectors: [
          {
            id: key,
            values: vec,
            metadata: { file: file, chunk: idx, sentence: sentence, paragraph: paragraph },
          },
        ],
      };
      await index.upsert({ upsertRequest });
      // await index.delete1({ids: [key]});
    }
  }
};

main().catch((error) => {
  console.error("An error occurred:", error);
});
