# Local deployment tutorial · English

[Back to README](../README.en.md) · [简体中文](DEPLOYMENT.zh-CN.md) · [日本語](DEPLOYMENT.ja.md)

Serve the static website from a PC, Raspberry Pi or Orange Pi and display it on an iPad mini on the same LAN. You do not need a camera, GPU, NPU, YOLO, LVGL, database or npm package installation to use this frontend.

## 1. Get the source and Python

Open the [GitHub repository](https://github.com/sakual123/N-gauge-web-platform), select **Code → Download ZIP**, and extract it to an ordinary folder. Alternatively, install [Git](https://git-scm.com/downloads/) and run:

```sh
git clone https://github.com/sakual123/N-gauge-web-platform.git
cd N-gauge-web-platform
```

Open a terminal in the repository root. `dir` on Windows or `ls` on Linux/macOS should show `README.md`, `dist/` and `tools/`. Do not start from inside `docs/` or `dist/`.

- Windows: install Python 3 from [python.org](https://www.python.org/downloads/) and check `py --version` or `python --version`. Reopen PowerShell after installation.
- Linux/Raspberry Pi/Orange Pi: check `python3 --version`. On Debian, Ubuntu, Raspberry Pi OS, or Debian/Ubuntu-based Armbian, use the following if Python is missing.
- macOS: install Python 3 and check `python3 --version`.

```sh
sudo apt update
sudo apt install python3 git
```

The `apt` commands apply only to Linux distributions using that package manager. ZIP-based setup and displaying the page do not require Git or Node.js.

## 2. Verify on the server first

Windows PowerShell:

```powershell
py -m http.server 8769 --bind 127.0.0.1 --directory dist
```

If `py` is unavailable but `python` works, substitute `python`. Linux/macOS:

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory dist
```

Keep the terminal open and visit **http://127.0.0.1:8769/** on that computer. You should see the two-platform, four-row board and information strip, rather than a file listing. Press `Ctrl+C` to stop.

## 3. Connect the iPad

Restart with a LAN-accessible bind address:

```powershell
# Windows
py -m http.server 8769 --bind 0.0.0.0 --directory dist
```

```sh
# Linux / macOS
python3 -m http.server 8769 --bind 0.0.0.0 --directory dist
```

On Windows, run `ipconfig` and find the **IPv4 Address** of the active Wi-Fi or Ethernet adapter. On Linux, run `hostname -I` and select the actual LAN interface address. On macOS, find the IP in the network connection details in System Settings.

For example, if the server is `192.168.1.50`, connect the iPad to the same LAN and open this in Safari:

```text
http://192.168.1.50:8769/
```

Replace the example IP with your own. `127.0.0.1` on the iPad refers to the iPad itself; `0.0.0.0` is a listening address, not a destination. If Windows Firewall prompts, allow the server on the trusted private network you use for the layout. Router internet port forwarding is unnecessary. Use this Python server for trusted local display, rather than a public production service. [Python documentation](https://docs.python.org/3/library/http.server.html)

## 4. Everyday iPad use

1. Landscape is recommended. Safari → Share → Add to Home Screen provides a cleaner entry point.
2. Open the top-right `···` and choose platform 1 (outer) or 2 (inner).
3. Choose region → category → route → vehicle, then a reference departure or custom time, destination and model car count.
4. The scrolling strip can follow the next departure using Japan's current time or a specified model clock.
5. Fullscreen and screen wake lock depend on the browser and secure-context support. Wake Lock may be unavailable over LAN HTTP; adjust the iPad's Auto-Lock manually if needed. Normal board display still works.

Adding to the Home Screen does not cache the site for offline use. This release has no Service Worker. Keep the server running and reachable when opening or reloading the page.

## 5. Settings, updates and timetable data

Settings live in the current browser's local storage. Clearing site data, ending private browsing, switching devices, or changing IP/port/HTTP versus HTTPS can make existing settings unavailable. A stable server IP is convenient. Use `导出设置备份` to export JSON; there is no graphical import button or cross-device sync yet.

For Git installations, run `git pull --ff-only` from the repository root. Save and reconcile local changes first if Git reports them. ZIP users can download again and extract to a new folder. Reload the page after updating, then check the times and formations before applying reference departures.

V7 contains 17,030 reference records frozen to Sunday, 25 October 2026 JST. 233 presets cover the full day within their stated scope, while 0 remain partial. Vehicle presets can share actual departures; this is not a count of unique trains. Operating-date verification is labelled separately. Open `http://SERVER_IP:8769/timetable.html` for filters and paginated sources. Existing browser settings are preserved; use the apply-default-references button to load the new defaults.

## 6. Linux startup service (optional)

For Raspberry Pi/Orange Pi Linux systems using systemd, run `whoami` and `pwd` **from the repository root** to obtain the ordinary username and absolute checkout path.

```sh
sudo nano /etc/systemd/system/n-gauge-board.service
```

Save the following, replacing `YOUR_USER` and both occurrences of `/home/YOUR_USER/N-gauge-web-platform`. Replace `/usr/bin/python3` if `which python3` reports a different path. Use a checkout path without spaces for this example.

```ini
[Unit]
Description=N gauge platform board
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/home/YOUR_USER/N-gauge-web-platform
ExecStart=/usr/bin/python3 -m http.server 8769 --bind 0.0.0.0 --directory /home/YOUR_USER/N-gauge-web-platform/dist
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Stop any manually running server on the same port before starting the service:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now n-gauge-board.service
systemctl status n-gauge-board.service
journalctl -u n-gauge-board.service -n 30 --no-pager
```

After updating the files, use `sudo systemctl restart n-gauge-board.service`. To disable automatic startup:

```sh
sudo systemctl disable --now n-gauge-board.service
```

## 7. Troubleshooting and checks

| Symptom | What to check |
|---|---|
| File listing or 404 | Run from the repository root; check `dist/index.html` and retain `--directory dist` |
| PC works, iPad cannot connect | Check `0.0.0.0`, IP, port, firewall, Wi-Fi client isolation and guest networks |
| Address already in use | Stop the old server or change to a port such as `8770`; update the URL too. A different port has separate settings storage |
| Settings appear lost | Check IP, port, protocol, browser and private browsing mode |
| Clock differs from local time | The board uses JST; reference data stays on 25 October and the ticker can also use a model clock |
| Only one or two departures per vehicle | This release contains representative services, not complete daily tables |
| Chinese editor with Japanese/English board | This is the current UI; translated documentation does not switch editor language |

For development checks, install a [supported Node.js LTS](https://nodejs.org/en/download) and run `npm test` in the root. No npm dependencies need installing. If only `node` is available:

```sh
node tools/check-timetable.cjs
node tools/check-special.cjs
node tools/check-ticker.cjs
```

These checks cover data and model logic. They do not replace physical iPad Safari touch and compatibility testing.


## V8 audio and themes

Select a whole-board theme in display options. Click a train name for manual speech; automatic playback requires sound activation and the auto option. Japan time is matched against the four rows, with outer-circle jobs before inner-circle jobs and no speech overlap. Tap to re-enable after reload. Background or locked devices may suspend audio; missed minutes are not replayed. Audio uses device Japanese speech synthesis, not original station recordings.


### N scale · V9

Each train now has a “对应N比例车型” section showing copyable product numbers, packaged lengths and official sources. It follows vehicle selection and leaves your formation and service unchanged. After editing `data/nscale-products.json`, run `npm run build:nscale`, then deploy the complete `dist/` folder.


## V10

Settings use Train / Display / Audio tabs (列车／屏幕／声音). Choose a platform and first/next departure before editing. The N-scale shortcut opens that vehicle’s products; the footer opens the complete filterable directory. Copy the search link to share a selection. Replace the entire dist folder when updating, then refresh. Existing formations, times and destinations are retained.
