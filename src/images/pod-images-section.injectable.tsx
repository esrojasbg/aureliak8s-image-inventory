import React from "react";
import { Badge } from "@k8slens/badge";
import { DrawerItem, DrawerSubTitle } from "@k8slens/details-panel-components";
import { buildDetailsPanelSectionBunch, type DetailsPanelSectionProps } from "@k8slens/details-panel-contracts";
import { coreV1, podKind, type V1Container, type V1EphemeralContainer } from "@k8slens/kubernetes-contracts";
import { displayTag, parseImageRef } from "./image-ref";

interface ContainerEntry {
  readonly name: string;
  readonly image?: string;
  readonly suffix?: string;
}

const containerEntries = (
  containers: readonly V1Container[],
  initContainers: readonly V1Container[] | undefined,
  ephemeralContainers: readonly V1EphemeralContainer[] | undefined,
): ContainerEntry[] => [
  ...(initContainers ?? []).map((container) => ({ name: container.name, image: container.image, suffix: " (init)" })),
  ...containers.map((container) => ({ name: container.name, image: container.image })),
  ...(ephemeralContainers ?? []).map((container) => ({
    name: container.name,
    image: container.image,
    suffix: " (efímero)",
  })),
];

const PodImages = ({ resource }: DetailsPanelSectionProps<typeof podKind, typeof coreV1>) => {
  const entries = containerEntries(resource.spec.containers, resource.spec.initContainers, resource.spec.ephemeralContainers);

  return (
    <>
      {entries.map((entry) => {
        if (!entry.image) {
          return null;
        }

        const parsed = parseImageRef(entry.image);

        return (
          <React.Fragment key={entry.name}>
            <DrawerSubTitle>
              {entry.name}
              {entry.suffix}
            </DrawerSubTitle>
            <DrawerItem name="Registro">{parsed.registry}</DrawerItem>
            <DrawerItem name="Tag">{displayTag(parsed)}</DrawerItem>
            <DrawerItem name="Marcas">
              {parsed.isLatestOrUntagged && <Badge small label="latest" title="Usa el tag latest o no tiene tag" />}
              {parsed.isDockerHub && <Badge small label="docker.io" title="Viene de Docker Hub" />}
            </DrawerItem>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default buildDetailsPanelSectionBunch({
  id: "aureliak8s-image-inventory-pod-images",
  kind: podKind,
  apiVersion: coreV1,
  title: "Imágenes",
  Component: PodImages,
});
