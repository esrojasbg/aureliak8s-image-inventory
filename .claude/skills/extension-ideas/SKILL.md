---
name: extension-ideas
description: "Propose starter prompts for this extension, grounded in what this AureliaK8s build lets extensions do."
user_invocable: true
---

# Starter ideas for this extension

1. Read `~/.aureliak8s/extensions/extension-development-instructions/README.md`. Propose nothing it does not list.
2. Read the extension's name in `package.json`: it hints at what the user wants (a name like
   "node-alerts" suggests notifications about nodes). Ignore a generic name.
3. Look through `src/` to see what is already built, and move it forward rather than repeat it.
4. Offer 5–7 prompts the user could paste back, each one sentence about what the extension does for
   the user and where it shows — in product terms, never in terms of tokens, injectables or MobX.
5. Show them as a bulleted list under "Starter ideas for this extension", and wait.
