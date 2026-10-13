import type { PodV1 } from "@k8slens/kubernetes-contracts";
import { displayTag, parseImageRef } from "./image-ref";

export interface PodRef {
  readonly namespace: string;
  readonly name: string;
}

export interface ImageRow {
  readonly id: string;
  readonly registry: string;
  readonly repository: string;
  readonly tagDisplay: string;
  readonly pods: readonly PodRef[];
  readonly namespaces: readonly string[];
  readonly isLatestOrUntagged: boolean;
  readonly isDockerHub: boolean;
  readonly hasMultipleTags: boolean;
}

interface MutableRow {
  registry: string;
  repository: string;
  tagDisplay: string;
  isLatestOrUntagged: boolean;
  isDockerHub: boolean;
  pods: Map<string, PodRef>;
}

const containerImages = (pod: PodV1): string[] => {
  const containers = [
    ...pod.spec.containers,
    ...(pod.spec.initContainers ?? []),
    ...(pod.spec.ephemeralContainers ?? []),
  ];

  return containers
    .map((container) => container.image)
    .filter((image): image is string => Boolean(image));
};

export const buildImageRows = (pods: readonly PodV1[]): ImageRow[] => {
  const rows = new Map<string, MutableRow>();

  for (const pod of pods) {
    const podRef: PodRef = {
      namespace: pod.metadata.namespace ?? "",
      name: pod.metadata.name,
    };

    for (const image of containerImages(pod)) {
      const parsed = parseImageRef(image);
      const tagDisplay = displayTag(parsed);
      const rowId = `${parsed.registry}/${parsed.repository}:${tagDisplay}`;

      let row = rows.get(rowId);

      if (!row) {
        row = {
          registry: parsed.registry,
          repository: parsed.repository,
          tagDisplay,
          isLatestOrUntagged: parsed.isLatestOrUntagged,
          isDockerHub: parsed.isDockerHub,
          pods: new Map(),
        };
        rows.set(rowId, row);
      }

      row.pods.set(`${podRef.namespace}/${podRef.name}`, podRef);
    }
  }

  const tagsByRepository = new Map<string, Set<string>>();

  for (const row of rows.values()) {
    const repoKey = `${row.registry}/${row.repository}`;
    const tags = tagsByRepository.get(repoKey) ?? new Set<string>();

    tags.add(row.tagDisplay);
    tagsByRepository.set(repoKey, tags);
  }

  const imageRows = [...rows.entries()].map(([id, row]) => {
    const repoKey = `${row.registry}/${row.repository}`;
    const pods = [...row.pods.values()];

    return {
      id,
      registry: row.registry,
      repository: row.repository,
      tagDisplay: row.tagDisplay,
      pods,
      namespaces: [...new Set(pods.map((pod) => pod.namespace))].sort(),
      isLatestOrUntagged: row.isLatestOrUntagged,
      isDockerHub: row.isDockerHub,
      hasMultipleTags: (tagsByRepository.get(repoKey)?.size ?? 1) > 1,
    };
  });

  return imageRows.sort((a, b) => {
    const aFlagged = a.isLatestOrUntagged || a.isDockerHub || a.hasMultipleTags;
    const bFlagged = b.isLatestOrUntagged || b.isDockerHub || b.hasMultipleTags;

    if (aFlagged !== bFlagged) {
      return aFlagged ? -1 : 1;
    }

    if (a.pods.length !== b.pods.length) {
      return b.pods.length - a.pods.length;
    }

    return a.repository.localeCompare(b.repository) || a.registry.localeCompare(b.registry);
  });
};

export const filterImageRows = (
  rows: readonly ImageRow[],
  search: string,
  namespaces: readonly string[],
): ImageRow[] => {
  const needle = search.trim().toLowerCase();

  return rows.filter((row) => {
    if (namespaces.length > 0 && !row.namespaces.some((namespace) => namespaces.includes(namespace))) {
      return false;
    }

    if (!needle) {
      return true;
    }

    return (
      row.repository.toLowerCase().includes(needle) ||
      row.registry.toLowerCase().includes(needle) ||
      row.namespaces.some((namespace) => namespace.toLowerCase().includes(needle))
    );
  });
};
