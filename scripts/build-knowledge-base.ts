#!/usr/bin/env tsx

import { buildFromFilesystem } from "../src/lib/knowledgebase/builder";

async function main() {
  try {
    await buildFromFilesystem();
    console.log("✅ Knowledge base build completed!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Execute when run via CLI
if (require.main === module) {
  void main();
}
