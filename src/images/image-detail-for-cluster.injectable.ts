import { getInjectable2 } from "@k8slens/injectable";
import { coreV1, kubeResourcesInjectionToken, podKind } from "@k8slens/kubernetes-contracts";
import type { Subscribable } from "@k8slens/subscribable";
import { derivedSubscribable } from "@k8slens/subscribable";
import { buildImageDetail, type ImageDetail } from "./image-detail";

export const imageDetailForClusterInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-image-detail-for-cluster",
  consumptions: [kubeResourcesInjectionToken],
  instantiate: (di) => {
    const kubeResources = di.inject(kubeResourcesInjectionToken)();
    const subscribablesByKey = new Map<string, Subscribable<ImageDetail>>();

    return (clusterId: string, registry: string, repository: string, tagDisplay: string) => {
      const key = [clusterId, registry, repository, tagDisplay].join("/");
      const existing = subscribablesByKey.get(key);

      if (existing) {
        return existing;
      }

      const created = derivedSubscribable(kubeResources(podKind, coreV1, clusterId), (pods) =>
        buildImageDetail(pods, clusterId, registry, repository, tagDisplay),
      );

      subscribablesByKey.set(key, created);

      return created;
    };
  },
});
