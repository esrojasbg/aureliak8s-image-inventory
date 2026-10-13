# Changelog

What changed in each version of this extension, newest first.

## 0.1.0

- Página de inventario de imágenes bajo cada clúster, con tabla de imagen/registro/tag/pods/namespaces y marcas (`latest`/sin tag, `docker.io`, tags múltiples).
- Detalle de una imagen (clic en una fila de esa tabla): registro, repositorio, tag, digest si corre por digest, `imagePullPolicy` e `imagePullSecrets` de los Pods que la usan, marcas explicadas, nodos, y una tabla de los Pods que la usan con enlace al detalle real de cada Pod.
- Sección «Imágenes» en el detalle de un Pod, por contenedor (incluye init y efímeros).
- Indicador en la barra de estado con cuántas imágenes del clúster activo usan `:latest` o no tienen tag.
