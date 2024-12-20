import { Pinecone } from "@pinecone-database/pinecone";
import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const readMarkdownFiles = async (filepath) => {
  return await fs.readFile(filepath, "utf8");
};

const getAllFiles = async () => {
  const projectFiles = await fs.readdir(path.join("kb", "projects"));
  const mdFiles = projectFiles
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join("projects", file));
  // return ["bio.md", "resume.md", "profile.md", "birthday.md", ...mdFiles];
  return ["profile.md"];
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
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
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

  const embeddings = {};

  for (const [file, chunks] of Object.entries(chunkedFileContents)) {
    console.log(`Extracting embeddings for ${file}`);
    const chunkEmbeddings = [];
    for (const { sentence } of chunks) {
      const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: sentence,
        encoding_format: "float",
      });
      chunkEmbeddings.push(res.data[0].embedding);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    embeddings[file] = chunkEmbeddings;
  }

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

  for (const [file, chunkEmbeddings] of Object.entries(embeddings)) {
    for (let idx = 0; idx < chunkEmbeddings.length; idx++) {
      const vec = chunkEmbeddings[idx];
      const { sentence, paragraph } = chunkedFileContents[file][idx];
      if (sentence.trim() === "") {
        continue;
      }
      const key = `${file}-${idx}`;
      console.log(`Adding vector for ${key}`);
      const upsertRequest = [
        {
          id: key,
          values: vec,
          metadata: { file: file, chunk: idx, sentence: sentence, paragraph: paragraph },
        },
      ];
      await index.upsert(upsertRequest);
      // await index.delete1({ids: [key]});
    }
  }
};

main().catch((error) => {
  console.error("An error occurred:", error);
});
