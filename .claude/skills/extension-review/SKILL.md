---
name: extension-review
description: "Check this extension against what makes it look and behave like the rest of AureliaK8s, fix what does not, and say where to see it. Run it before saying a change is done."
user_invocable: true
---

# Reviewing this extension before it is done

Read the section "Looking and behaving like the rest of AureliaK8s" and the one on where this build
differs from Lens in `~/.aureliak8s/extensions/extension-development-instructions/README.md`, then go through the code (`src/`) against each
point below. Fix what fails; do not just report it.

1. **Builds**: `npm run build` passes, with no type errors and no unused dependency in
   `package.json` (each one declared `^<version>` of the served one).
   Every `getInjectable`/`getInjectable2` is `export`ed from a `*.injectable.ts(x)` file: one
   that is not is never registered, and injecting it fails at run time ("Tried to inject
   non-registered injectable"), which leaves that part of the extension out.
   Every `getInjectable2` returns a factory from `instantiate` (`return () => thing`), and is
   used as `di.inject(it)()`: one that returns the function itself runs once per argument and then
   only hands back its first result (a tab that opens once and never again).
2. **Navigator rows**: every row component draws an indicator (`NavigatorBranchIndicator` or
   `NavigatorLeafIndicator`), a `NavigatorItemIcon` with a 16-pixel `currentColor` SVG, and a
   `NavigatorItemLabel`.
3. **Tables**: rendered with `Table`; every cell is one short line (counts and badges, not lists);
   headers are `ColumnHeader`/`SortableColumnHeader`; the data gives the rows a meaningful order;
   a page with a table has a one-line summary above it.
4. **Tabs**: a tab about a cluster names it in its `Title`, read through `@k8slens/cluster-contracts`;
   its id is stable for what it shows; `onTabCreate` can run twice harmlessly.
5. **Status-bar items**: an icon and a few characters, a tooltip saying what and where, a click that
   goes there, and nothing rendered when there is nothing to say.
6. **Details-panel sections**: `DrawerItem`s with short values, nothing the panel already shows.
7. **Errors and loading**: what can fail says so where the user looks (never a blank area), and
   what loads shows that it is loading.
8. **Words**: in the user's language, short, named as AureliaK8s names things.
9. **Leftovers of the scaffold**: `description`, `README.md` (what it does, where it shows,
   what each mark or option means), `CHANGELOG.md`, `author`, `license`, `repository`, and its
   own icon and banner (else run `/extension-create-banner-icons`).
10. **Writes**: anything that changes the cluster asks the user first, in a modal.

Then tell the user, point by point, what you changed, and exactly where in AureliaK8s to look at
each part (which cluster, which row of the navigator, which tab, which panel), so they can confirm
it looks right.
