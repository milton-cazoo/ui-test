# Monorepo UI Library

This repo includes
- Core: all components
- Input
- Button
- Checkbox

To create a new release, you'll have to
1. Create a PR with your changes.
  - Update the component's `package.json` version.
  - Update the root's `package.json` version.
2. Merge the PR.
3. Run `npm run create-release`.

The `release` workflow will automatically create a new version for each package affected by your changes.
