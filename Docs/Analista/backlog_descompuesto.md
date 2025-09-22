# 📦 Backlog Descompuesto — Proyecto “Copia de Rappi”

| ID     | Tipo       | Título resumido                                               | Estimación | Prioridad | Dependencias | Owner sugerido |
|--------|------------|----------------------------------------------------------------|------------|-----------|--------------|----------------|
| U-001  | Usuario    | Buscar restaurantes por nombre o categoría                     | 5h         | Alta      | -            | Backend        |
| U-002  | Usuario    | Ver menú completo con precios y descripciones                  | 4h         | Alta      | U-001        | Backend        |
| U-003  | Usuario    | Añadir artículos al carrito                                    | 6h         | Alta      | U-002        | Backend        |
| U-004  | Usuario    | Ajustar cantidades en el carrito                               | 3h         | Media     | U-003        | Backend        |
| U-005  | Usuario    | Ver resumen del pedido                                         | 4h         | Alta      | U-004        | Backend        |
| U-006  | Usuario    | Aplicar códigos de descuento                                   | 5h         | Media     | U-005        | Backend        |
| U-007  | Usuario    | Seleccionar dirección de entrega                               | 4h         | Alta      | -            | Backend        |
| U-008  | Usuario    | Elegir método de pago                                          | 4h         | Alta      | -            | Backend        |
| U-009  | Usuario    | Recibir confirmación del pedido                                | 3h         | Alta      | U-005        | Backend        |
| U-010  | Usuario    | Seguir estado del pedido en tiempo real                        | 6h         | Alta      | U-009        | Backend        |
| U-011  | Usuario    | Contactar soporte por problemas                                | 3h         | Media     | -            | Backend        |
| UX-001 | Usuario    | Ver calificaciones y reseñas de restaurantes                   | 3h         | Media     | -            | Backend        |
| UX-002 | Usuario    | Calificar y dejar reseñas                                      | 3h         | Media     | U-010        | Backend        |
| UX-003 | Usuario    | Recibir notificaciones de estado y promociones                 | 4h         | Media     | U-010        | Backend        |
| UX-004 | Usuario    | Ver historial de pedidos                                       | 4h         | Media     | -            | Backend        |
| UX-005 | Usuario    | Marcar restaurantes como favoritos                             | 3h         | Baja      | -            | Backend        |
| V-001  | Vendor     | Crear y gestionar menú con productos                           | 6h         | Alta      | -            | Backend        |
| V-002  | Vendor     | Activar/desactivar productos                                   | 3h         | Alta      | V-001        | Backend        |
| V-003  | Vendor     | Configurar promociones por producto                            | 4h         | Media     | V-001        | Backend        |
| V-004  | Vendor     | Gestionar categorías de productos                              | 3h         | Media     | V-001        | Backend        |
| V-005  | Vendor     | Recibir notificación de nuevo pedido                           | 3h         | Alta      | U-009        | Backend        |
| V-006  | Vendor     | Ver detalles completos del pedido                              | 4h         | Alta      | V-005        | Backend        |
| V-007  | Vendor     | Cambiar estado del pedido (aceptar, preparar, listo)           | 4h         | Alta      | V-006        | Backend        |
| V-008  | Vendor     | Contactar cliente o soporte                                    | 3h         | Media     | -            | Backend        |
| V-009  | Vendor     | Ver historial de pedidos                                       | 3h         | Media     | -            | Backend        |
| V-010  | Vendor     | Gestionar perfil del negocio                                   | 4h         | Media     | -            | Backend        |
| V-011  | Vendor     | Acceder a reportes de ventas y desempeño                       | 5h         | Media     | -            | Backend        |
| B-001  | Backoffice | Alta y gestión de vendors                                      | 5h         | Alta      | -            | Backend        |
| B-002  | Backoffice | Moderar reseñas de usuarios                                    | 4h         | Media     | UX-002       | Backend        |
| B-003  | Backoffice | Gestionar promociones y descuentos globales                    | 5h         | Media     | -            | Backend        |
| B-004  | Backoffice | Ver tablero de control general                                 | 6h         | Alta      | -            | Backend        |
| B-005  | Backoffice | Gestionar comisiones para vendors                              | 4h         | Media     | -            | Backend        |
| D-001  | Driver     | Recibir pedidos disponibles para entrega                       | 4h         | Alta      | V-007        | Backend        |
| D-002  | Driver     | Ver detalles del pedido para entrega                           | 4h         | Alta      | D-001        | Backend        |
| D-003  | Driver     | Aceptar o rechazar pedido                                       | 3h         | Alta      | D-001        | Backend        |
| D-004  | Driver     | Navegación GPS integrada                                        | 5h         | Media     | -            | Backend        |
| D-005  | Driver     | Actualizar estado de entrega                                   | 3h         | Alta      | D-002        | Backend        |
| D-006  | Driver     | Contactar cliente o vendor durante entrega                     | 3h         | Media     | -            | Backend        |
| D-007  | Driver     | Ver historial de entregas                                      | 3h         | Media     | -            | Backend        |
| D-008  | Driver     | Ver resumen de ganancias por entrega                           | 4h         | Media     | -            | Backend        |
| D-009  | Driver     | Ver desglose de pagos                                          | 4h         | Media     | D-008        | Backend        |
| D-010  | Driver     | Activar/desactivar disponibilidad                              | 3h         | Media     | -            | Backend        |
| D-011  | Driver     | Ver calificación y comentarios del usuario                     | 3h         | Baja      | -            | Backend        |
| B-006  | Backoffice | Alta y gestión de drivers                                       | 5h         | Alta      | -            | Backend        |
| B-007  | Backoffice | Ver ubicación actual de drivers en mapa                        | 5h         | Alta      | D-010        | Backend        |
| B-008  | Backoffice | Asignar pedidos manualmente a drivers                          | 4h         | Alta      | D-001        | Backend        |
