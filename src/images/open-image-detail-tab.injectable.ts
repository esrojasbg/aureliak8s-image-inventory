import { getInjectable2 } from "@k8slens/injectable";
import { buildImageDetailTabId } from "./image-detail-tab-kind";
import { imageDetailTabBunch } from "./image-detail-tab.injectable";

export const openImageDetailTabInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-open-or-focus-image-detail-tab",
  instantiate: (di) => {
    const openTab = di.inject(imageDetailTabBunch.openTab)();
    const focusTab = di.inject(imageDetailTabBunch.focusTab)();

    // Fábrica (ver open-image-inventory-tab.injectable.ts): sin el () => extra, abrir el
    // detalle de la misma imagen una segunda vez devolvería la promesa vieja sin hacer nada.
    return () => async (clusterId: string, registry: string, repository: string, tagDisplay: string) => {
      const tabId = buildImageDetailTabId({ clusterId, registry, repository, tagDisplay });

      try {
        await openTab({ tabId });
      } catch (error) {
        console.error("[aureliak8s-image-inventory] openTab (detalle de imagen) falló, se intenta focusTab", error);
        await focusTab({ tabId });
      }
    };
  },
});
