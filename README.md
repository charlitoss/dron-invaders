# Dron Invaders

Shooter arcade estilo años 80: bajá los drones que forman una figura sobre el techo del estadio.

- Un solo archivo estático: `index.html` (HTML, CSS y JS sin dependencias de build).
- Controles: tocá y arrastrá en el celular (dispara solo), o ← → y Espacio en el teclado.

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
