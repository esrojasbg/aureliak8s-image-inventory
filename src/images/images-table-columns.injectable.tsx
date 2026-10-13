import React from "react";
import { Badge } from "@k8slens/badge";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { useTabId } from "@k8slens/tab-contracts";
import { ColumnHeader } from "@k8slens/table-components";
import { getTableColumnInjectableBunch, type TableColumnCellProps } from "@k8slens/table-contracts";
import { useInject } from "@k8slens/use-inject";
import type { ImageRow } from "./image-rows";
import { imagesTableKind } from "./images-table-kind";
import { openImageDetailTabInjectable } from "./open-image-detail-tab.injectable";

type Props = TableColumnCellProps<ImageRow>;

const oneLine: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "block",
};

const ImageLink = ({ row, title, children }: Props & { title?: string; children: React.ReactNode }) => {
  const openImageDetail = useInject(openImageDetailTabInjectable)();
  const clusterId = useTabId(mainViewTabHostKind);

  return (
    <span
      style={{ ...oneLine, cursor: "pointer" }}
      title={title}
      onClick={() => openImageDetail(clusterId, row.registry, row.repository, row.tagDisplay)}
    >
      {children}
    </span>
  );
};

const ImageCell = ({ row }: Props) => (
  <ImageLink row={row} title={`${row.registry}/${row.repository}:${row.tagDisplay}`}>
    {row.repository}
  </ImageLink>
);
const ImageHeader = () => <ColumnHeader>Imagen</ColumnHeader>;

const RegistryCell = ({ row }: Props) => <ImageLink row={row}>{row.registry}</ImageLink>;
const RegistryHeader = () => <ColumnHeader>Registro</ColumnHeader>;

const TagCell = ({ row }: Props) => <ImageLink row={row}>{row.tagDisplay}</ImageLink>;
const TagHeader = () => <ColumnHeader>Tag</ColumnHeader>;

const PodsCell = ({ row }: Props) => <ImageLink row={row}>{row.pods.length}</ImageLink>;
const PodsHeader = () => <ColumnHeader>Pods</ColumnHeader>;

const NamespacesCell = ({ row }: Props) => {
  const names =
    row.namespaces.length <= 3
      ? row.namespaces.join(", ")
      : `${row.namespaces.slice(0, 2).join(", ")}, +${row.namespaces.length - 2}`;

  return (
    <ImageLink row={row} title={row.namespaces.join(", ")}>
      {row.namespaces.length} ({names})
    </ImageLink>
  );
};
const NamespacesHeader = () => <ColumnHeader>Namespaces</ColumnHeader>;

const FlagsCell = ({ row }: Props) => {
  const openImageDetail = useInject(openImageDetailTabInjectable)();
  const clusterId = useTabId(mainViewTabHostKind);

  return (
    <span
      style={{ ...oneLine, display: "flex", gap: 4, cursor: "pointer" }}
      onClick={() => openImageDetail(clusterId, row.registry, row.repository, row.tagDisplay)}
    >
      {row.isLatestOrUntagged && <Badge small label="latest" title="Usa el tag latest o no tiene tag" />}
      {row.isDockerHub && <Badge small label="docker.io" title="Viene de Docker Hub" />}
      {row.hasMultipleTags && (
        <Badge small label="varios tags" title="El mismo repositorio aparece con más de un tag o digest" />
      )}
    </span>
  );
};
const FlagsHeader = () => <ColumnHeader>Marcas</ColumnHeader>;

export const imageColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-image",
  kind: imagesTableKind,
  orderNumber: 10,
  Cell: ImageCell,
  Header: ImageHeader,
});

export const registryColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-registry",
  kind: imagesTableKind,
  orderNumber: 20,
  Cell: RegistryCell,
  Header: RegistryHeader,
});

export const tagColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-tag",
  kind: imagesTableKind,
  orderNumber: 30,
  Cell: TagCell,
  Header: TagHeader,
});

export const podsColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-pods",
  kind: imagesTableKind,
  orderNumber: 40,
  Cell: PodsCell,
  Header: PodsHeader,
});

export const namespacesColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-namespaces",
  kind: imagesTableKind,
  orderNumber: 50,
  Cell: NamespacesCell,
  Header: NamespacesHeader,
});

export const flagsColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-flags",
  kind: imagesTableKind,
  orderNumber: 60,
  Cell: FlagsCell,
  Header: FlagsHeader,
});
