import { getInjectable2 } from "@k8slens/injectable";
import { imageInventoryTabBunch } from "./image-inventory-tab.injectable";

export const openImageInventoryTabInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-open-or-focus-tab",
  instantiate: (di) => {
    const openTab = di.inject(imageInventoryTabBunch.openTab)();
    const focusTab = di.inject(imageInventoryTabBunch.focusTab)();

    // Devuelve una fábrica (clusterId se pasa al llamar lo que entrega esta función, no
    // al inyectarla): el ciclo de vida por defecto de getInjectable2 es un keyedSingleton
    // que cachea por los argumentos de la inyección, así que si instantiate devolviera
    // directamente la función de clusterId, abrir/enfocar un mismo clúster dos veces solo
    // ejecutaría la primera — la segunda devolvería la promesa vieja sin hacer nada.
    return () => async (clusterId: string) => {
      try {
        await openTab({ tabId: clusterId });
      } catch (error) {
        // Ya está abierta en segundo plano (openTab lanza en ese caso): la traemos al
        // frente en vez de confiar en tabIsOpen, que en esta build responde "abierta"
        // solo mientras es la pestaña mostrada. Si falla por otra razón, queda en consola.
        console.error("[aureliak8s-image-inventory] openTab falló, se intenta focusTab", error);
        await focusTab({ tabId: clusterId });
      }
    };
  },
});
