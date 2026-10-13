import React from "react";
import { observer } from "mobx-react";
import { Badge } from "@k8slens/badge";
import { Button } from "@k8slens/element-components";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { useTabId } from "@k8slens/tab-contracts";
import { ColumnHeader } from "@k8slens/table-components";
import { getTableColumnInjectableBunch, type TableColumnCellProps } from "@k8slens/table-contracts";
import { useInject } from "@k8slens/use-inject";
import { imageDetailStateInjectable } from "./image-detail-state.injectable";
import type { ImageRow } from "./image-rows";
import { imagesTableKind } from "./images-table-kind";

type Props = TableColumnCellProps<ImageRow>;

const oneLine: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "block",
};

// La fila no es un recurso de Kubernetes: no hay navigateToKubeResourceDetailsInjectionToken para
// ella, así que cada celda se envuelve en un Button que abre el panel — nunca solo la primera columna.
const opensDetails = (Cell: React.ComponentType<Props>) =>
  observer(({ row }: Props) => {
    const clusterId = useTabId(mainViewTabHostKind);
    const state = useInject(imageDetailStateInjectable)(clusterId);
    const openRef = state.ref();
    const isOpen =
      openRef !== undefined &&
      openRef.registry === row.registry &&
      openRef.repository === row.repository &&
      openRef.tagDisplay === row.tagDisplay;

    return (
      <Button
        $width="full"
        $textAlign="left"
        $color={isOpen ? "textHighlight" : undefined}
        $style={{ height: "100%", minWidth: 0 }}
        $onClick={() => state.open({ registry: row.registry, repository: row.repository, tagDisplay: row.tagDisplay })}
      >
        <Cell row={row} />
      </Button>
    );
  });

const ImageCell = ({ row }: Props) => (
  <span style={oneLine} title={`${row.registry}/${row.repository}:${row.tagDisplay}`}>
    {row.repository}
  </span>
);
const ImageHeader = () => <ColumnHeader>Imagen</ColumnHeader>;

const RegistryCell = ({ row }: Props) => <span style={oneLine}>{row.registry}</span>;
const RegistryHeader = () => <ColumnHeader>Registro</ColumnHeader>;

const TagCell = ({ row }: Props) => <span style={oneLine}>{row.tagDisplay}</span>;
const TagHeader = () => <ColumnHeader>Tag</ColumnHeader>;

const PodsCell = ({ row }: Props) => <span style={oneLine}>{row.pods.length}</span>;
const PodsHeader = () => <ColumnHeader>Pods</ColumnHeader>;

const NamespacesCell = ({ row }: Props) => {
  const names =
    row.namespaces.length <= 3
      ? row.namespaces.join(", ")
      : `${row.namespaces.slice(0, 2).join(", ")}, +${row.namespaces.length - 2}`;

  return (
    <span style={oneLine} title={row.namespaces.join(", ")}>
      {row.namespaces.length} ({names})
    </span>
  );
};
const NamespacesHeader = () => <ColumnHeader>Namespaces</ColumnHeader>;

const FlagsCell = ({ row }: Props) => (
  <span style={{ ...oneLine, display: "flex", gap: 4 }}>
    {row.isLatestOrUntagged && <Badge small label="latest" title="Usa el tag latest o no tiene tag" />}
    {row.isDockerHub && <Badge small label="docker.io" title="Viene de Docker Hub" />}
    {row.hasMultipleTags && (
      <Badge small label="varios tags" title="El mismo repositorio aparece con más de un tag o digest" />
    )}
  </span>
);
const FlagsHeader = () => <ColumnHeader>Marcas</ColumnHeader>;

export const imageColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-image",
  kind: imagesTableKind,
  orderNumber: 10,
  Cell: opensDetails(ImageCell),
  Header: ImageHeader,
});

export const registryColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-registry",
  kind: imagesTableKind,
  orderNumber: 20,
  Cell: opensDetails(RegistryCell),
  Header: RegistryHeader,
});

export const tagColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-tag",
  kind: imagesTableKind,
  orderNumber: 30,
  Cell: opensDetails(TagCell),
  Header: TagHeader,
});

export const podsColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-pods",
  kind: imagesTableKind,
  orderNumber: 40,
  Cell: opensDetails(PodsCell),
  Header: PodsHeader,
});

export const namespacesColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-namespaces",
  kind: imagesTableKind,
  orderNumber: 50,
  Cell: opensDetails(NamespacesCell),
  Header: NamespacesHeader,
});

export const flagsColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-column-flags",
  kind: imagesTableKind,
  orderNumber: 60,
  Cell: opensDetails(FlagsCell),
  Header: FlagsHeader,
});
