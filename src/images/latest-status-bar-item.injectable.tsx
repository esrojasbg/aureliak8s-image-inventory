import React, { Suspense, use } from "react";
import { observer } from "mobx-react";
import { getInjectable2 } from "@k8slens/injectable";
import { useInject, useSyncInject } from "@k8slens/use-inject";
import { clusterNameReactiveInjectionToken } from "@k8slens/cluster-contracts";
import { statusBarItemInjectionToken } from "@k8slens/status-bar-contracts";
import { useSubscribable } from "@k8slens/subscribable-react";
import { ContainerImagesIcon } from "./container-images-icon";
import { activeClusterIdComputedInjectable } from "./active-cluster-id-computed.injectable";
import { imageRowsForClusterInjectable } from "./image-rows-for-cluster.injectable";
import { openImageInventoryTabInjectable } from "./open-image-inventory-tab.injectable";

const LatestCountForCluster = observer(({ clusterId }: { clusterId: string }) => {
  const imageRowsForCluster = useInject(imageRowsForClusterInjectable);
  const openOrFocusImageInventoryTab = useInject(openImageInventoryTabInjectable)();
  const { value } = useSubscribable(imageRowsForCluster(clusterId));
  const rows = use(value).get();
  const count = rows.filter((row) => row.isLatestOrUntagged).length;
  const clusterName = use(useSyncInject(clusterNameReactiveInjectionToken, clusterId)).get();

  if (count === 0) {
    return null;
  }

  return (
    <span
      onClick={() => openOrFocusImageInventoryTab(clusterId)}
      title={`Imágenes con :latest o sin tag en ${clusterName}`}
      style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
    >
      <ContainerImagesIcon $size="s" />
      {count} :latest
    </span>
  );
});

const LatestCount = observer(() => {
  const getActiveClusterId = useInject(activeClusterIdComputedInjectable);
  const clusterId = getActiveClusterId().get();

  if (!clusterId) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LatestCountForCluster clusterId={clusterId} />
    </Suspense>
  );
});

export const latestImageCountStatusBarItemInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-latest-status-bar-item",
  instantiate: () => () => ({
    Component: LatestCount,
    position: "right" as const,
    orderNumber: 90,
  }),
  injectionToken: statusBarItemInjectionToken,
});
