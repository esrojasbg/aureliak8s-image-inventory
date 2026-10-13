---
name: extension-sync-dependencies
description: "Align this extension's dependency ranges with the versions AureliaK8s serves, then reinstall and rebuild. Use after updating AureliaK8s, or when it refuses to load the extension over a version."
user_invocable: true
---

# Syncing dependency versions with AureliaK8s

1. Read the JSON block under "Dependency versions in this AureliaK8s build" in
   `~/.aureliak8s/extensions/extension-development-instructions/README.md`. If it is missing, stop and say so: do not guess versions.
2. In `package.json`, for every entry of `dependencies`, `devDependencies` and
   `peerDependencies` named in that block, set the range to `^<version>`. Leave every other entry
   as it is, and add none. Keep the key order and the formatting.
3. If nothing changed, say so and stop. Otherwise run `npm install`, then `npm run build`.
4. Report the ranges that changed (old → new), and quote any install or build error verbatim.
