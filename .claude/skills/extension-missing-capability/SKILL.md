---
name: extension-missing-capability
description: "Use as soon as a request needs something the AureliaK8s extension surface does not provide, before working around it."
user_invocable: true
---

# When the extension surface lacks something

1. Check `~/.aureliak8s/extensions/extension-development-instructions/README.md` and the READMEs of the packages it lists: it may be there under
   another name. If it is, use it.
2. Otherwise tell the user, in a sentence or two, that the surface does not provide it today and
   what the nearest thing it does provide is. Do not reach for AureliaK8s's internals, unpublished
   packages, the DOM of its UI or Node built-ins.
3. Go on with the nearest thing, if the user wants it.
