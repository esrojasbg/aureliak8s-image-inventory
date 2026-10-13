import { getInjectable2 } from "@k8slens/injectable";
import { observable } from "mobx";

export interface ImageInventoryFilters {
  search: string;
  namespaces: string[];
}

export const imageInventoryFiltersInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-filters-for-cluster",
  instantiate: () => {
    const filtersByClusterId = new Map<string, ImageInventoryFilters>();

    return (clusterId: string): ImageInventoryFilters => {
      const existing = filtersByClusterId.get(clusterId);

      if (existing) {
        return existing;
      }

      const created = observable<ImageInventoryFilters>({ search: "", namespaces: [] });

      filtersByClusterId.set(clusterId, created);

      return created;
    };
  },
});
