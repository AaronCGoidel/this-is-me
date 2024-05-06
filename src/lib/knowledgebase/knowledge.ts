export enum EmbedType {
  file = "file",
  project = "project",
  link = "link",
  prompt = "prompt",
}

export enum KnowledgeType {
  kb = "kb",
  embed = "embed",
  cmd = "cmd",
}

export interface Knowledge {
  type: KnowledgeType;
  id: string;
  chunk: string;
}

export interface Embed {
  type: EmbedType;
  id: string;
}

export interface LinkEmbed extends Embed {
  text: string;
  url: string;
  icon?: string;
}

export interface ProjectEmbed extends Embed {
  name: string;
  description: string;
  thumbnail: string;
  github_url: string;
}

export interface FileEmbed extends Embed {
  name: string;
  url: string;
}

export interface PromptEmbed extends Embed {
  text: string;
}