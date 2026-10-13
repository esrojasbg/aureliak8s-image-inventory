import { getFeature, registerInjectablesFromModules } from "@k8slens/feature-core";
import modulesWithInjectables from "./**/*.injectable.(ts|tsx)";

export const aureliak8sImageInventoryFeature = getFeature({
  id: "aureliak8s-image-inventory",
  register: (di) => {
    // every `*.injectable.ts(x)` file under this folder, registered: a new one is wired up by itself
    registerInjectablesFromModules(di, [...modulesWithInjectables]);
  },
});
