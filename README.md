# Bio Cover (Node.js + Vercel)

Проект теперь запускается как **Node.js (Express)** и нормально работает на Vercel без 404.

## Что менять
Открой `config.js` и поменяй:
- `name`, `tagline`
- ссылки (discord/roblox/telegram/spotify/tiktok)
- `trackTitle`
- `openLink`

## Аватар
Заменяй `public/ava.png` на свою картинку (лучше квадрат 512×512).

## Музыка
Положи файл в `public/`:
- `song.mp3` (основной вариант)
- или `song.ogg`
- или `song.wav`
- или `song.m4a`

Сайт сам выберет первую найденную из списка в `config.js`.

⚠️ Автозвук часто блокируется на iPhone/Chrome — поэтому есть интро-экран (вход по клику).

## Локальный запуск
```bash
npm i
npm run dev
```
Открой `http://localhost:3000`.

## Деплой на Vercel
1) Загрузи проект на GitHub.
2) Import в Vercel.
3) Framework Preset: **Other**.
4) Build Command: пусто.
5) Output Directory: пусто.

Vercel будет использовать `vercel.json` и `api/index.js`.

## Важно про пути
Ассеты лежат в `public/`, поэтому в HTML пути вида `public/ava.png`.
