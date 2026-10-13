import { getInjectable2 } from "@k8slens/injectable";
import { coreV1, kubeResourcesInjectionToken, podKind } from "@k8slens/kubernetes-contracts";
import type { Subscribable } from "@k8slens/subscribable";
import { derivedSubscribable } from "@k8slens/subscribable";
import { buildImageRows, type ImageRow } from "./image-rows";

export const imageRowsForClusterInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-image-rows-for-cluster",
  consumptions: [kubeResourcesInjectionToken],
  instantiate: (di) => {
    const kubeResources = di.inject(kubeResourcesInjectionToken)();
    const subscribablesByClusterId = new Map<string, Subscribable<ImageRow[]>>();

    return (clusterId: string) => {
      const existing = subscribablesByClusterId.get(clusterId);

      if (existing) {
        return existing;
      }

      const created = derivedSubscribable(kubeResources(podKind, coreV1, clusterId), buildImageRows);

      subscribablesByClusterId.set(clusterId, created);

      return created;
    };
  },
});
