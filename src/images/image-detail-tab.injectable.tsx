import React, { Suspense, use } from "react";
import { observer } from "mobx-react";
import { Div } from "@k8slens/element-components";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { getTabKindInjectableBunch, useTabId, type TabProps } from "@k8slens/tab-contracts";
import { Table } from "@k8slens/table-contracts";
import { useInject } from "@k8slens/use-inject";
import { useSubscribable } from "@k8slens/subscribable-react";
import { imageDetailForClusterInjectable } from "./image-detail-for-cluster.injectable";
import { imageDetailTabKind, parseImageDetailTabId } from "./image-detail-tab-kind";
import { imageDetailPodsTableKind } from "./image-detail-pods-table-kind";
import { ImageDetailProperties } from "./image-detail-properties";

const pagePadding = { left: "m", right: "m" } as const;

const ImageDetailContent = observer(
  ({ clusterId, registry, repository, tagDisplay }: { clusterId: string; registry: string; repository: string; tagDisplay: string }) => {
    const imageDetailForCluster = useInject(imageDetailForClusterInjectable);
    const { value } = useSubscribable(imageDetailForCluster(clusterId, registry, repository, tagDisplay));
    const detail = use(value).get();

    if (!detail.row) {
      return (
        <Div $padding={{ ...pagePadding, top: "s", bottom: "s" }}>Ya no hay Pods en este clúster que usen esta imagen.</Div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Div $padding={{ ...pagePadding, top: "s", bottom: "s" }}>
          <ImageDetailProperties detail={detail} />
        </Div>
        <Div $padding={{ ...pagePadding, bottom: "m" }} $flexChild="shrinkable">
          <Div $padding={{ bottom: "xs" }}>
            {detail.pods.length} Pods en {detail.nodeCount} {detail.nodeCount === 1 ? "nodo" : "nodos"}
          </Div>
          <Table kind={imageDetailPodsTableKind} params={[clusterId, registry, repository, tagDisplay]} />
        </Div>
      </div>
    );
  },
);

const ImageDetailPage = (_props: TabProps<typeof mainViewTabHostKind>) => {
  const tabId = useTabId(mainViewTabHostKind);
  const { clusterId, registry, repository, tagDisplay } = parseImageDetailTabId(tabId);

  return (
    <Suspense fallback={<Div $padding={{ ...pagePadding, top: "s", bottom: "s" }}>Cargando…</Div>}>
      <ImageDetailContent clusterId={clusterId} registry={registry} repository={repository} tagDisplay={tagDisplay} />
    </Suspense>
  );
};

const ImageDetailTitle = (_props: TabProps<typeof mainViewTabHostKind>) => {
  const tabId = useTabId(mainViewTabHostKind);
  const { repository, tagDisplay } = parseImageDetailTabId(tabId);

  return (
    <span>
      Imagen · {repository}:{tagDisplay}
    </span>
  );
};

export const imageDetailTabBunch = getTabKindInjectableBunch({
  tabHostKind: mainViewTabHostKind,
  kind: imageDetailTabKind,
  Component: ImageDetailPage,
  Title: ImageDetailTitle,
});

export default imageDetailTabBunch;
