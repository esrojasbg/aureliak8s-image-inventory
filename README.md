# aureliak8s-image-inventory

Inventario de solo lectura de las imágenes de contenedor que corren en un clúster: de dónde vienen, qué tag usan y qué Pods las usan. No modifica nada del clúster.

## Dónde aparece

- **Navegador**: bajo cada clúster conectado hay un ítem «Imágenes» (con su propio icono) que abre la página del inventario.
- **Página del inventario** (una pestaña por clúster, titulada «Imágenes · `<nombre del clúster>`»): un resumen de una línea, un cuadro de búsqueda y un filtro de namespaces propios de la extensión (ver abajo) y, debajo, una tabla con una fila por cada imagen distinta en uso, con columnas:
  - **Imagen**: el repositorio (por ejemplo `mcp/grafana` u `oss/v2/azure/ip-masq-agent`); la referencia completa (`registro/repositorio:tag`) aparece al pasar el ratón.
  - **Registro**: el registro de donde viene (`docker.io` cuando no se indica uno explícito).
  - **Tag**: el tag en uso, o `sin tag` cuando la imagen está fijada solo por digest.
  - **Pods**: cuántos Pods la usan.
  - **Namespaces**: cuántos namespaces la usan (y sus nombres, si son pocos).
  - **Marcas**: las insignias descritas abajo.

  Las filas con alguna marca aparecen primero; dentro de cada grupo, de más a menos Pods.

  El cuadro de búsqueda filtra la tabla por imagen, registro o namespace (no por tag); el botón «Namespaces» abre una lista para marcar uno o varios y quedarse solo con las filas que corren en esos namespaces. Sin ningún namespace marcado se muestran todos. Ambos filtran solo la tabla: el resumen de arriba siempre cuenta el clúster completo. «Limpiar filtros» aparece en cuanto hay alguno activo.

  Clic en cualquier celda de una fila abre (o enfoca) el detalle de esa imagen.
- **Detalle de una imagen** (una pestaña por imagen y clúster, titulada «Imagen · `<repositorio>:<tag>`»): registro, repositorio, tag y, si el clúster la resolvió por digest, el digest; el `imagePullPolicy` y los `imagePullSecrets` de los Pods que la usan; las marcas con una línea que explica cada una; en cuántos nodos corre; y debajo una tabla con una fila por Pod/contenedor que la usa — Pod, namespace, contenedor, controlador (de `ownerReferences`) y estado. Clic en una fila de esa tabla abre el panel de detalle real de ese Pod (con su propia sección «Imágenes», ver abajo).
- **Detalle de un Pod**: una sección «Imágenes» que lista cada contenedor (incluidos los de inicialización y los efímeros) con su imagen, registro, tag y marcas.
- **Barra de estado**: mientras hay un clúster activo con al menos una imagen marcada, un indicador «N :latest» — al pasar el ratón explica a qué clúster se refiere, y al hacer clic abre o enfoca la página del inventario de ese clúster.

## Qué significa cada marca

Las etiquetas de las insignias son cortas para no cortarse; su tooltip explica cada una por completo.

- **latest**: la imagen usa el tag `latest` (explícito o implícito, por no indicar ninguno) o no tiene tag — ninguno de los dos fija una versión concreta.
- **docker.io**: la imagen viene de Docker Hub, indicado explícitamente o por ser el registro por defecto cuando no se indica ninguno.
- **varios tags**: el mismo repositorio (registro + nombre de imagen) aparece en el clúster con más de un tag o digest distinto.

## Cómo obtiene los datos

Lee los Pods del clúster con el mecanismo de solo lectura de Kubernetes que expone AureliaK8s a las extensiones (list-and-watch); no ejecuta `kubectl` ni ninguna otra herramienta, y no escribe nada en el clúster.
