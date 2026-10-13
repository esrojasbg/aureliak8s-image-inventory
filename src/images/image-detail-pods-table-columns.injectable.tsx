import React from "react";
import { ColumnHeader } from "@k8slens/table-components";
import { getTableColumnInjectableBunch, type TableColumnCellProps } from "@k8slens/table-contracts";
import { useInject } from "@k8slens/use-inject";
import type { ImageDetailPodRow } from "./image-detail";
import { imageDetailPodsTableKind } from "./image-detail-pods-table-kind";
import { openPodDetailsInjectable } from "./open-pod-details.injectable";

type Props = TableColumnCellProps<ImageDetailPodRow>;

const oneLine: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "block",
};

const PodLink = ({ row, children }: Props & { children: React.ReactNode }) => {
  const openPodDetails = useInject(openPodDetailsInjectable)();

  return (
    <span
      style={{ ...oneLine, cursor: "pointer" }}
      title={`${row.namespace}/${row.podName}`}
      onClick={() => openPodDetails(row.clusterId, row.namespace, row.podName)}
    >
      {children}
    </span>
  );
};

const PodCell = ({ row }: Props) => <PodLink row={row}>{row.podName}</PodLink>;
const PodHeader = () => <ColumnHeader>Pod</ColumnHeader>;

const NamespaceCell = ({ row }: Props) => <PodLink row={row}>{row.namespace}</PodLink>;
const NamespaceHeader = () => <ColumnHeader>Namespace</ColumnHeader>;

const ContainerCell = ({ row }: Props) => <PodLink row={row}>{row.containerName}</PodLink>;
const ContainerHeader = () => <ColumnHeader>Contenedor</ColumnHeader>;

const ControllerCell = ({ row }: Props) => <PodLink row={row}>{row.controller}</PodLink>;
const ControllerHeader = () => <ColumnHeader>Controlador</ColumnHeader>;

const StatusCell = ({ row }: Props) => <PodLink row={row}>{row.status}</PodLink>;
const StatusHeader = () => <ColumnHeader>Estado</ColumnHeader>;

export const podColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-image-detail-column-pod",
  kind: imageDetailPodsTableKind,
  orderNumber: 10,
  Cell: PodCell,
  Header: PodHeader,
});

export const namespaceColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-image-detail-column-namespace",
  kind: imageDetailPodsTableKind,
  orderNumber: 20,
  Cell: NamespaceCell,
  Header: NamespaceHeader,
});

export const containerColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-image-detail-column-container",
  kind: imageDetailPodsTableKind,
  orderNumber: 30,
  Cell: ContainerCell,
  Header: ContainerHeader,
});

export const controllerColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-image-detail-column-controller",
  kind: imageDetailPodsTableKind,
  orderNumber: 40,
  Cell: ControllerCell,
  Header: ControllerHeader,
});

export const statusColumnBunch = getTableColumnInjectableBunch({
  id: "aureliak8s-image-inventory-image-detail-column-status",
  kind: imageDetailPodsTableKind,
  orderNumber: 50,
  Cell: StatusCell,
  Header: StatusHeader,
});
