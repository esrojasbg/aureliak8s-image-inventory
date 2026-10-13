import { getTabKind } from "@k8slens/tab-contracts";

export const imageDetailTabKind = getTabKind()("aureliak8s-image-inventory-image-detail");

export interface ImageDetailTabRef {
  readonly clusterId: string;
  readonly registry: string;
  readonly repository: string;
  readonly tagDisplay: string;
}

// JSON-encoded rather than joined with a separator: a registry with a port
// ("localhost:5000/foo") or any other punctuation in these fields would make a hand-picked
// separator ambiguous to split back apart. JSON.stringify of a fixed-order tuple is both
// exactly reversible and stable (the same ref always encodes to the same string).
export const buildImageDetailTabId = (ref: ImageDetailTabRef): string =>
  JSON.stringify([ref.clusterId, ref.registry, ref.repository, ref.tagDisplay]);

export const parseImageDetailTabId = (tabId: string): ImageDetailTabRef => {
  const [clusterId, registry, repository, tagDisplay] = JSON.parse(tabId) as [string, string, string, string];

  return { clusterId, registry, repository, tagDisplay };
};
