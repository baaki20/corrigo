module.exports = {
  name: "Corrigo",
  url: (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://corrigo-evidence.netlify.app").replace(/\/$/, ""),
  description: "Evidence and sources behind every Corrigo claim.",
};
