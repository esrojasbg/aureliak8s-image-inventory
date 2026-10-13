# Changelog

What changed in each version of this extension, newest first.

## 0.1.1

- El detalle de una imagen ya no abre una pestaña nueva: se abre en un panel lateral sobre la propia tabla de inventario, como en la extensión Docker de Lens. Cualquier columna de la fila lo abre; la fila abierta se resalta.
- El panel tiene cabecera con el nombre de la imagen y acciones (copiar referencia, filtrar por esta imagen, abrir en una pestaña, cerrar), cuerpo con las secciones de Propiedades y Pods, estado de carga y un aviso si la imagen ya no se puede leer.
- Esc cierra el panel; cambiar de clúster también lo cierra, porque cada clúster tiene su propio estado.

## 0.1.0

- Página de inventario de imágenes bajo cada clúster, con tabla de imagen/registro/tag/pods/namespaces y marcas (`latest`/sin tag, `docker.io`, tags múltiples).
- Detalle de una imagen (clic en una fila de esa tabla): registro, repositorio, tag, digest si corre por digest, `imagePullPolicy` e `imagePullSecrets` de los Pods que la usan, marcas explicadas, nodos, y una tabla de los Pods que la usan con enlace al detalle real de cada Pod.
- Sección «Imágenes» en el detalle de un Pod, por contenedor (incluye init y efímeros).
- Indicador en la barra de estado con cuántas imágenes del clúster activo usan `:latest` o no tienen tag.
