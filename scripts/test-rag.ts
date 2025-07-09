#!/usr/bin/env tsx

import {
  retrieveRelevantContext,
  shouldUseRAG,
  isRAGAvailable,
} from "../src/lib/rag";

const testQueries = [
  "Tell me about your background",
  "What's your work experience?",
  "What projects have you worked on?",
  "What are your technical skills?",
  "Where did you go to school?",
  "What's the weather like?", // This should NOT trigger RAG
];

async function testRAGSystem() {
  console.log("🧪 Testing RAG System Integration\n");

  // Test 1: Check if RAG is available
  console.log("1. Testing RAG Availability...");
  const isAvailable = await isRAGAvailable();
  console.log(`   RAG Available: ${isAvailable ? "✅ Yes" : "❌ No"}`);

  if (!isAvailable) {
    console.log("\n❌ RAG system is not available. Please check:");
    console.log("   - PINECONE_API_KEY environment variable");
    console.log("   - Pinecone index configuration");
    console.log("   - Network connectivity");
    return;
  }

  console.log("\n2. Testing Query Detection...");

  // Test 2: Query detection
  for (const query of testQueries) {
    const shouldUse = await shouldUseRAG(query);
    const indicator = shouldUse ? "🎯" : "⏭️";
    console.log(
      `   ${indicator} "${query}" -> ${shouldUse ? "Use RAG" : "Skip RAG"}`
    );
  }

  console.log("\n3. Testing Context Retrieval...");

  // Test 3: Actual retrieval
  const personalQueries: string[] = [];
  for (const query of testQueries) {
    if (await shouldUseRAG(query)) {
      personalQueries.push(query);
    }
  }

  for (const query of personalQueries) {
    console.log(`\n   🔍 Testing: "${query}"`);

    try {
      const context = await retrieveRelevantContext(query);

      if (context.chunks.length > 0) {
        console.log(
          `      ✅ Retrieved ${context.chunks.length} chunks from ${context.sources.length} sources`
        );
        console.log(
          `      📁 Sources: ${context.sources
            .map((s) => s.replace(/^knowledge-base\//, ""))
            .join(", ")}`
        );

        // Show first chunk preview
        const firstChunk = context.chunks[0];
        const preview = firstChunk.content.substring(0, 100) + "...";
        console.log(`      📄 Preview: ${preview}`);
        console.log(`      🎯 Score: ${firstChunk.score.toFixed(3)}`);
      } else {
        console.log("      ⚠️ No relevant context found");
      }
    } catch (error) {
      console.log(`      ❌ Error: ${error}`);
    }
  }

  console.log("\n4. Testing Context Formatting...");

  // Test 4: Context formatting
  try {
    const context = await retrieveRelevantContext(
      "Tell me about your background"
    );
    if (context.contextText) {
      console.log("   ✅ Context formatting successful");
      console.log(
        `   📏 Context length: ${context.contextText.length} characters`
      );

      // Check if context includes required elements
      const hasContextHeader = context.contextText.includes(
        "CONTEXT INFORMATION"
      );
      const hasSourceInfo = context.contextText.includes("from ");
      const hasInstructions = context.contextText.includes(
        "Please use this context"
      );

      console.log(`   📋 Has header: ${hasContextHeader ? "✅" : "❌"}`);
      console.log(`   📋 Has source info: ${hasSourceInfo ? "✅" : "❌"}`);
      console.log(`   📋 Has instructions: ${hasInstructions ? "✅" : "❌"}`);
    } else {
      console.log("   ⚠️ No context generated");
    }
  } catch (error) {
    console.log(`   ❌ Context formatting error: ${error}`);
  }

  console.log("\n🎉 RAG System Test Complete!");
  console.log("\nNext steps:");
  console.log("1. Start your development server: npm run dev");
  console.log("2. Test the chat interface with personal questions");
  console.log("3. Check the server logs for RAG activity");
  console.log("4. Monitor Pinecone usage in your dashboard");
}

async function main() {
  try {
    await testRAGSystem();
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
