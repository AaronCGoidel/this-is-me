#!/usr/bin/env tsx

import {
  buildFromDatabase,
  buildFromFilesystem,
  wipeNamespace,
} from "../src/lib/knowledgebase/builder";

async function main() {
  try {
    // Ensure we start from a clean slate so we don't accumulate stale vectors
    await wipeNamespace();
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
