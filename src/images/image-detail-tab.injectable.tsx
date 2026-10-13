import React, { Suspense, use } from "react";
import { observer } from "mobx-react";
import { Badge } from "@k8slens/badge";
import { Div } from "@k8slens/element-components";
import { DrawerItem } from "@k8slens/details-panel-components";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { getTabKindInjectableBunch, useTabId, type TabProps } from "@k8slens/tab-contracts";
import { Table } from "@k8slens/table-contracts";
import { useInject } from "@k8slens/use-inject";
import { useSubscribable } from "@k8slens/subscribable-react";
import { imageDetailForClusterInjectable } from "./image-detail-for-cluster.injectable";
import { imageDetailTabKind, parseImageDetailTabId } from "./image-detail-tab-kind";
import { imageDetailPodsTableKind } from "./image-detail-pods-table-kind";

const pagePadding = { left: "m", right: "m" } as const;

const flagExplanations: { readonly check: (detail: { isLatestOrUntagged: boolean; isDockerHub: boolean; hasMultipleTags: boolean }) => boolean; readonly label: string; readonly explanation: string }[] = [
  {
    check: (row) => row.isLatestOrUntagged,
    label: "latest",
    explanation: "Usa el tag latest (explícito o implícito) o no tiene tag: ninguno fija una versión concreta.",
  },
  {
    check: (row) => row.isDockerHub,
    label: "docker.io",
    explanation: "Viene de Docker Hub, indicado explícitamente o por ser el registro por defecto.",
  },
  {
    check: (row) => row.hasMultipleTags,
    label: "varios tags",
    explanation: "El mismo repositorio aparece en el clúster con más de un tag o digest distinto.",
  },
];

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

    const { row } = detail;
    const flags = flagExplanations.filter((flag) => flag.check(row));

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Div $padding={{ ...pagePadding, top: "s", bottom: "s" }} $flex={{ direction: "vertical", gap: "s" }}>
          <DrawerItem name="Registro">{row.registry}</DrawerItem>
          <DrawerItem name="Repositorio">{row.repository}</DrawerItem>
          <DrawerItem name="Tag">{row.tagDisplay}</DrawerItem>
          {detail.digest && <DrawerItem name="Digest">{detail.digest}</DrawerItem>}
          <DrawerItem name="imagePullPolicy">{detail.imagePullPolicies.join(", ") || "—"}</DrawerItem>
          <DrawerItem name="imagePullSecrets">
            {detail.imagePullSecrets.length === 0 ? "Ninguno" : detail.imagePullSecrets.join(", ")}
          </DrawerItem>
          <DrawerItem name="Marcas">
            {flags.length === 0 ? (
              "Ninguna"
            ) : (
              <Div $flex={{ direction: "vertical", gap: "xxs" }}>
                {flags.map((flag) => (
                  <div key={flag.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Badge small label={flag.label} />
                    <span>{flag.explanation}</span>
                  </div>
                ))}
              </Div>
            )}
          </DrawerItem>
          <DrawerItem name="Nodos">{detail.nodeCount}</DrawerItem>
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
