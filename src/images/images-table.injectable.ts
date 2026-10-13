import { getTableInjectableBunch } from "@k8slens/table-contracts";
import { derivedSubscribable, type Subscribable } from "@k8slens/subscribable";
import { imageInventoryFiltersInjectable } from "./image-inventory-filters.injectable";
import { imageRowsForClusterInjectable } from "./image-rows-for-cluster.injectable";
import { filterImageRows, type ImageRow } from "./image-rows";
import { imagesTableKind } from "./images-table-kind";

export default getTableInjectableBunch({
  kind: imagesTableKind,
  getRowId: (row) => row.id,
  data: {
    instantiate: (di) => {
      const imageRowsForCluster = di.inject(imageRowsForClusterInjectable);
      const filtersForCluster = di.inject(imageInventoryFiltersInjectable);
      const filteredRowsByClusterId = new Map<string, Subscribable<ImageRow[]>>();

      return (clusterId) => {
        const existing = filteredRowsByClusterId.get(clusterId);

        if (existing) {
          return existing;
        }

        const filters = filtersForCluster(clusterId);
        const created = derivedSubscribable(imageRowsForCluster(clusterId), (rows) =>
          filterImageRows(rows, filters.search, filters.namespaces),
        );

        filteredRowsByClusterId.set(clusterId, created);

        return created;
      };
    },
  },
});
