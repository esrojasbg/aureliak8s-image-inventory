import { getTableInjectableBunch } from "@k8slens/table-contracts";
import { derivedSubscribable } from "@k8slens/subscribable";
import { imageDetailForClusterInjectable } from "./image-detail-for-cluster.injectable";
import { imageDetailPodsTableKind } from "./image-detail-pods-table-kind";

export default getTableInjectableBunch({
  kind: imageDetailPodsTableKind,
  getRowId: (row) => row.id,
  data: {
    instantiate: (di) => {
      const imageDetailForCluster = di.inject(imageDetailForClusterInjectable);

      return (clusterId, registry, repository, tagDisplay) =>
        derivedSubscribable(imageDetailForCluster(clusterId, registry, repository, tagDisplay), (detail) => detail.pods);
    },
  },
});
