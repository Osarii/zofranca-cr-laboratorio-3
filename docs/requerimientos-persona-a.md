# Requerimientos — Persona A: solicitudes y admisión

## 1. Alcance

Este módulo registra zonas francas, recibe solicitudes de instalación, almacena la información de forma asíncrona y evalúa la afinidad de cada empresa contra los criterios de la zona seleccionada. El resultado deja una solicitud consultable y lista para la transición al módulo de instalación y cumplimiento cuando su estado sea `Recomendada`.

El módulo no crea empresas instaladas, reportes de cumplimiento ni alertas. Esas funciones pertenecen a Persona B.

## 2. Glosario del dominio

| Término | Definición |
|---|---|
| Zona franca | Parque o régimen territorial que define criterios mínimos para admitir empresas. |
| Criterios de admisión | Inversión mínima, empleos mínimos y sectores permitidos asociados a una zona franca. |
| Solicitud de instalación | Perfil enviado por una empresa para solicitar ingreso a una zona franca. |
| Perfil empresarial | Empresa, sector, inversión proyectada, empleos proyectados y zona solicitada. |
| Puntaje de afinidad | Valor entre 0 y 100 que resume el ajuste del perfil a los criterios de admisión. |
| Pendiente | Solicitud almacenada que todavía no tiene una clasificación automática. |
| Recomendada | Solicitud compatible con el sector y con un puntaje igual o superior a 80. |
| Revisar | Solicitud compatible con el sector y con un puntaje entre 50 y 79. |
| Rechazada | Solicitud con puntaje menor a 50 o cuyo sector no está permitido. |
| Justificación | Explicación legible de la clasificación, incluyendo sector, inversión y empleos. |
| Empresa instalada | Registro que Persona B puede crear a partir del identificador de una solicitud `Recomendada`. |

## 3. Reglas de negocio de admisión

| Código | Regla |
|---|---|
| RN-ADM-01 | Toda solicitud debe hacer referencia a una zona franca existente mediante `zonaFrancaId`. |
| RN-ADM-02 | La empresa, el sector, la inversión, los empleos y la fecha son obligatorios. |
| RN-ADM-03 | Una solicitud se guarda primero con estado `pendiente`, puntaje `0` y justificación vacía. |
| RN-ADM-04 | La inversión aporta hasta 40 puntos en proporción al mínimo definido por la zona. |
| RN-ADM-05 | Los empleos aportan hasta 35 puntos en proporción al mínimo definido por la zona. |
| RN-ADM-06 | Un sector permitido aporta 25 puntos; un sector no permitido aporta 0 y fuerza el estado `Rechazada`. |
| RN-ADM-07 | Con sector permitido: 80–100 es `Recomendada`, 50–79 es `Revisar` y 0–49 es `Rechazada`. |
| RN-ADM-08 | El puntaje siempre se limita al intervalo de 0 a 100. |
| RN-ADM-09 | Toda clasificación debe persistir el estado, puntaje y justificación mediante `PATCH /solicitudes/:id`. |
| RN-ADM-10 | Las evaluaciones masivas de pendientes deben iniciarse de forma concurrente con `Promise.all`. |
| RN-ADM-11 | La fecha de registro usa el formato ISO `AAAA-MM-DD` para permitir filtros consistentes. |
| RN-ADM-12 | Una solicitud `Recomendada` debe conservar un `id` consultable para el traspaso a Persona B. |

## 4. Requerimientos funcionales y criterios de aceptación

### RF-01 — Registrar una zona franca

**Dado** que el usuario está en la vista de zonas francas y completa nombre, inversión mínima, empleos mínimos y al menos un sector permitido,  
**cuando** confirma el registro,  
**entonces** el sistema guarda la zona en `/zonasFrancas` y la muestra en el listado con sus criterios.

**Dado** que no se ingresó ningún sector permitido,  
**cuando** el usuario intenta guardar,  
**entonces** el sistema no envía la solicitud y muestra un mensaje claro.

