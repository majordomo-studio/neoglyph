module.exports = {
  branches: ["main", { name: "next", prerelease: true }], // The branch you want to release from
  repositoryUrl: "https://github.com/majordomo-studio/neoglyph.git",
  plugins: [
    "@semantic-release/commit-analyzer", // Analyze commit messages
    "@semantic-release/release-notes-generator", // Generate release notes
    "@semantic-release/changelog", // Update CHANGELOG.md
    "@semantic-release/npm", // Publish to npm
    "@semantic-release/github", // Create GitHub releases
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"], // Push these back to the repo
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
