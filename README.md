# Marine Compass

Standalone mobile-first marine navigation compass inspired by the visual language of modern marine multifunction displays.

## Features

- 360° compass dial with cardinal/intercardinal labels
- 10°/30° tick marks
- Heading display
- Depth, SOG, TWS and speed data boxes
- True/apparent wind vector placeholders
- Current/tide vector
- Waypoint bearing marker
- iPhone DeviceOrientation compass support
- Browser GPS support
- Demo mode
- Fullscreen mode
- Installable/PWA-ready
- Offline cache through a service worker
- No external JavaScript libraries

## GitHub Pages

Upload all files to the root of a GitHub repository:

- `index.html`
- `style.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `README.md`

Then enable GitHub Pages from **Settings → Pages → Deploy from a branch → main → / (root)**.

Open the resulting HTTPS URL on the iPhone. Sensor permission requires a secure context (HTTPS).

## Important

The iPhone browser can provide orientation and GPS, but it does not directly receive boat NMEA 0183/NMEA 2000 data. For real marine instruments, add a bridge such as Signal K, WebSocket, Wi-Fi NMEA gateway, or a Raspberry Pi service and connect it to `app.js`.

## Data model

The UI is ready for:

- heading
- depth
- SOG
- speed/STW
- true wind speed
- wind angle
- current direction
- current speed
- waypoint bearing

The source GitHub project that inspired this layout is licensed MIT and documents NMEA 0183/NMEA 2000/Signal K compatibility.
