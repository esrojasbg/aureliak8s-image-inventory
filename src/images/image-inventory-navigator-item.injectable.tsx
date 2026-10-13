import React from "react";
import { computed } from "mobx";
import { clusterNavigatorItemKind } from "@k8slens/cluster-contracts";
import {
  getNavigatorItemKind,
  getNavigatorItemKindInjectableBunch2,
  type NavigatorItemRecord,
} from "@k8slens/navigator-contracts";
import { NavigatorItemIcon, NavigatorItemLabel, NavigatorLeafIndicator, navigatorItemIconSize } from "@k8slens/navigator-components";
import { ContainerImagesIcon } from "./container-images-icon";
import { openImageInventoryTabInjectable } from "./open-image-inventory-tab.injectable";

export const imageInventoryNavigatorItemKind = getNavigatorItemKind<NavigatorItemRecord, [clusterId: string]>()(
  "aureliak8s-image-inventory",
);

const ImageInventoryRow = ({ item }: { item: NavigatorItemRecord }) => (
  <>
    <NavigatorLeafIndicator />
    <NavigatorItemIcon>
      <ContainerImagesIcon $size={navigatorItemIconSize} />
    </NavigatorItemIcon>
    <NavigatorItemLabel>{item.name}</NavigatorItemLabel>
  </>
);

export default getNavigatorItemKindInjectableBunch2({
  kind: imageInventoryNavigatorItemKind,
  parentKind: clusterNavigatorItemKind,
  description: "La página de inventario de imágenes de un clúster.",
  items: {
    instantiate: () => async () => computed(() => [{ id: "aureliak8s-image-inventory", name: "Imágenes" }]),
  },
  activate: {
    instantiate: (di) => {
      const openOrFocusImageInventoryTab = di.inject(openImageInventoryTabInjectable)();

      return (clusterId: string) => openOrFocusImageInventoryTab(clusterId);
    },
  },
  Component: ImageInventoryRow,
});
