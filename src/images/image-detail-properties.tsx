import React from "react";
import { Badge } from "@k8slens/badge";
import { Div } from "@k8slens/element-components";
import { DrawerItem } from "@k8slens/details-panel-components";
import type { ImageDetail } from "./image-detail";

const flagExplanations: {
  readonly check: (row: { isLatestOrUntagged: boolean; isDockerHub: boolean; hasMultipleTags: boolean }) => boolean;
  readonly label: string;
  readonly explanation: string;
}[] = [
  {
    check: (row) => row.isLatestOrUntagged,
    label: "latest",
    explanation: "Usa el tag latest (explícito o implícito) o no tiene tag: ninguno fija una versión concreta.",
  },
  {
    check: (row) => row.isDockerHub,
    label: "docker.io",
    explanation: "Viene de Docker Hub, indicado explícitamente o por ser el registro por defecto.",
  },
  {
    check: (row) => row.hasMultipleTags,
    label: "varios tags",
    explanation: "El mismo repositorio aparece en el clúster con más de un tag o digest distinto.",
  },
];

export const ImageDetailProperties = ({ detail }: { detail: ImageDetail }) => {
  if (!detail.row) {
    return <Div $padding={{ top: "s", bottom: "s" }}>Ya no hay Pods en este clúster que usen esta imagen.</Div>;
  }

  const { row } = detail;
  const flags = flagExplanations.filter((flag) => flag.check(row));

  return (
    <Div $flex={{ direction: "vertical", gap: "s" }}>
      <DrawerItem name="Registro">{row.registry}</DrawerItem>
      <DrawerItem name="Repositorio">{row.repository}</DrawerItem>
      <DrawerItem name="Tag">{row.tagDisplay}</DrawerItem>
      {detail.digest && <DrawerItem name="Digest">{detail.digest}</DrawerItem>}
      <DrawerItem name="imagePullPolicy">{detail.imagePullPolicies.join(", ") || "—"}</DrawerItem>
      <DrawerItem name="imagePullSecrets">
        {detail.imagePullSecrets.length === 0 ? "Ninguno" : detail.imagePullSecrets.join(", ")}
      </DrawerItem>
      <DrawerItem name="Marcas">
        {flags.length === 0 ? (
          "Ninguna"
        ) : (
          <Div $flex={{ direction: "vertical", gap: "xxs" }}>
            {flags.map((flag) => (
              <div key={flag.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Badge small label={flag.label} />
                <span>{flag.explanation}</span>
              </div>
            ))}
          </Div>
        )}
      </DrawerItem>
      <DrawerItem name="Nodos">{detail.nodeCount}</DrawerItem>
    </Div>
  );
};
