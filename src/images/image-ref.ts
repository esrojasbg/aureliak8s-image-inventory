export interface ParsedImageRef {
  readonly raw: string;
  readonly registry: string;
  readonly repository: string;
  readonly tag?: string;
  readonly digest?: string;
  readonly isLatestOrUntagged: boolean;
  readonly isDockerHub: boolean;
}

const looksLikeRegistry = (segment: string) =>
  segment === "localhost" || segment.includes(".") || segment.includes(":");

export const parseImageRef = (raw: string): ParsedImageRef => {
  const atIndex = raw.indexOf("@");
  const digest = atIndex === -1 ? undefined : raw.slice(atIndex + 1);
  const base = atIndex === -1 ? raw : raw.slice(0, atIndex);

  const segments = base.split("/");
  const firstIsRegistry = segments.length > 1 && looksLikeRegistry(segments[0]);
  const registry = firstIsRegistry ? segments[0] : "docker.io";
  const repositoryPath = firstIsRegistry ? segments.slice(1).join("/") : base;

  const lastSlash = repositoryPath.lastIndexOf("/");
  const lastSegment = lastSlash === -1 ? repositoryPath : repositoryPath.slice(lastSlash + 1);
  const colonInLastSegment = lastSegment.lastIndexOf(":");

  const tag = colonInLastSegment === -1 ? undefined : lastSegment.slice(colonInLastSegment + 1);
  const repository =
    colonInLastSegment === -1
      ? repositoryPath
      : repositoryPath.slice(0, repositoryPath.length - lastSegment.length) +
        lastSegment.slice(0, colonInLastSegment);

  const isLatestOrUntagged = tag === "latest" || (tag === undefined && digest === undefined);

  return {
    raw,
    registry,
    repository,
    tag,
    digest,
    isLatestOrUntagged,
    isDockerHub: registry === "docker.io",
  };
};

export const displayTag = (parsed: ParsedImageRef): string => {
  if (parsed.tag) {
    return parsed.tag;
  }

  if (parsed.digest) {
    return "sin tag";
  }

  return "latest";
};
