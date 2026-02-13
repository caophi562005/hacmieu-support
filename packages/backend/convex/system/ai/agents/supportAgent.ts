import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: groq("moonshotai/kimi-k2-instruct-0905"),
  instructions: SUPPORT_AGENT_PROMPT,
});
