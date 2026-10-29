# 本地部署教材 · 中文

[返回 README](../README.md) · [日本語](DEPLOYMENT.ja.md) · [English](DEPLOYMENT.en.md)

目标：用电脑、树莓派或香橙派提供网页，让同一局域网内的 iPad mini 显示发车标。网页为静态文件，部署不需要摄像头、GPU、NPU、YOLO、LVGL、数据库或 npm 安装。

## 1. 准备源码与 Python

在 [GitHub 仓库](https://github.com/sakual123/N-gauge-web-platform) 点击 **Code → Download ZIP**，解压到普通文件夹。也可以安装 [Git](https://git-scm.com/downloads/) 后执行：

```sh
git clone https://github.com/sakual123/N-gauge-web-platform.git
cd N-gauge-web-platform
```

打开终端并进入解压后的仓库根目录；运行 `dir`（Windows）或 `ls`（Linux／macOS）应看到 `README.md`、`dist/`、`tools/`。不是进入 `docs/` 或 `dist/`。

- Windows：从 [Python 官网](https://www.python.org/downloads/) 安装 Python 3，验证 `py --version` 或 `python --version`。安装后重新打开 PowerShell。
- Linux／树莓派／香橙派：验证 `python3 --version`。使用 Debian、Ubuntu、Raspberry Pi OS 或基于 Debian／Ubuntu 的 Armbian，若没有 Python，可执行下面的安装命令。
- macOS：安装 Python 3 后验证 `python3 --version`。

```sh
sudo apt update
sudo apt install python3 git
```

上述 `apt` 命令仅用于采用该包管理器的 Linux。仅下载 ZIP 和运行网页时不需要 Git，也不需要 Node.js。

## 2. 先在服务器本机验证

Windows PowerShell：

```powershell
py -m http.server 8769 --bind 127.0.0.1 --directory dist
```

若 `py` 不可用但 `python --version` 正常，把 `py` 换成 `python`。Linux／macOS：

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory dist
```

保持终端打开，浏览器访问 **http://127.0.0.1:8769/**。应看到两站台、四行列车和下部案内，而不是文件目录列表。按 `Ctrl+C` 停止。

## 3. 让 iPad 访问

重新启动，监听局域网连接：

```powershell
# Windows
py -m http.server 8769 --bind 0.0.0.0 --directory dist
```

```sh
# Linux / macOS
python3 -m http.server 8769 --bind 0.0.0.0 --directory dist
```

在 Windows 执行 `ipconfig`，查当前 Wi-Fi 或以太网适配器的 **IPv4 地址**；Linux 执行 `hostname -I`，选择实际局域网网卡的地址；macOS 在系统设置的网络连接详情中查看 IP。

例如服务器地址为 `192.168.1.50`，让 iPad 与它连接同一个局域网，在 Safari 输入：

```text
http://192.168.1.50:8769/
```

把示例 IP 换成自己的地址。iPad 上的 `127.0.0.1` 指向 iPad 自己；`0.0.0.0` 是监听参数，也不是访问地址。Windows 若提示防火墙访问，按家庭／模型桌所用的专用网络允许该服务器；不需要开放路由器公网端口。Python 的这个服务器适合受信任的本地展示，不用它承载公网生产服务。[Python 官方说明](https://docs.python.org/3/library/http.server.html)

## 4. iPad 显示与日常操作

1. 推荐横屏；Safari 分享菜单 → 添加到主屏幕，可获得更简洁的入口。
2. 点击右上角 `···`，选择 1 站台外圈或 2 站台内圈。
3. 按地区 → 类型 → 线路 → 车辆选择，再选参考班次，或编辑固定时间、行先和模型节数。
4. 选择“日本当前时钟”时，滚动栏按 JST 找最近待发班次；模型展示可改为“指定模型时刻”。
5. 常亮和全屏取决于浏览器及安全上下文。局域网 HTTP 不保证常亮 API 可用，可手动调整 iPad 自动锁定；没有该能力仍能正常显示。

添加主屏幕不会自动离线缓存；当前没有 Service Worker。服务器需持续运行，浏览器刷新或重新打开页面时需要能连接服务器。

## 5. 保存、更新和数据

修改会保存到当前浏览器的本地存储。浏览器清理站点数据、无痕模式结束、更换设备或改变 IP／端口／HTTP 与 HTTPS，都可能无法继续读取原设置。建议固定设备 IP，并在编辑器中点击“导出设置备份”。当前提供 JSON 导出，尚无图形化导入按钮，也不会在设备间同步。

用 Git 获取的源码可以在仓库根目录执行 `git pull --ff-only` 更新；如果有本地修改，先保存自己的改动并处理提示。ZIP 用户重新下载并解压到新文件夹即可。更新后重新加载网页；先检查时刻与编组，再按需套用参考班次。

V7 收录 17,184 条参考记录，日期固定为 2026-10-25 周日 JST；243 个预设收齐各自声明范围的全天班次，0 个仍有缺口。车型可共用班次，记录数不是实际独立列车数；运行日核对状态另行标注。来源页 `http://服务器IP:8769/timetable.html` 支持筛选与分页。原有浏览器设置保留；需要新版默认参考时点击“四行套用默认参考班次”。

## 6. Linux 开机启动（可选）

适用于使用 systemd 的树莓派／香橙派 Linux。在**仓库根目录**运行 `whoami` 和 `pwd`，记录普通用户名及绝对路径，再执行：

```sh
sudo nano /etc/systemd/system/n-gauge-board.service
```

写入以下内容，将 `YOUR_USER` 和两处 `/home/YOUR_USER/N-gauge-web-platform` 都替换为实际值；`which python3` 若不是 `/usr/bin/python3`，也要替换对应路径。示例仓库路径不要包含空格。

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

保存退出。先停止前面手动运行的同端口服务器，再启动服务：

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now n-gauge-board.service
systemctl status n-gauge-board.service
journalctl -u n-gauge-board.service -n 30 --no-pager
```

更新源码后可执行 `sudo systemctl restart n-gauge-board.service`。不再需要自动启动时：

```sh
sudo systemctl disable --now n-gauge-board.service
```

## 7. 排错与检查

| 现象 | 检查方法 |
|---|---|
| 出现目录列表／404 | 确认在仓库根目录执行，且 `dist/index.html` 存在；保留 `--directory dist` |
| 本机能开、iPad 不能 | 检查绑定 `0.0.0.0`、IP、端口、防火墙及 Wi-Fi 客户端隔离；避免访客网络隔离 |
| Address already in use | 停止旧服务器或将 `8769` 改为 `8770`，同时更改浏览器地址；新端口使用独立设置存储 |
| 修改似乎丢失 | 检查是否换了 IP、端口、协议、浏览器或隐私模式 |
| 时间与本地时钟不同 | 页面使用日本时间；资料固定为 10/25，滚动栏还可使用模型时钟 |
| 某车型只有一两班 | 本版本是代表班次库；不是完整全天表 |
| 中文设置、日英发车标 | 当前设计如此；三语说明文件不改变编辑器语言 |

开发者安装 [Node.js 受支持的 LTS](https://nodejs.org/en/download)，在根目录运行 `npm test`；无需安装 npm 依赖。如果只有 `node` 而没有 `npm`，可分别运行：

```sh
node tools/check-timetable.cjs
node tools/check-special.cjs
node tools/check-ticker.cjs
```

这些是数据和模型逻辑检查，不代替实体 iPad Safari 的触摸与浏览器兼容性验证。


## V8 声音与主题

整屏主题在显示选项中切换。点击列车名手动播报；自动播报需先启用声音并打开自动开关，按日本实时时钟匹配当前四行。相同分钟先外圈后内圈，每段播完再接下一段。刷新后再次点启用，后台或锁屏可能停播，不补播已错过分钟。声音来自设备日语合成，不是原站录音；可切换日语音色、语速和音量。


### N scale · V9

每班车的设置下新增“对应N比例车型”，可查厂家品号、套装节数及官方资料，品号可复制。切换车辆后自动更新；不会更改编组或班次。数据文件为 `data/nscale-products.json`，修改后执行 `npm run build:nscale`，并完整复制 `dist/` 部署。


## V10

设置面板分为“列车／屏幕／声音”。在“列车”中选择站台与先发／次发，再修改该班。点击“N 比例车型 · 厂家与品号”可直接展开模型资料；页脚“N比例目录”打开完整检索。目录支持地区、类型、线路、厂家、模型形态和对应情况，可复制查询链接。升级时复制整个 dist 目录并刷新网页；旧编组、班次和行先设置继续保留。



## V11

在“列车”设置中展开“快速找车”可按车名、系列或线路跨地区选车。每家模型产品的“编成搭配”展示已核对的基本／增结组合，并可复制整组品号；图示按包装分组，实际号车顺序请看官方图。目录支持“仅看有编成搭配”。“资料未列品号”的商品按商品名和官方链接查询。最小半径与曲线兼容等级仅按各项厂家资料及条件显示，不能据此推定整个布局可运行。



## V12

在完整N比例目录中展开“套装与曲线条件”，可以按一般套装、基本、增结或单车筛选。R282／R315只比较本品厂家明确记录的最小半径；条件说明和未核得数字另列，不从同系列其他商品推断。筛选标签可逐项删除，复制链接可保留条件。

“导出品号清单”生成当前筛选全部页面的CSV，相同厂家品号只保留一行并合并对应预设；含实际盒内节数、版本差异、来源和核对日期。未确认品号留空。表格软件导入时将品号列设为文本，可避免日期或前导零转换。

电脑转到iPad：右上角“···”→“屏幕”→“设置备份与迁移”→导出JSON，把文件通过自己的文件传输方式放到iPad，再点击“导入设置备份”。先查看四班预览，点击“应用这份备份”后才替换。导入包含节数、固定时间记忆、主题、滚动与声音偏好；声音需重新启用。在同一页面可点击“恢复导入前设置”；刷新后不保留这份内存撤销快照，建议另存原JSON。错误文件、未知车型或不完整四行会拒绝导入。文件仅在当前浏览器读取。


## V13

“屏幕”→“放大设置与模型资料文字”或目录右上角“大字阅读”可放大资料文字。此偏好按设备保存，不包含在列车设置JSON中。
