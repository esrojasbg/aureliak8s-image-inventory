import { getInjectable2 } from "@k8slens/injectable";
import { action, observable } from "mobx";

export interface ImageDetailRef {
  readonly registry: string;
  readonly repository: string;
  readonly tagDisplay: string;
}

export interface ImageDetailState {
  readonly ref: () => ImageDetailRef | undefined;
  readonly open: (ref: ImageDetailRef) => void;
  readonly close: () => void;
}

export const imageDetailStateInjectable = getInjectable2({
  id: "aureliak8s-image-inventory-image-detail-state-for-cluster",
  instantiate: () => {
    const stateByClusterId = new Map<string, ImageDetailState>();

    return (clusterId: string): ImageDetailState => {
      const existing = stateByClusterId.get(clusterId);

      if (existing) {
        return existing;
      }

      const openRef = observable.box<ImageDetailRef | undefined>(undefined);

      const created: ImageDetailState = {
        ref: () => openRef.get(),
        open: action((ref: ImageDetailRef) => openRef.set(ref)),
        close: action(() => openRef.set(undefined)),
      };

      stateByClusterId.set(clusterId, created);

      return created;
    };
  },
});
