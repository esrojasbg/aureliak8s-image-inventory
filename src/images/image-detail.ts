import type { PodV1 } from "@k8slens/kubernetes-contracts";
import { displayTag, parseImageRef } from "./image-ref";
import { buildImageRows, type ImageRow } from "./image-rows";

export interface ImageDetailPodRow {
  readonly id: string;
  readonly clusterId: string;
  readonly namespace: string;
  readonly podName: string;
  readonly containerName: string;
  readonly controller: string;
  readonly status: string;
  readonly imagePullPolicy: string;
  readonly imagePullSecrets: readonly string[];
  readonly nodeName?: string;
}

export interface ImageDetail {
  readonly row: ImageRow | undefined;
  readonly digest: string | undefined;
  readonly nodeCount: number;
  readonly imagePullPolicies: readonly string[];
  readonly imagePullSecrets: readonly string[];
  readonly pods: readonly ImageDetailPodRow[];
}

const controllerLabel = (pod: PodV1): string => {
  const owner = pod.metadata.ownerReferences?.[0];

  return owner ? `${owner.kind}/${owner.name}` : "—";
};

const podStatusLabel = (pod: PodV1): string => pod.status?.phase ?? "Desconocido";

const extractDigest = (imageID: string): string | undefined => {
  const atIndex = imageID.indexOf("@");
  const candidate = atIndex === -1 ? imageID : imageID.slice(atIndex + 1);

  return candidate.startsWith("sha256:") ? candidate : undefined;
};

const matchesImage = (image: string, registry: string, repository: string, tagDisplay: string): boolean => {
  const parsed = parseImageRef(image);

  return parsed.registry === registry && parsed.repository === repository && displayTag(parsed) === tagDisplay;
};

export const buildImageDetail = (
  pods: readonly PodV1[],
  clusterId: string,
  registry: string,
  repository: string,
  tagDisplay: string,
): ImageDetail => {
  const row = buildImageRows(pods).find((candidate) => candidate.id === `${registry}/${repository}:${tagDisplay}`);
  const podRows: ImageDetailPodRow[] = [];
  let digest: string | undefined;

  for (const pod of pods) {
    const containers = [
      ...pod.spec.containers,
      ...(pod.spec.initContainers ?? []),
      ...(pod.spec.ephemeralContainers ?? []),
    ];
    const statuses = [
      ...(pod.status?.containerStatuses ?? []),
      ...(pod.status?.initContainerStatuses ?? []),
      ...(pod.status?.ephemeralContainerStatuses ?? []),
    ];

    for (const container of containers) {
      if (!container.image || !matchesImage(container.image, registry, repository, tagDisplay)) {
        continue;
      }

      if (!digest) {
        const imageId = statuses.find((status) => status.name === container.name)?.imageID;

        digest = imageId ? extractDigest(imageId) : undefined;
      }

      podRows.push({
        id: `${pod.metadata.namespace ?? ""}/${pod.metadata.name}/${container.name}`,
        clusterId,
        namespace: pod.metadata.namespace ?? "",
        podName: pod.metadata.name,
        containerName: container.name,
        controller: controllerLabel(pod),
        status: podStatusLabel(pod),
        imagePullPolicy: container.imagePullPolicy ?? "—",
        imagePullSecrets: (pod.spec.imagePullSecrets ?? [])
          .map((secret) => secret.name)
          .filter((name): name is string => Boolean(name)),
        nodeName: pod.spec.nodeName,
      });
    }
  }

  podRows.sort(
    (a, b) =>
      a.namespace.localeCompare(b.namespace) ||
      a.podName.localeCompare(b.podName) ||
      a.containerName.localeCompare(b.containerName),
  );

  const nodeCount = new Set(podRows.map((pod) => pod.nodeName).filter((name): name is string => Boolean(name))).size;

  const imagePullPolicies = [...new Set(podRows.map((pod) => pod.imagePullPolicy))].sort();
  const imagePullSecrets = [...new Set(podRows.flatMap((pod) => pod.imagePullSecrets))].sort();

  return { row, digest, nodeCount, imagePullPolicies, imagePullSecrets, pods: podRows };
};
