---
name: extension-create-banner-icons
description: "Draw this extension's own icon and Marketplace banner from what it does, at the sizes and weights the Marketplace takes, and point package.json at them."
user_invocable: true
---

# The icon and the banner of this extension

The icon is shown wherever the extension is listed (the navigator, the Marketplace), and the banner
across the top of its card and its page. They replace the scaffold's placeholders (a puzzle piece,
the name on a gradient), which a published extension must not keep.

1. Read what the extension does: `README.md`, `description` in `package.json`, and `src/`
   (what it adds, and where). Name its one idea in a few words, and pick one visual metaphor for it.
2. Draw `assets/icon.svg`:
   - square, `viewBox="0 0 64 64"`, at most 50 KB;
   - one simple, bold shape that stays recognisable at 16 pixels: no text, no thin lines (strokes of
     at least 4 units), no fine detail;
   - legible on a light background and on a dark one: a filled rounded square behind the shape
     (`rx` about 14) is the safe way;
   - plain SVG: no `<script>`, no `<image>`, no external `href`, no web fonts.
3. Draw `assets/banner.svg`:
   - twice as wide as tall, `viewBox="0 0 1280 640"`, at most 300 KB;
   - it is cropped to fill its frame: keep the name and the motif inside the central 80% of the
     width and 60% of the height, and let only the background reach the edges;
   - the extension's name, short, in a generic family (`font-family="system-ui, sans-serif"`), bold,
     large enough to read at 320 pixels wide; at most one short line under it saying what it does;
   - a background of its own (a gradient or a pattern) and the icon's motif, larger;
   - plain SVG, as the icon.
4. Use the same two or three colours in both, so they read as one extension.
5. Point `lensExtension` in `package.json` at them (`"icon": "assets/icon.svg"`,
   `"banner": "assets/banner.svg"`), and check `files` includes `assets`.
6. Check the sizes (`wc -c assets/icon.svg assets/banner.svg`) and that both parse as XML, then run
   `npm run build`: AureliaK8s reloads the extension, and its row and page show the new ones. Ask the
   user to look at them there, and adjust what they say.
