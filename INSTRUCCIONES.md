# ZoFranca CR · adaptación Stitch industrial

Este paquete contiene archivos completos listos para superponerse sobre el repositorio. No use `git apply`.

## Instalación en PowerShell

Desde la raíz del repositorio:

```powershell
$zip = "$HOME\Downloads\zofranca-stitch-industrial-v9-overlay.zip"
$tmp = Join-Path $env:TEMP ("zofranca-stitch-v9-" + [guid]::NewGuid().ToString())

Expand-Archive -Path $zip -DestinationPath $tmp -Force
Copy-Item -Path "$tmp\*" -Destination . -Recurse -Force

npm install
npm run lint
npm test
npm run build
npm run dev
```

Abra `http://127.0.0.1:3000/`.

## Publicación

```powershell
git add -- cumplimiento index.html shared src
git commit -m "feat(ui): adapta plataforma a bocetos Stitch industrial"
git push origin main
```

## Diseño implementado

- Shell de escritorio con barra lateral fija y buscador superior.
- Encabezado, drawer y navegación inferior para móvil.
- Dashboard de alta jerarquía visual.
- Solicitudes como tabla en escritorio y tarjetas en móvil.
- Detalle con evaluación IA, historial y accordions móviles.
- Alertas con métricas, filtros, tabla y tarjetas por severidad.
- Paleta exacta del boceto: negro, carbón, marfil y amarillo `#FFD700`.
- Tipografía Manrope, bordes finos, tonalidad plana y sin efectos neón.
