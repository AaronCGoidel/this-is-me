const { PineconeClient } = require("@pinecone-database/pinecone");
const fs = require("fs").promises;
const path = require("path");

let transformers;

async function loadModules() {
  transformers = await import("@xenova/transformers");
}

const MODEL_NAME = "Xenova/bert-base-uncased";

const readMarkdownFiles = async (filepath) => {
  return await fs.readFile(filepath, "utf8");
};

const getAllFiles = async () => {
  const projectFiles = await fs.readdir(path.join("kb", "projects"));
  const mdFiles = projectFiles
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join("projects", file));
  return ["bio.md", "resume.md", "profile.md", ...mdFiles];
};

const chunkText = (text, chunkSize = 100) => {
  const words = text.split(" ");
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
};

const main = async () => {
  await loadModules();

  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
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
      chunks.map((chunk) =>
        featureExtractor(chunk, { pooling: "mean", normalize: true })
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
      const text = chunkedFileContents[file][idx];
      const key = `${file}-${idx}`;
      console.log(`Adding vector for ${key}`);
      const upsertRequest = {
        vectors: [
          {
            id: key,
            values: vec,
            metadata: { file: file, chunk: idx, text: text },
          },
        ],
      };
      await index.upsert({ upsertRequest });
    }
  }
};

main().catch((error) => {
  console.error("An error occurred:", error);
});
