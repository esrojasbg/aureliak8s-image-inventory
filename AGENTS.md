# aureliak8s-image-inventory — a Lens extension, developed in AureliaK8s

> **This project is a Lens extension**: not a standalone app, website or library. It runs inside
> AureliaK8s (and Lens Desktop), hooking into their dependency-injection container to add UI and
> behaviour: status-bar and top-bar items, preference pages, commands, terminals, menus, tabs…

## Read this first

`~/.aureliak8s/extensions/extension-development-instructions/README.md` is **the** source of truth for what an extension can do in this
AureliaK8s build: the packages it serves, at which versions, and how to build. AureliaK8s writes it
again on every start. **If a capability is not in it, it is not part of the extension surface**:
say so to the user rather than working around it with AureliaK8s's internals.

After `npm install`, the README and type declarations of each `@k8slens/*` package in
`node_modules` document its tokens and factories with examples. Read them before using one.

## How it is built and loaded

- `src/index.ts` exports the extension's `Feature`; every `*.injectable.ts(x)` under `src` is
  registered by it.
- `npm run build` type-checks and bundles into `dist/index.js`. AureliaK8s loads this folder as a
  local extension and reloads it by itself after every build.
- The scaffold ships a built `dist/index.js` placeholder: the "Hello World: aureliak8s-image-inventory" status-bar item. Replace
  `src/placeholder.injectable.tsx` with the real thing.

## Dependency versions follow AureliaK8s

AureliaK8s serves `react`, `mobx` and the `@k8slens/*` packages to the extension and refuses to
load it when a declared range does not include the served version. The README above lists them
under "Dependency versions in this AureliaK8s build". Declare `^<version>` for each one used.

## Publishing

Raise `version` in `package.json`, describe the change in `CHANGELOG.md`, keep the
`lens-extension` and `aureliak8s-extension` keywords, and publish with AureliaK8s's "Publicar" (or `npm publish --access public`).
