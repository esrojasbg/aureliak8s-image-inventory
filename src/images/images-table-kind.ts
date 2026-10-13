import { getTableKind } from "@k8slens/table-contracts";
import type { ImageRow } from "./image-rows";

export const imagesTableKind = getTableKind<ImageRow, [clusterId: string]>("aureliak8s-image-inventory-images");
