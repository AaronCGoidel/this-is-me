import { Embed, EmbedType, KnowledgeType } from "./knowledge"
import matter from "gray-matter";

const validateKnowledgePath = (path: string): KnowledgeType | null => {
  return null;
}

const getIdFromPath = (path: string): string => {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1];
  return fileName.split(".")[0];
}

const getEmbedType = (path: string): EmbedType => {
  const parts = path.split("/");
  return EmbedType[parts[2]];
}

const materializeKnowledge = () => {
}

const materializeEmbed = (path: string) => {
  const id = getIdFromPath(path);
  const type = getEmbedType(path);

  const file = matter.read(path);
  console.log(file);
  
  if (type === EmbedType.link) {
    // do something
  } else if (type === EmbedType.project) {
    // do something
  } else if (type === EmbedType.file) {
    // do something
  } else if (type === EmbedType.prompt) {
    // do something
  }
}

const materializeCommand = () => {
}

const materialize = (path: string) => {
  const type = validateKnowledgePath(path);
  if (!type) {
    // skip
    return;
  }  

  if (type === KnowledgeType.embed) {
    materializeEmbed(path);
  } else if (type === KnowledgeType.kb) {
    materializeKnowledge();
  } else if (type === KnowledgeType.cmd) {
    materializeCommand();
  }
}