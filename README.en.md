# Model Station · N Gauge Web Platform

[简体中文](README.md) · [日本語](README.ja.md) · **English**

[Live demo](https://n-gauge-platform-board.clear-seal-8717.chatgpt.site/) · [Local deployment guide](docs/DEPLOYMENT.en.md) · [Architecture](docs/ARCHITECTURE.md) · [MIT license](LICENSE)

A Japanese railway departure-board simulator for N gauge layouts and iPad displays. It uses a JR East inspired overall layout with separate branding, service types and equipment indicators for private railways and special trains. Built with plain HTML, CSS and JavaScript; no framework or frontend dependencies are required.

![iPad landscape preview](docs/images/ipad-landscape.jpg)

## Features

- **Two model platforms and four departures:** platform 1 is the outer R315 loop; platform 2 is the inner R282 loop. Each has a first and next departure.
- **237 vehicle/service presets:** choose region → category → route → vehicle. Regions cover eastern Japan, western Japan, Hokkaido, Tokai and Kyushu; categories include Shinkansen, limited express, commuter and private/local transport.
- **Manual editing:** train name, service number, origin, destination, departure time and model formations from 1–30 cars. Open settings through the discreet `···` control at the top right.
- **18 equipment indicators and 27 brands:** Green Car, GranClass, u-seat, PREMIUM CAR, PRiVACE, Hinotori, Shimakaze, Saphir Odoriko and others. Some use official artwork; others use text or schematic indicators.
- **Scrolling train information:** stops and non-reserved/reserved/Green seating for the next departure. Choose a fixed row, model clock, speed, pause or custom text.
- **LCD/LED appearance:** Japanese/English board information, optional dot texture, landscape/portrait layouts, browser-local persistence and JSON settings export.

## Timetable scope

This release is **V6: 237 presets and 425 representative departures**, frozen to **Sunday, 25 October 2026, Japan Standard Time (UTC+9)**. Work on complete daily timetables is paused and is not included in this release. This is neither a live lookup service nor a timetable that changes automatically the next day.

| Presets | Verification scope |
|---:|---|
| 117 | The 25 October data source or operating date was checked |
| 95 | Current official Saturday/holiday references |
| 15 | Official daily references |
| 4 | Official tourist-train times; operating dates still require confirmation |
| 2 | Official older Ginza/Marunouchi tables; current times unconfirmed |
| 2 | Historical references for the discontinued Hokutosei and Super Hakucho |
| 2 | Weekday Shonan/Akagi references that do not run on Sunday |

Routes may use mixed fleets, so a real departure does not guarantee the selected vehicle series. Model car counts are separate from real formations and seat-car numbering. Model platforms 1/2 do not represent actual station tracks. Full stopping patterns apply only when stored and when the service number, direction and type still match; typing a different service number does not fetch another train.

See [TIMETABLES.md](TIMETABLES.md), [special display research](SPECIAL-DISPLAYS.md) and [scrolling information research](SCROLL-RESEARCH.md) for individual sources and limits. These detailed research records are primarily in Chinese.

## Quick start

Install Python 3. Downloading a ZIP avoids needing Git. Run these commands from the repository root, containing both `README.md` and `dist/`:

```sh
git clone https://github.com/sakual123/N-gauge-web-platform.git
cd N-gauge-web-platform
python -m http.server 8769 --bind 127.0.0.1 --directory dist
```

Use `py` with the Windows Python launcher, or usually `python3` on Linux/macOS. Open **http://127.0.0.1:8769/** on the same computer. Press `Ctrl+C` to stop.

For an iPad, change the bind address to `0.0.0.0`, connect to the same LAN and open `http://SERVER_LAN_IP:8769/` in Safari. The [English deployment guide](docs/DEPLOYMENT.en.md) covers installation, finding the IP, troubleshooting and Linux startup.

## Controls and persistence

1. Open `···` and choose platform 1/2, region, category, route and vehicle.
2. Select an official reference departure or edit the time, number, destination and car count. Changes save automatically in the current browser.
3. Use `滚动停站与座席` for stops/seats and `底部滚动提示` for the target departure, clock, speed and pause.
4. Use `导出设置备份` to export JSON. There is currently no graphical JSON import button.

Existing rows and custom model formations are retained. `四行套用默认参考班次` and loading a scene change the four current rows. Storage belongs to each site origin: changing IP, port, protocol or device does not move settings automatically. Adding the page to the iPad Home Screen does not cache it for offline use; this version has no Service Worker.

Board information is mainly Japanese/English; the editor is currently Chinese. Multilingual documentation does not add a three-language UI switch.

## Development

Use Node.js 22 or a newer supported LTS for checks. No `npm install` is needed:

```sh
npm test
```

Alternatively run `node tools/check-timetable.cjs`, `node tools/check-special.cjs` and `node tools/check-ticker.cjs`. GitHub Actions runs the same checks on pushes and pull requests.

`dist/` is the static website. `catalog*.js` defines regions/routes/vehicles; `timetable-*.js` provides reference departures; `special-services.js` and `service-ui.js` handle brands/equipment; `journey-*.js` handles stops, seats and scrolling. See the [architecture notes](docs/ARCHITECTURE.md).

This is currently a standalone web frontend. OpenCV/YOLO recognition and an LVGL hardware display client are not implemented.

## Contributing and licensing

Issues and pull requests are welcome. Timetable corrections should include the official source, applicable date, origin and direction, with uncertain operating dates and mixed fleets clearly identified. Run the checks before submitting and verify UI changes at iPad landscape and portrait sizes.

Original code is released under the [MIT License](LICENSE). Third-party trademarks, service names and official artwork are excluded from this project's MIT grant; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the asset source list. This is an independent hobby project, without railway-operator affiliation or endorsement.
