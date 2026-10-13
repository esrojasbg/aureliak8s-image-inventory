import { getInjectable2 } from "@k8slens/injectable";
import { navigateToKubeResourceDetailsInjectionToken } from "@k8slens/details-panel-contracts";
import { coreV1, podKind } from "@k8slens/kubernetes-contracts";

export const openPodDetailsInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-open-pod-details",
  consumptions: [navigateToKubeResourceDetailsInjectionToken],
  instantiate: (di) => {
    const navigateToKubeResourceDetails = di.inject(navigateToKubeResourceDetailsInjectionToken)();

    // Fábrica (ver open-image-inventory-tab.injectable.ts): sin el () => extra, navegar al
    // mismo Pod una segunda vez devolvería la promesa ya resuelta de la primera, sin navegar.
    return () => (clusterId: string, namespace: string, name: string) =>
      navigateToKubeResourceDetails({ clusterId, kind: podKind, apiVersion: coreV1, ref: { namespace, name } });
  },
});
