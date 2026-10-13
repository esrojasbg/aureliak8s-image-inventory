import { getTableKind } from "@k8slens/table-contracts";
import type { ImageDetailPodRow } from "./image-detail";

export const imageDetailPodsTableKind = getTableKind<
  ImageDetailPodRow,
  [clusterId: string, registry: string, repository: string, tagDisplay: string]
>("aureliak8s-image-inventory-image-detail-pods");
