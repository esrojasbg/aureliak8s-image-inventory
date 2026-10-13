---
name: extension-publish
description: "Prepare and publish a new version of this extension to npm, so that it shows in the Marketplace."
user_invocable: true
---

# Publishing this extension

1. Check `package.json`: the `lens-extension` and `aureliak8s-extension` keywords, a `version` not yet on npm
   (`npm view <name> versions`), and — warn if missing — `license`, `author`, `repository`,
   `bugs`, and the `lensExtension` icon and banner.
2. Describe what changed in `CHANGELOG.md`, under the new version, newest first.
3. Run `npm run build` and fix what fails.
4. Ask the user to publish with AureliaK8s's "Publicar" on the extension's page, or run
   `npm publish --access public` here: npm asks for its login and one-time password itself.
