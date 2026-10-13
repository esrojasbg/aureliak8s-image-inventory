import React, { Suspense, use } from "react";
import { observer } from "mobx-react";
import { Div } from "@k8slens/element-components";
import { PlainButton, TextInput, MultiSelect } from "@k8slens/input-components";
import { clusterNameReactiveInjectionToken } from "@k8slens/cluster-contracts";
import { useInject, useSyncInject } from "@k8slens/use-inject";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { getTabKindInjectableBunch, useTabId, type TabProps } from "@k8slens/tab-contracts";
import { Table } from "@k8slens/table-contracts";
import { useSubscribable } from "@k8slens/subscribable-react";
import { ImageDetailOverlay } from "./image-detail-drawer";
import { imageInventoryFiltersInjectable } from "./image-inventory-filters.injectable";
import { imageRowsForClusterInjectable } from "./image-rows-for-cluster.injectable";
import { imageInventoryTabKind } from "./image-inventory-tab-kind";
import { imagesTableKind } from "./images-table-kind";

const pagePadding = { left: "m", right: "m" } as const;

const ImageInventorySummary = observer(({ clusterId }: { clusterId: string }) => {
  const imageRowsForCluster = useInject(imageRowsForClusterInjectable);
  const filtersForCluster = useInject(imageInventoryFiltersInjectable);
  const filters = filtersForCluster(clusterId);
  const { value } = useSubscribable(imageRowsForCluster(clusterId));
  const rows = use(value).get();

  const latestOrUntagged = rows.filter((row) => row.isLatestOrUntagged).length;
  const dockerHub = rows.filter((row) => row.isDockerHub).length;
  const multipleTags = rows.filter((row) => row.hasMultipleTags).length;
  const allNamespaces = [...new Set(rows.flatMap((row) => row.namespaces))].sort();

  const toggleNamespace = (namespace: string) => {
    filters.namespaces = filters.namespaces.includes(namespace)
      ? filters.namespaces.filter((selected) => selected !== namespace)
      : [...filters.namespaces, namespace];
  };

  const clearFilters = () => {
    filters.search = "";
    filters.namespaces = [];
  };

  const hasActiveFilters = filters.search.length > 0 || filters.namespaces.length > 0;

  return (
    <Div $padding={{ ...pagePadding, top: "s", bottom: "s" }} $flex={{ direction: "vertical", gap: "s" }}>
      <div>
        {rows.length} imágenes · {latestOrUntagged} con :latest o sin tag · {dockerHub} de docker.io · {multipleTags} con
        tags distintos
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 280 }}>
          <TextInput
            type="search"
            placeholder="Buscar por imagen, registro o namespace…"
            value={filters.search}
            onChange={(event) => {
              filters.search = event.target.value;
            }}
          />
        </div>
        <PlainButton
          $popover={() => (
            <MultiSelect
              options={allNamespaces.map((namespace) => ({ id: namespace, label: namespace }))}
              selected={filters.namespaces}
              onToggle={toggleNamespace}
              $backgroundColor="backgroundPrimary"
              $border={{ color: "borderPrimary", width: "xxs", radius: "ml" }}
              $boxShadow="elevated"
              $padding="xs"
              $overflow={{ y: "auto" }}
              $style={{ minWidth: 220, maxHeight: 280 }}
            />
          )}
        >
          Namespaces{filters.namespaces.length > 0 ? ` (${filters.namespaces.length})` : ""}
        </PlainButton>
        {hasActiveFilters && <PlainButton $onClick={clearFilters}>Limpiar filtros</PlainButton>}
      </div>
    </Div>
  );
});

const ImageInventoryPage = (_props: TabProps<typeof mainViewTabHostKind>) => {
  const clusterId = useTabId(mainViewTabHostKind);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <Suspense fallback={<Div $padding={{ ...pagePadding, top: "s", bottom: "s" }}>Calculando el resumen de imágenes…</Div>}>
        <ImageInventorySummary clusterId={clusterId} />
      </Suspense>
      <Div $padding={{ ...pagePadding, bottom: "m" }} $flexChild="shrinkable">
        <Table kind={imagesTableKind} params={[clusterId]} />
      </Div>
      <ImageDetailOverlay clusterId={clusterId} />
    </div>
  );
};

const ImageInventoryTitleForCluster = observer(({ clusterId }: { clusterId: string }) => {
  const name = use(useSyncInject(clusterNameReactiveInjectionToken, clusterId)).get();

  return <span>Imágenes · {name}</span>;
});

const ImageInventoryTabTitle = (_props: TabProps<typeof mainViewTabHostKind>) => {
  const clusterId = useTabId(mainViewTabHostKind);

  return (
    <Suspense fallback={<span>Imágenes</span>}>
      <ImageInventoryTitleForCluster clusterId={clusterId} />
    </Suspense>
  );
};

export const imageInventoryTabBunch = getTabKindInjectableBunch({
  tabHostKind: mainViewTabHostKind,
  kind: imageInventoryTabKind,
  Component: ImageInventoryPage,
  Title: ImageInventoryTabTitle,
});

export default imageInventoryTabBunch;
