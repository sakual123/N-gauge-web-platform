# ローカル導入ガイド · 日本語

[README に戻る](../README.ja.md) · [简体中文](DEPLOYMENT.zh-CN.md) · [English](DEPLOYMENT.en.md)

PC、Raspberry Pi、Orange Pi から静的ページを配信し、同じ LAN の iPad mini に発車標を表示します。カメラ、GPU、NPU、YOLO、LVGL、データベース、npm パッケージのインストールは不要です。

## 1. ソースと Python を準備

[GitHub リポジトリ](https://github.com/sakual123/N-gauge-web-platform) の **Code → Download ZIP** から取得し、通常のフォルダーに展開します。[Git](https://git-scm.com/downloads/) を使う場合：

```sh
git clone https://github.com/sakual123/N-gauge-web-platform.git
cd N-gauge-web-platform
```

端末で展開先のルートに移動します。Windows の `dir`、Linux／macOS の `ls` で `README.md`、`dist/`、`tools/` が見えることを確認してください。`docs/` や `dist/` の中ではありません。

- Windows：[Python 公式サイト](https://www.python.org/downloads/) から Python 3 を用意し、`py --version` または `python --version` で確認。インストール後は PowerShell を開き直します。
- Linux／Raspberry Pi／Orange Pi：`python3 --version` を確認。Debian、Ubuntu、Raspberry Pi OS、Debian／Ubuntu ベースの Armbian で未導入の場合は以下を使えます。
- macOS：Python 3 を用意して `python3 --version` を確認します。

```sh
sudo apt update
sudo apt install python3 git
```

`apt` は対応する Linux 向けです。ZIP とページ表示だけなら Git と Node.js は不要です。

## 2. まず同じ端末で表示

Windows PowerShell：

```powershell
py -m http.server 8769 --bind 127.0.0.1 --directory dist
```

`py` がなく `python` が使える場合は置き換えます。Linux／macOS：

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory dist
```

端末を開いたまま **http://127.0.0.1:8769/** を開きます。ファイル一覧ではなく、2 番線・4 行の発車標と下部案内が表示されることを確認します。終了は `Ctrl+C` です。

## 3. iPad から接続

LAN 接続を受け付ける設定で起動し直します。

```powershell
# Windows
py -m http.server 8769 --bind 0.0.0.0 --directory dist
```

```sh
# Linux / macOS
python3 -m http.server 8769 --bind 0.0.0.0 --directory dist
```

Windows は `ipconfig` の使用中 Wi-Fi／Ethernet の **IPv4 アドレス**、Linux は `hostname -I` の実際の LAN アドレス、macOS はシステム設定のネットワーク詳細で確認します。

例えばサーバーが `192.168.1.50` なら、同じ LAN の iPad の Safari で次を開きます。

```text
http://192.168.1.50:8769/
```

IP は自分の環境に置き換えてください。iPad の `127.0.0.1` は iPad 自身です。`0.0.0.0` は待ち受け用で、アクセス先ではありません。Windows ファイアウォールでは使用する信頼済みプライベートネットワークへのアクセスを許可します。ルーターのインターネット側ポート開放は不要です。この Python サーバーは信頼済み LAN での展示用に使い、公開本番サービスには使用しません。[Python 公式資料](https://docs.python.org/3/library/http.server.html)

## 4. iPad の操作

1. 横画面を推奨。Safari の共有メニュー → ホーム画面に追加すると開きやすくなります。
2. 右上 `···` で 1 番線（外側）／2 番線（内側）を選びます。
3. 地域 → 分類 → 路線 → 車両を選び、参考便か任意の時刻・行先・模型両数を設定します。
4. スクロール案内は日本時間の直近便か、指定した模型時刻を基準にできます。
5. 全画面・画面常時点灯はブラウザーと安全なコンテキストの対応次第です。LAN の HTTP で Wake Lock が使えない場合は iPad の自動ロックを手動調整できます。通常表示は可能です。

ホーム画面に追加してもオフラインキャッシュは作られません。本版に Service Worker はありません。サーバーを起動し続け、再読込や再起動時に接続できるようにしてください。

## 5. 保存・更新・データ

設定は現在のブラウザーのローカルストレージに保存します。サイトデータ削除、プライベートブラウズ終了、端末・IP・ポート・HTTP／HTTPS の変更では同じ設定を読めない場合があります。IP を固定し、`导出设置备份` でバックアップを保存すると便利です。現在は JSON 書き出しのみで、GUI 読込や端末間同期はありません。

Git で取得した場合はルートで `git pull --ff-only` を実行します。自分の変更がある場合は保存・整理してから更新してください。ZIP なら新しいフォルダーへ再展開します。更新後はページを再読込し、時刻と編成を確認してから参考便を適用します。

V7 は 17,184 件の参考データで、2026-10-25（日）JST に固定です。233 プリセットで明記した範囲の終日分を収録、0 件は未完です。形式間で便を共用するため総数は実列車数ではありません。運転日確認は別表示です。`http://サーバーIP:8769/timetable.html` は絞り込みとページ切替に対応します。既存設定は保持され、新規既定便は「四行套用默认参考班次」で適用できます。

## 6. Linux 自動起動（任意）

systemd を使用する Raspberry Pi／Orange Pi Linux 向けです。**リポジトリのルート**で `whoami` と `pwd` を実行して、一般ユーザー名と絶対パスを記録します。

```sh
sudo nano /etc/systemd/system/n-gauge-board.service
```

次を保存します。`YOUR_USER` と 2 箇所の `/home/YOUR_USER/N-gauge-web-platform` は実際の値に置き換えます。`which python3` が別のパスなら `ExecStart` も修正してください。この例では空白を含まないパスを使います。

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

同じポートで手動起動中のサーバーを停止してから実行します。

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now n-gauge-board.service
systemctl status n-gauge-board.service
journalctl -u n-gauge-board.service -n 30 --no-pager
```

更新後の再起動は `sudo systemctl restart n-gauge-board.service`。自動起動を解除する場合：

```sh
sudo systemctl disable --now n-gauge-board.service
```

## 7. トラブル対処とチェック

| 症状 | 確認すること |
|---|---|
| ファイル一覧／404 | ルートで実行し、`dist/index.html` と `--directory dist` を確認 |
| PC のみ表示、iPad は不可 | `0.0.0.0`、IP、ポート、ファイアウォール、Wi-Fi 端末隔離やゲストネットワークを確認 |
| Address already in use | 旧サーバーを止めるか `8770` などに変更。URL も変更し、別ポートでは設定保存先も別になることに注意 |
| 設定が消えたように見える | IP・ポート・プロトコル・ブラウザー・プライベートモードを確認 |
| 時計が現地時間と違う | 基準は JST。資料日は 10/25 固定で、案内は模型時計にも切替可能 |
| 1 形式に 1～2 便だけ | 本版は代表便のデータで、終日ダイヤではない |
| 編集画面が中国語 | 現在の仕様。三言語文書は UI 言語切替ではない |

開発用チェックには [Node.js のサポート対象 LTS](https://nodejs.org/en/download) を用意し、ルートで `npm test` を実行します。依存パッケージの導入は不要です。`node` のみ使える場合：

```sh
node tools/check-timetable.cjs
node tools/check-special.cjs
node tools/check-ticker.cjs
```

これらはデータとモデルロジックのチェックです。実機 iPad Safari のタッチ操作・互換性確認の代わりにはなりません。


## V8 音声とテーマ

画面設定から全画面テーマを選択します。列車名を押すと手動再生、自動再生は音声の有効化と自動設定が必要です。日本時刻と4行を照合し、同じ分は外周→内周で順に再生します。再読込後は再タップが必要で、バックグラウンド・ロック中は停止する場合があります。過ぎた分は再生しません。端末の日本語音声合成を使用し、原駅の録音ではありません。


### N scale · V9

各列車の「对应N比例车型」でメーカー品番・セット両数・公式資料を確認し、品番をコピーできます。車両変更に追従し、両数や便の設定は変更しません。`data/nscale-products.json` を編集した場合は `npm run build:nscale` を実行し、`dist/` 全体を配信してください。


## V10

設定は「列车／屏幕／声音」の3タブです。「列车」でホームと先発／次発を選びます。Nゲージ製品ボタンはメーカー資料へ移動し、フッターのリンクから絞り込み可能な全製品一覧を開けます。更新時は dist 全体を置き換え、再読み込みしてください。保存済みの編成・時刻・行先を維持します。



## V11

「快速找车」で形式・列車名・路線を横断検索できます。各メーカーの「编成搭配」は基本／増結の確認済み組合せを示し、品番をまとめてコピーできます。図は箱ごとの模式図で実際の号車順ではありません。製品一覧では組合せのある車両に絞れます。品番未掲載品は商品名と公式資料で案内し、最小半径と条件付き曲線等級は区別します。



## V12

全製品一覧の「套装与曲线条件」で基本／増結などを絞れます。R282／R315は当該製品の公式最小半径の数値だけを比較し、条件付き記述や数値不明品を含めません。条件タグを個別に解除し、検索リンクを共有できます。

「导出品号清单」は絞込み結果の全ページをCSVに出力し、同じメーカー・品番をまとめます。品番未確認品は空欄です。表計算ソフトでは品番列をテキストとして読み込んでください。

PCからiPadへは「屏幕」→「设置备份与迁移」でJSONを書き出し、ファイルを転送して「导入设置备份」で読み込みます。4列車のプレビューを確認し「应用这份备份」を押すまで現在の設定は変わりません。音声は再度有効化してください。同じページ内の「恢复导入前设置」で読込み前に戻せますが、再読込み後はこの一時スナップショットは残りません。元JSONも保存してください。ファイルはブラウザ内で読み取ります。


## V13

画面設定または模型目録右上の大きな文字ボタンで文字サイズを変更できます。端末固有の設定で、列車設定JSONには含まれません。
