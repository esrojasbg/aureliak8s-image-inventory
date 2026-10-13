import { getInjectable2 } from "@k8slens/injectable";
import { activeTabClusterIdReactiveInjectionToken } from "@k8slens/main-view-contracts";

export const activeClusterIdComputedInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-active-cluster-id-computed",
  consumptions: [activeTabClusterIdReactiveInjectionToken],
  instantiate: (di) => {
    const activeClusterId = di.inject(activeTabClusterIdReactiveInjectionToken)();

    return () => activeClusterId;
  },
});
