# Drone Invaders

Shooter arcade estilo años 80: bajá los drones que forman una figura sobre el techo del estadio.

- Un solo archivo estático: `index.html` (HTML, CSS y JS sin dependencias de build).
- Controles: tocá y arrastrá en el celular (dispara solo), o ← → y Espacio en el teclado.

## Power-ups

Algunos drones derribados sueltan una cápsula (más seguido si estaban en picada). Atrapala con la nave:

| Cápsula | Efecto | Duración |
|---|---|---|
| **R** amarilla | Tiro rápido: dispara el doble de rápido y con más pelotas en el aire | 10 s |
| **T** violeta | Tiro triple: tres pelotas en abanico | 10 s |
| **E** celeste | Escudo: absorbe un golpe | 15 s o hasta el golpe |
| **+** roja | Vida extra (máximo 5) | — |

Los power-ups activos se ven abajo a la izquierda con su tiempo restante. Se combinan entre sí y se pierden al perder una vida.

## Deploy en Vercel

Importá el repo en Vercel con el preset **Other**, sin build command ni output directory. Vercel sirve `index.html` desde la raíz.

## Correr localmente

Abrí `index.html` en el navegador, o servilo con `npx serve .`

## Imágenes para redes

En `img/share/` están las imágenes para compartir, generadas a partir de la escena real del juego:

| Archivo | Tamaño | Uso |
|---|---|---|
| `og.png` | 1200×630 | Vista previa del link (WhatsApp, X, Facebook, LinkedIn, Slack) |
| `post-square.png` | 1080×1080 | Post de Instagram / Facebook |
| `story.png` | 1080×1920 | Historia de Instagram / WhatsApp |
| `header-x.png` | 1500×500 | Portada de perfil en X |
| `cover-facebook.png` | 1640×624 | Portada de página de Facebook |

Para regenerarlas (necesita Google Chrome): `tools/covers.sh`
