import React, { Component, Suspense, use, useEffect } from "react";
import { observer } from "mobx-react";
import { Button, Div, Span, type SvgProps } from "@k8slens/element-components";
import { copyToClipboardInjectionToken } from "@k8slens/electron-contracts";
import { CloseIcon, ContentCopyIcon, FilterAltIcon, OpenInBrowserIcon } from "@k8slens/icon";
import { Table } from "@k8slens/table-contracts";
import { useInject } from "@k8slens/use-inject";
import { useSubscribable } from "@k8slens/subscribable-react";
import { imageDetailForClusterInjectable } from "./image-detail-for-cluster.injectable";
import { imageDetailPodsTableKind } from "./image-detail-pods-table-kind";
import { imageDetailStateInjectable, type ImageDetailRef } from "./image-detail-state.injectable";
import { ImageDetailProperties } from "./image-detail-properties";
import { imageInventoryFiltersInjectable } from "./image-inventory-filters.injectable";
import { buildImageReference } from "./image-ref";
import { openImageDetailTabInjectable } from "./open-image-detail-tab.injectable";

const sectionPadding = { left: "s", right: "s" } as const;

class ImageDetailErrorBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Div $padding={{ top: "l" }}>
    <Div $font={{ size: "l", bold: true }} $color="textHighlight" $padding={{ ...sectionPadding, bottom: "s" }}>
      {title}
    </Div>
    <Div $padding={sectionPadding}>{children}</Div>
  </Div>
);

const IconAction = ({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon: (props: SvgProps) => React.ReactElement;
  onClick: () => void;
}) => (
  <Button $tooltip={label} aria-label={label} $interactive $flex={{ horizontalAlign: "center", verticalAlign: "center" }} $onClick={onClick}>
    <Icon $size="m" />
  </Button>
);

const DrawerFrame = ({ title, actions, children }: { title: string; actions: React.ReactNode; children: React.ReactNode }) => (
  <Div
    $size="full"
    $flex={{ direction: "vertical" }}
    $backgroundColor="backgroundPrimary"
    $border={{ left: { width: "xxs", color: "grey60" } }}
    $boxShadow="elevated"
  >
    <Div
      $flex={{ gap: "m", verticalAlign: "center", horizontalAlign: "space-between" }}
      $padding={{ horizontal: "s", vertical: "xs" }}
      $backgroundColor="backgroundSecondary"
      $border={{ bottom: { width: "xxs", color: "grey60" } }}
      $flexChild="fixed"
    >
      <Span $font={{ size: "m", bold: true }} $color="textHighlight" $overflow="hidden" $style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {title}
      </Span>
      <Div $flex={{ gap: "xs", verticalAlign: "center" }} $flexChild="fixed">
        {actions}
      </Div>
    </Div>
    {children}
  </Div>
);

const LoadedImageDetailDrawer = observer(
  ({ clusterId, imageRef, close }: { clusterId: string; imageRef: ImageDetailRef; close: () => void }) => {
    const { registry, repository, tagDisplay } = imageRef;
    const imageDetailForCluster = useInject(imageDetailForClusterInjectable);
    const { value } = useSubscribable(imageDetailForCluster(clusterId, registry, repository, tagDisplay));
    const detail = use(value).get();
    const copyToClipboard = useInject(copyToClipboardInjectionToken)();
    const filtersFor = useInject(imageInventoryFiltersInjectable);
    const openImageDetailTab = useInject(openImageDetailTabInjectable)();

    return (
      <DrawerFrame
        title={`Imagen: ${repository}:${tagDisplay}`}
        actions={
          <>
            <IconAction
              label="Copiar referencia"
              Icon={ContentCopyIcon}
              onClick={() => copyToClipboard(buildImageReference(registry, repository, tagDisplay))}
            />
            <IconAction
              label="Filtrar por esta imagen"
              Icon={FilterAltIcon}
              onClick={() => {
                filtersFor(clusterId).search = repository;
              }}
            />
            <IconAction
              label="Abrir en una pestaña"
              Icon={OpenInBrowserIcon}
              onClick={() => void openImageDetailTab(clusterId, registry, repository, tagDisplay)}
            />
            <IconAction label="Cerrar" Icon={CloseIcon} onClick={close} />
          </>
        }
      >
        <Div $flexChild={true} $overflow="auto" $padding={{ bottom: "l" }} $style={{ minHeight: 0 }}>
          <DetailSection title="Propiedades">
            <ImageDetailProperties detail={detail} />
          </DetailSection>
          <DetailSection title="Pods">
            {detail.row ? (
              <>
                <Div $padding={{ bottom: "xs" }}>
                  {detail.pods.length} Pods en {detail.nodeCount} {detail.nodeCount === 1 ? "nodo" : "nodos"}
                </Div>
                <Table kind={imageDetailPodsTableKind} params={[clusterId, registry, repository, tagDisplay]} />
              </>
            ) : (
              "Ya no hay Pods en este clúster que usen esta imagen."
            )}
          </DetailSection>
        </Div>
      </DrawerFrame>
    );
  },
);

const DrawerPlaceholder = ({ imageRef, close, children }: { imageRef: ImageDetailRef; close: () => void; children: React.ReactNode }) => (
  <DrawerFrame title={`Imagen: ${imageRef.repository}:${imageRef.tagDisplay}`} actions={<IconAction label="Cerrar" Icon={CloseIcon} onClick={close} />}>
    <Div $padding="s" $color="textMuted">
      {children}
    </Div>
  </DrawerFrame>
);

export const ImageDetailDrawer = ({ clusterId, imageRef, close }: { clusterId: string; imageRef: ImageDetailRef; close: () => void }) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <ImageDetailErrorBoundary fallback={<DrawerPlaceholder imageRef={imageRef} close={close}>No se pudo leer la imagen.</DrawerPlaceholder>}>
      <Suspense fallback={<DrawerPlaceholder imageRef={imageRef} close={close}>Cargando…</DrawerPlaceholder>}>
        <LoadedImageDetailDrawer clusterId={clusterId} imageRef={imageRef} close={close} />
      </Suspense>
    </ImageDetailErrorBoundary>
  );
};

export const ImageDetailOverlay = observer(({ clusterId }: { clusterId: string }) => {
  const imageDetailStateFor = useInject(imageDetailStateInjectable);
  const state = imageDetailStateFor(clusterId);
  const ref = state.ref();

  if (!ref) {
    return null;
  }

  return (
    <Div $style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(60%, 50rem)", zIndex: 1 }}>
      <ImageDetailDrawer key={JSON.stringify(ref)} clusterId={clusterId} imageRef={ref} close={state.close} />
    </Div>
  );
});
