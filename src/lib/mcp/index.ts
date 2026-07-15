import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfile from "./tools/get-my-profile";
import getLeaderboard from "./tools/get-leaderboard";
import listMyCases from "./tools/list-my-cases";
import getMyStartup from "./tools/get-my-startup";
import searchDictionary from "./tools/search-dictionary";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "digiinnov-mcp",
  title: "DigiInnov Case Lab",
  version: "0.1.0",
  instructions:
    "Tools for the DigiInnov Case Lab learning platform. Read the signed-in learner's profile, XP, case sessions, and startup project, and search the innovation dictionary and the class leaderboard.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMyProfile, getLeaderboard, listMyCases, getMyStartup, searchDictionary],
});