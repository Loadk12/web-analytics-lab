# Линия Данных - учебный сайт для курса «Веб-аналитика»

Статический многостраничный сайт небольшой digital/web-студии. Проект сделан без фреймворков, сборщиков и backend: только HTML5, CSS3 и vanilla JavaScript.

## Структура проекта

```text
.
├── index.html
├── services.html
├── projects.html
├── blog.html
├── article.html
├── about.html
├── contacts.html
├── thanks.html
├── 404.html
├── css/
│   └── styles.css
├── js/
│   └── analytics.js
└── assets/
    ├── downloads/
    │   └── web-analytics-brief.pdf
    └── images/
        └── studio-workspace.png
```

## Локальный запуск

Сайт можно открыть напрямую через `index.html`.

Для проверки в локальном сервере:

```bash
python -m http.server 8000
```

После запуска откройте `http://localhost:8000/`.

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub и загрузите в него все файлы проекта.
2. Откройте `Settings` → `Pages`.
3. В разделе `Build and deployment` выберите публикацию из ветки, например `main`, папка `/root`.
4. Сохраните настройки и дождитесь появления адреса сайта.

Все пути в проекте относительные, поэтому сайт корректно работает из подпапки проекта, например `/web-analytics-lab/`.

## Места для счетчиков

В каждом HTML-файле оставлены явные комментарии:

- `YANDEX_METRICA_PLACEHOLDER_START` / `YANDEX_METRICA_PLACEHOLDER_END` - основной код Яндекс.Метрики.
- `LIVEINTERNET_COUNTER_PLACEHOLDER_START` / `LIVEINTERNET_COUNTER_PLACEHOLDER_END` - счетчик LiveInternet.
- `RAMBLER_TOP100_COUNTER_PLACEHOLDER_START` / `RAMBLER_TOP100_COUNTER_PLACEHOLDER_END` - счетчик Rambler/Top-100.
- `MAILRU_RATING_COUNTER_PLACEHOLDER_START` / `MAILRU_RATING_COUNTER_PLACEHOLDER_END` - счетчик Рейтинга Mail.ru.
- `YANDEX_METRICA_INFORMER_PLACEHOLDER_START` / `YANDEX_METRICA_INFORMER_PLACEHOLDER_END` - видимый информер Яндекс.Метрики.
- `YANDEX_METRICA_NOSCRIPT_PLACEHOLDER_START` / `YANDEX_METRICA_NOSCRIPT_PLACEHOLDER_END` - место под noscript-часть Метрики или дополнительный видимый блок.

В футере есть отдельная область для видимых информеров и изображений счетчиков.

## Аналитические события

События реализованы в `js/analytics.js`. Пока они логируются в консоль и записываются в `window.webAnalyticsLayer`.

- `cta_click` - клик по CTA-кнопкам.
- `service_click` - клик по карточке услуги.
- `project_click` - клик по карточке проекта.
- `download_brief` - скачивание PDF-брифа.
- `external_link` - переход по внешней ссылке.
- `form_start` - первое взаимодействие с формой.
- `form_submit` - стандартная отправка формы.
- `scroll_50` - достижение примерно 50% глубины страницы.
- `scroll_90` - достижение примерно 90% глубины страницы.

Внутри `trackAnalyticsEvent` оставлена точка подключения будущего вызова Яндекс.Метрики через `ym(..., "reachGoal", ...)`.
