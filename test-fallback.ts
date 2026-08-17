import { SCENARIOS } from "./src/data/topics";
import { generateFallbackContent } from "./src/data/fallback";

const item = SCENARIOS.find(s => s.id === "sc-3");
console.log("Scenario catalog item:", item);
try {
  const content = generateFallbackContent(item);
  console.log("Success! Fallback content generated:", JSON.stringify(content).substring(0, 300));
} catch (err: any) {
  console.error("FAILED to generate fallback content:", err);
}