### RF-02 — Enviar una solicitud de instalación

**Dado** que existe al menos una zona franca,  
**cuando** la empresa completa el formulario con datos válidos y lo envía,  
**entonces** el sistema crea una solicitud asociada a la zona seleccionada con estado inicial `pendiente`.

### RF-03 — Guardar y consultar solicitudes de forma asíncrona

**Dado** que `json-server` está disponible en el puerto 3001,  
**cuando** se crea o consulta una solicitud,  
**entonces** la interfaz realiza la operación sin bloquearse y actualiza la vista con la respuesta.

**Dado** que la API no responde o devuelve un error,  
**cuando** finaliza la operación,  
**entonces** el sistema muestra un mensaje no técnico y registra el detalle en consola.

### RF-04 — Obtener puntaje de afinidad

**Dado** que una solicitud pendiente hace referencia a una zona válida,  
**cuando** se ejecuta la evaluación,  
**entonces** el motor compara sector, inversión y empleos y devuelve un puntaje entero entre 0 y 100 junto con su desglose.

### RF-05 — Clasificar automáticamente

**Dado** que el motor devolvió un puntaje y validó el sector,  
**cuando** se aplica la regla de clasificación,  
**entonces** el sistema asigna exactamente `Recomendada`, `Revisar` o `Rechazada` y persiste el resultado y su justificación.

**Dado** que el sector no está permitido,  
**cuando** se clasifica la solicitud,  
**entonces** el resultado es `Rechazada` aunque los valores de inversión y empleos sean altos.

### RF-13 — Evaluar varias solicitudes en paralelo

**Dado** que existen varias solicitudes con estado `pendiente`,  
**cuando** el usuario selecciona “Evaluar pendientes”,  
**entonces** el sistema inicia todas las evaluaciones mediante `Promise.all`, mantiene la interfaz disponible y actualiza el tablero al terminar.

### RF-15 — Listar y filtrar solicitudes

**Dado** que existen solicitudes registradas,  
**cuando** el usuario filtra por estado, zona franca, sector, fecha desde o fecha hasta,  
**entonces** el tablero muestra únicamente las solicitudes que cumplen simultáneamente los filtros.

**Dado** que ningún registro coincide,  
**cuando** se aplican los filtros,  
**entonces** la interfaz muestra un estado vacío y permite limpiar los filtros.

## 5. Diseño de las pantallas

| Pantalla | Contenido principal | Acción principal |
|---|---|---|
| Formulario | Empresa, zona, sector, inversión, empleos y resumen de criterios. | Guardar y evaluar con IA. |
| Dashboard | Métricas, búsqueda, filtros por estado/zona/sector/fecha y tarjetas de solicitudes. | Evaluar pendientes en paralelo o abrir una solicitud. |
| Detalle | Perfil, comparación contra mínimos, puntaje, estado y justificación. | Evaluar/reevaluar y generar dictamen. |

Las tres pantallas utilizan los colores, tipografía, espaciado y componentes visuales de la plantilla de Stitch suministrada.

## 6. Checklist de integración

- [x] `db.json` conserva las cuatro colecciones del contrato compartido.
- [x] La API utiliza el puerto fijo 3001.
- [x] La URL base está declarada una sola vez en `src/shared/apiClient.ts`.
- [x] Los estados de solicitud se importan desde `src/shared/estados.ts`.
- [x] `Recomendada` se persiste con mayúscula inicial y sin variaciones.
- [x] El `id` de la solicitud recomendada permanece consultable.
- [x] Puntaje y justificación se muestran en el detalle.
- [x] El procesamiento masivo usa `Promise.all`.
- [x] El módulo de cumplimiento de Persona B no fue modificado funcionalmente.
- [x] Los errores se muestran al usuario y se registran en consola.
- [x] Las pruebas del clasificador y la compilación de producción pasan.
