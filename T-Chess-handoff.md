# T-Chess — документация для разработчика и агентов

T-Chess — набор веб-прототипов шахматного марафона. В GitHub зафиксированы накопительный прогресс, пять задач дня со шторкой и экраном успеха, экран подарка и два адаптивных экрана. Исходные спецификации содержат графику, геометрию и motion. Этот документ связывает их с текущим кодом, проверками и решениями, которые нужны перед переносом в приложение.

Срез от 28 ноября 2026 года. Снимок исходников из ветки `main` на коммите `08991e55aa731b7e8b237cca8fb0f1696ee0dfeb`. В истории 64 коммита за 16–25 ноября по Москве. В доступном репозитории одна ветка, тегов, issues и pull requests не найдено. [Снимок репозитория](https://github.com/folamhmark/T-Chess/tree/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb) · [История main](https://github.com/folamhmark/T-Chess/commits/main/)

## Карта папок

| Папка | Содержимое |
| --- | --- |
| [`adaptivy/`](adaptivy/) | Стенд сравнения размеров. В `chess-marathon/onboarding/` лежит онбординг, в `chess-marathon/game/` — экран урока. `index.html` и `game.html` открывают соответствующие превью. |
| [`daily-tasks-animation/`](daily-tasks-animation/) | Пять задач дня, счётчик, бабл, шторка «Верный ход» и финальный экран успеха. Здесь же ассеты и спецификация переходов. |
| [`gift-appearance/`](gift-appearance/) | Экран награды «Кэшбэк в подарок — ваш», сценарий раскрытия, исходные ассеты, карта слоёв Figma и спецификация. |
| [`motion/`](motion/) | Общий `success-reveal.js` для снежного раскрытия подарка и финала задач дня. |
| [`progress-bar-animation/`](progress-bar-animation/) | «Путь к призам», шкала 0–20 активных дней, поэтапные переходы и спецификация всех состояний. |

## Страницы и исходники

| Экран | Открыть | Реализация и документация |
| --- | --- | --- |
| «Путь к призам» | [Демо](https://folamhmark.github.io/T-Chess/progress-bar-animation/) | [Исходники](https://github.com/folamhmark/T-Chess/tree/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation) · [Спецификация](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md) |
| «Задачи дня» и экран успеха | [Демо](https://folamhmark.github.io/T-Chess/daily-tasks-animation/) | [Исходники](https://github.com/folamhmark/T-Chess/tree/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation) · [Спецификация](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/specification.md) |
| «Кэшбэк в подарок — ваш» | [Демо](https://folamhmark.github.io/T-Chess/gift-appearance/) | [Исходники](https://github.com/folamhmark/T-Chess/tree/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance) · [Спецификация](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/specification.md) |
| Онбординг марафона | [Сравнение размеров](https://folamhmark.github.io/T-Chess/adaptivy/) | [Экран](https://github.com/folamhmark/T-Chess/tree/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/onboarding) · [Правила адаптации](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/README.md) |
| «Игра» / «Урок 1. Ход ладьи» | [Сравнение размеров](https://folamhmark.github.io/T-Chess/adaptivy/game.html) | [Экран](https://github.com/folamhmark/T-Chess/tree/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/game) · [Правила адаптации](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/README.md) |

В каждом из трёх интерактивных демо `index.html` задаёт структуру, `styles.css` — оформление, `app.js` — состояние и сценарий. Снег и анимация появления для подарка и финала задач находятся в общем `motion/success-reveal.js`. Сравнение размеров использует `adaptivy/preview.js` и `preview.css`, сами экраны загружаются в iframe. [Общий модуль](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/motion/success-reveal.js) · [Рамки превью](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/preview.js)

### Локальный запуск

```sh
git clone https://github.com/folamhmark/T-Chess.git
cd T-Chess
git checkout 08991e55aa731b7e8b237cca8fb0f1696ee0dfeb
python3 -m http.server 3000
```

Откройте на `http://localhost:3000` маршруты `/progress-bar-animation/`, `/daily-tasks-animation/`, `/gift-appearance/`, `/adaptivy/` и `/adaptivy/game.html`. Запускайте сервер из корня, чтобы у подарка и задач был доступ к общему модулю. Стек — статические HTML, CSS и JavaScript. Anime.js 3.2.2 лежит локально рядом с каждым интерактивным демо и распространяется по MIT. Сборка и пакетный менеджер не требуются. В корневом README также есть отдельная ссылка на опубликованное демо прогресса. [README репозитория](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/README.md) · [Лицензия Anime.js](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/vendor/ANIME-LICENSE.md)

## Прогресс марафона

«Путь к призам» показывает 0–20 накопленных активных дней. По правилам из спецификации урок или задача дня могут дать один активный день за календарные сутки. Солнце активируется на 1-м дне, подарок — на 10-м, кубок — на 20-м. Нижняя подпись зависит от признака `todayCredited`. Например, накопленный прогресс может быть 10, а подпись на следующий день — «Сегодняшний день не засчитан». Синяя подпись засчитанного дня использует `#428BF9`. [Правила и состояние дня](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L23)

| Накоплено | Слева направо |
| --- | --- |
| 0–9 | Солнце → 8 отдельных точек дней 2–9 → подарок → свёрнутая серая группа дней 11–19 → кубок |
| 10–20 | Солнце → свёрнутая синяя группа дней 2–9 → подарок → 9 отдельных точек дней 11–19 → кубок |
| 20 | Активный кубок и все 9 синих точек после подарка. Раскладка второй группы сохраняется |

Обычная точка 8 × 8 px. Компактная группа занимает 20 px и состоит из трёх точек 4 × 4 px с зазорами 4 px. Иконки 32 × 32 px. Равномерный зазор считается между элементами ряда, компактная группа считается одним элементом. На переходе 9→10 первые точки съезжаются к репрезентативным дням 2, 5 и 9, вторые раскрываются из дней 11, 15 и 19. Эталонный ряд 303 × 32 px. [Геометрия и матрица 0–20](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L114) · [Функция layout](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/app.js#L21)

- Стенд стартует с 2→3. Доступны 0→1, 2→3, 9→10, 10→11 и 19→20. Нажатия «Засчитать день» и на карточку урока имитируют зачёт. Выбор сценария или сброс ставит исходное значение и плавно возвращает геометрию за 440 мс. Кнопка `?` открывает правило зачёта, Escape и нажатие снаружи закрывают подсказку. [Демо-управление](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/app.js)
- При зачёте новый маркер сжимается до 90% за 150 мс и возвращается к 100% к 800 мс, одновременно меняя цвет. Число и нижняя подпись меняются на 430 мс и становятся полностью видимыми к 710 мс. Раскладка 9→10 перестраивается на 210–950 мс. Обычный переход занимает 1000 мс, этапы 1, 10 и 20 — 1180 мс. Демо-замедление умножает таймлайн зачёта на три. Reduced motion сразу применяет итог и доступное значение прогресса. [Таймлайн](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L294) · [Прерывание и доступность](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L444)

Для интеграции спецификация предлагает получать подтверждённый снимок `activeDays`, `todayCredited`, `revision`, `creditEventId`, дату и границу суток. Первый показ отображает готовый снимок. Motion проигрывается один раз для нового подтверждённого события `N → N+1`. При дубликате остаётся текущее состояние, при коррекции или скачке применяется актуальный снимок без очереди анимаций. Статус награды приходит из продуктового источника. [Контракт данных](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L41) · [Матрица обновлений](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L268)

## Задачи дня

Демонстрация начинается с первой задачи, полного текста и 0% заполнения. Номер текущей задачи `current` меняется независимо от зачтённого количества `completed`. «2 из 5» может означать прогресс 20% при входе во вторую задачу и 40% после открытия её результата. Дорожка 140 × 8 px, один зачёт добавляет 28 px, заполнение однотонное `#428BF9`. Дата «17 августа» и задачи 2–5 — данные стенда. [Данные и тексты](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/specification.md#L37) · [Разметка](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/index.html)

| Событие | Что происходит |
| --- | --- |
| «Завершить задачу» | Фиксируются текущие цифра и текст, `completed = current`, растёт прогресс, открывается «Верный ход». Повторное открытие блокируется, пока шторка активна |
| Escape на шторке | Шторка закрывается. Сохраняются текущая задача и уже зачтённый прогресс |
| «Ого, погнали дальше» на задачах 1–4 | Шторка закрывается, следующая задача получает новый номер и текст, зачёт сохраняется |
| «ОК» на задаче 5 | Шторка закрывается, пингвин ныряет за снег, появляется экран «Задача дня решена!» |
| «Коснитесь, чтобы продолжить» | После появления действия на экране успеха можно вернуться к задаче 1 и 0% |
| Цифры 1–5, повтор, подсказка | Выбор номера выставляет `n−1` зачтённых. Повтор и подсказка воспроизводят переход с сохранением прогресса. «Повторить финал» открывает результат пятой задачи |

Модель живёт в памяти страницы. Открытие шторки при смене задачи засчитывает логический `current` на момент нажатия. После открытия фокус переходит на продолжение, после обычного закрытия — на «Завершить задачу». В финале фокус переходит на заголовок успеха. Экран результата — `role=dialog`; чекбокс ×3 остаётся доступным. [Состояния и действия](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/specification.md#L111) · [Реализация переходов](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/app.js#L67)

### Тайминги задач дня

| Элемент | Время при ×1 |
| --- | --- |
| Цифра | Старая уходит 0–180 мс, новая входит 130–520 мс. «из 5» остаётся на месте |
| Бабл и хвост | Уход 0–110 мс. Подъём 110–380 мс, Y +5 → −0,8 px, scale .975 → 1.009. Возврат в покой 380–550 мс. Opacity 0→1 на 110–320 мс |
| Текст | Первая буква начинает проявляться на 215 мс. 240 мс на букву, сдвиг старта 18 мс, blur 1,2→0 px. Итоговые строки заранее занимают место |
| Прогресс | 620 мс к новому значению |
| Шторка | Открытие 460 мс, закрытие 260 мс. Сдвиг до 178 px, фоновая сцена остаётся видимой |
| Финал пятой задачи | Шторка закрывается на 0–260 мс параллельно нырку пингвина 0–480 мс на 100 px. Сцена уходит в белый на 480–900 мс. Белая пауза 900–1400 мс, затем снежное раскрытие 1400–4680 мс |
| Действие на финале | Доступно с 4000 мс. Полный финал при ×3 — 14 040 мс |

Текущая амплитуда бабла соответствует коммиту 25 ноября. В первой реплике по буквам открываются экспортированные контуры Figma. Reduced motion сразу показывает целевые состояния при запуске. При включении reduce во время уже идущего открытия или закрытия шторки её движение может продолжиться. Шторка в демо работает без ловушки фокуса. У длинных локализованных реплик и увеличенного текста остаётся отдельная проверка в целевом приложении. [Тайминги и доступность](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/specification.md#L163) · [Финальная настройка бабла](https://github.com/folamhmark/T-Chess/commit/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb)

Графические референсы. [Задача 2053:40854](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=2053-40854) · [Экран результата 775:80218](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=775-80218) · [Шторка 122:53911](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=122-53911) · [Экран успеха 2053:34783](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=2053-34783)

## Подарок и общее снежное раскрытие

Экран подарка начинает проигрывание после подготовки изображений. Каждый повтор запускается с чистого белого экрана на 500 мс. Дальше идёт общий эффект на 3280 мс. Повтор доступен с внешней кнопки или нажатием на подарок. На узком экране композиция масштабируется относительно 375 px, на коротком доступна вертикальная прокрутка. Графика, контурные надписи и координаты привязаны к оригинальным слоям. [Figma 316:22740](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=316-22740) · [Манифест слоёв](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/assets-manifest.json) · [Спецификация подарка](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/specification.md)

| Фаза | Время от начала запуска подарка |
| --- | --- |
| Белая пауза | 0–500 мс, затем `gift:animationstart` |
| Начало движения | ~580 мс. Подарок движется из Y +48 px / scale .88 до Y −6 px / 1.035, затем возвращается в покой к 1720 мс |
| Стирание белой маски | 580–2520 мс |
| Заголовок | 2220–2780 мс |
| Подпись | 2340–2840 мс |
| «Забрать приз» | 2560–3100 мс, доступна с 3100 мс |
| «На главную» | 2680–3180 мс, доступна с 3180 мс |
| Очистка Canvas и завершение | 3780 мс |

Модуль `window.successReveal` создаёт отдельный экземпляр на экран через `create()`. Оба экрана используют Canvas 2D, семь мягких диагональных проходов `destination-out`, кисть 36% высоты и до 300 снежинок за запуск. Положение рождения рассчитывается на границе кисти, затем у частиц собственная траектория. Жизнь 1000–1500 мс, диаметр 2,8–9 px при ширине 375 px. Внутренний DPR ограничен 2. `stop()` останавливает timeline и очищает Canvas, `finish()` также ставит конечные стили. Подарок держит белый экран внешним таймером, финал задач передаёт `leadIn` в общий timeline и использует тот же эффект с поддержкой ×3. [Код общего эффекта](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/motion/success-reveal.js) · [Параметры кисти и физика](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/specification.md#L90)

`window.giftAppearance` предоставляет `ready`, `replay()`, `finish(reason)`, `isPlaying`, `timeline`, `particleCount` и ссылки на слои. `ready` означает, что ассеты подготовлены и сценарий запущен. Повтор отменяет предыдущий запуск. Уход вкладки в фон, изменение ширины и включение reduce показывают конечный кадр. При начальном reduce или отсутствии Anime.js показывается статичный экран. [Управление подарком](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/app.js)

«Забрать приз» отправляет всплывающее событие `gift:claim` с `{ milestone: 10, rewardType: 'cashback' }`. Это сигнал нажатия. В демо он может повторяться, денежной операции за ним нет. `gift:animationend` передаёт `{ reason }`. Ссылка «На главную» ведёт в корень GitHub Pages проекта. [События и белая пауза](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/specification.md#L154)

## Адаптация онбординга и урока

Превью показывает реальные viewport в iframe. Пресеты — 375 × 812, 414 × 896, 375 × 667 и 320 × 568 px. «Свой размер» принимает ширину 280–720 px и высоту 360–1200 px. Нативное приложение берёт системные зоны из платформенной safe area. Общий шрифтовой слой предпочитает локальный SF Pro, при его отсутствии доступен Inter 4.1 с кириллицей по OFL. [Правила и размеры](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/README.md) · [Общие шрифты](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/fonts.css)

### Онбординг

Базовый кадр 375 × 812 px. На 375 px и шире текстовые поля по 24 px, заголовок и описание 30/17 px. На 320 px поля по 20 px и кегли 24/16 px, промежуточные значения интерполируются. В превью вес заголовка 650. Иллюстрация сохраняет масштаб при одинаковой ширине, компактная высота обрезает часть свободной области и снега. Переход иллюстрации в белый привязан к уровню снега. `spacing.js` через ResizeObserver рассчитывает остаток высоты. Три межблочных зазора получают по одной доле, два зазора вокруг CTA — по две. При достаточной высоте это 10 и 20 px. CTA с полями 16 px и высотой от 56 px остаётся внизу, при нехватке места прокручивается центральная область. Кнопки показывают состояния нажатия. [Стили и формулы](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/onboarding/screen.css) · [Расчёт вертикальных зазоров](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/onboarding/spacing.js) · [Онбординг 118:23890](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=118-23890) · [Референс размеров 40000059:652](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=40000059-652)

### Урок

| Размер или условие | Поведение |
| --- | --- |
| 375 × 812 / 414 × 896 | Поля 16 px. Доска 343 / 382 px квадратом, пингвин 139 px, нижние кнопки 72 px |
| 375 × 667 | Верхний статус-бар 20 px и панель навигации 44 px. В карточке по 12 px сверху и снизу, пингвин 104 px, кнопки 56 px. Доска 343 × 343 px |
| Ширина ≤340 px **или** высота ≤610 px | Пингвин и хвост бабла скрываются, бабл занимает доступную ширину, нижние кнопки 48 px |
| Ширина ≤340 px **и** высота ≤610 px | Общие поля карточки, бабла, доски и управления по 24 px. Карточка с радиусом 16 px и без надзаголовка, заголовок 18/22 px. На 320 × 568 доска 272 × 272 px с отступом 10 px от бабла |
| Классический статус-бар | При ширине ≤340 px или высоте ≤744 px: высота 20 px, время по центру, сеть и Wi-Fi слева, батарея справа. Назад занимает зону 44 × 44 px в панели ниже |

На экране «Урок 1. Ход ладьи» позиция фигур задана SVG. Подсказка ссылается на бабл, переходы по шахматной истории отключены. [Стили по брейкпойнтам](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/game/screen.css) · [Исходная разметка урока](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/adaptivy/chess-marathon/game/index.html) · [Урок 118:23931](https://www.figma.com/design/AjN75rJn2AFTKCodA15ef8/?node-id=118-23931)

## Решения для интеграции

GitHub фиксирует веб-экраны и поведение стендов. Интеграция начинается с продуктовых источников данных и подтверждённых событий, на которые подписывается клиент.

| Область | Что требуется определить |
| --- | --- |
| Календарь марафона | Часовой пояс и граница суток, период участия, eligible-уроки и задачи, правила позднего и офлайн-зачёта |
| Задачи и уроки | Источник позиций и текстов, проверка хода, сохранение и восстановление сессии, ошибка и повтор, последовательность экранов при выходе и возврате |
| Награды | Eligibility, выдача, активация, повторный запрос, отказы, статус после таймаута и маршрут после получения |
| Навигация | Действие «Начать марафон», вход в урок, переход с 10-го дня к экрану подарка, маршрут с экрана успеха задач и действие после завершения марафона |
| Сетевые состояния | Загрузка без снимка, ошибка, показ последнего валидного снимка, синхронизация между устройствами и обработка устаревшей версии |
| Доступность и аналитика | Семантика и фокус шторки, системный размер текста, тексты для локализации. События подтверждённого зачёта, показа результата, продолжения и закрытия требуют подключения |

Для задач спецификация предлагает `sessionId`, `taskId`, индекс и общее число, `prompt`, позицию доски, статус результата и множество `completedTaskIds`. Прогресс считается от подтверждённых уникальных задач. Повтор подтверждения той же операции сохраняет результат. Для приза нужен продуктовый контракт выдачи, с которым клиент сверяет статус при повторе или таймауте. Доступность кнопок, progress bar и окончание motion выполняют интерфейсную роль. [Открытые решения прогресса](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L597) · [Контракт задач и аналитика](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/specification.md#L314) · [Интеграция подарка](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/specification.md#L154)

## Проверка и приёмка

Локально на указанном коммите эти проверки пройдены в Chromium. Все пять публичных маршрутов ответили HTTP 200. Шесть проверенных опубликованных файлов с ключевой логикой и стилями побайтно совпали с GitHub: JS трёх демо, общий эффект, CSS урока и скрипт интервалов онбординга.

| Область | Что проверено |
| --- | --- |
| Прогресс | Все пять переходов с reduced motion. Полный 9→10 с обновлением ARIA, активацией 10-го маркера и схлопыванием пяти лишних точек |
| Задачи дня | Рост прогресса, закрытие по Escape с сохранением зачёта, переходы 1–4, анимированный финал 5-й задачи и сброс на задачу 1 через экран успеха |
| Подарок | Белая пауза и тайминг события старта, обычное и ручное завершение, очистка частиц, payload `gift:claim`, доступность кнопки после конца и статичный режим reduce |
| Онбординг и урок | Четыре заданных размера без вертикального переполнения, смена собственного размера. Доска квадратная во всех четырёх пресетах, 272 × 272 px в самом компактном |
| Загрузка | В сценариях проверки отсутствовали необработанные JS-ошибки и ответы 4xx/5xx |

Для приёмки переноса сверить визуальное совпадение с указанными кадрами Figma и точные тайминги из спецификаций. Отдельно проверить на целевой платформе быстрые повторные действия, смену ориентации, фон и возврат, переключение reduce во время анимации, системное увеличение текста и screen reader. Для Canvas-эффекта требуется замер производительности на физическом iPhone и в мобильном Safari. Текущая проверка покрывает автоматические браузерные сценарии и геометрию. [Приёмка прогресса](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/progress-bar-animation/specification.md#L541) · [Приёмка задач](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/daily-tasks-animation/specification.md#L279) · [Приёмка подарка](https://github.com/folamhmark/T-Chess/blob/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb/gift-appearance/specification.md#L187)

## Текст для передачи агенту

```text
Задача: продолжить разработку T-Chess по конкретному тикету.
Базовый репозиторий: https://github.com/folamhmark/T-Chess
Снимок: 08991e55aa731b7e8b237cca8fb0f1696ee0dfeb

Прочитай раздел handoff по своему экрану и его исходную спецификацию.
Запусти python3 -m http.server 3000 из корня репозитория.
Воспроизведи сценарий действующего демо до изменений.
Сохрани согласованные состояния, слои, геометрию и motion в рамках тикета.

Если задача затрагивает подарок или финал задач дня, проверь оба
сценария общего motion/success-reveal.js. Для онбординга и урока
проверь 375×812, 414×896, 375×667 и 320×568.
Для прогресса проверь 9→10, reduced motion и повтор. Для задач дня
проверь сохранение зачёта при закрытии результата и финал задачи 5.

Продуктовый API, календарь, выдачу призов, маршруты после финалов и
восстановление подтверждённого прогресса уточняй по тикету и контрактам.
Контролы стенда служат для демонстрации. При обнаружении расхождения
между тикетом, спецификацией и кодом укажи коммит и конкретный сценарий.

В отчёте перечисли файлы, пройденные сценарии и открытые вопросы,
которые влияют на приёмку.
```

## История работ

| Дата по Москве | Коммитов | Изменения |
| --- | --- | --- |
| 16 ноября | 18 | Создан репозиторий и прототип «Путь к призам», добавлена матрица состояний. Подарок перенесён из Figma, а снежный хлопок прошёл несколько итераций до зигзагообразного стирания и независимого полёта снежинок. [97ec28a](https://github.com/folamhmark/T-Chess/commit/97ec28a0fcc6a590f60a877da9d7e6df7aab35bc) · [34da3d8](https://github.com/folamhmark/T-Chess/commit/34da3d88cf854dab8bb545ac127a4bd7e4d7987e) · [4dd7aa5](https://github.com/folamhmark/T-Chess/commit/4dd7aa5adb755e3580e16e246edd9e2c7cfd6323) |
| 17 ноября | 23 | Описан эффект подарка, добавлена белая пауза 500 мс. Появились задачи дня, шторка, однотонный анимированный прогресс, GitHub Pages и подробная спецификация. [6996434](https://github.com/folamhmark/T-Chess/commit/69964344) · [995f03a](https://github.com/folamhmark/T-Chess/commit/995f03a4) · [5dce15c](https://github.com/folamhmark/T-Chess/commit/5dce15c0) |
| 19 ноября | 12 | Добавлен финал задач с нырком, экран успеха, переиспользование снежного раскрытия. Восстановлены контуры текста задач и шторки. Появился адаптивный онбординг с локальным SF Pro и Inter. [4635a9c](https://github.com/folamhmark/T-Chess/commit/4635a9c6) · [b3435e1](https://github.com/folamhmark/T-Chess/commit/b3435e15) · [1862c18](https://github.com/folamhmark/T-Chess/commit/1862c184) · [759c88d](https://github.com/folamhmark/T-Chess/commit/759c88d2) |
| 20 ноября | 9 | Смягчён переход иллюстрации онбординга в белый, добавлены размеры урока, выровнены поля, уточнены классический статус-бар, верхняя навигация и компоновка компактных экранов. Зазоры онбординга стали пропорциональными. [9e0c9d1](https://github.com/folamhmark/T-Chess/commit/9e0c9d13) · [a7f4e51](https://github.com/folamhmark/T-Chess/commit/a7f4e51c) · [72adbbc](https://github.com/folamhmark/T-Chess/commit/72adbbcf) · [b12f1e1](https://github.com/folamhmark/T-Chess/commit/b12f1e1f) |
| 25 ноября | 2 | Пружинящий вход бабла добавлен и смягчён до текущей амплитуды −0,8 px и масштаба 1,009. [e3c1d8a](https://github.com/folamhmark/T-Chess/commit/e3c1d8a482fdf3e7cd097e955ce1ae14e2c51eba) · [08991e5](https://github.com/folamhmark/T-Chess/commit/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb) |

### 16 ноября 2026

- 14:45 · [97ec28a](https://github.com/folamhmark/T-Chess/commit/97ec28a0fcc6a590f60a877da9d7e6df7aab35bc) · Initial commit
- 14:46 · [cfd2f66](https://github.com/folamhmark/T-Chess/commit/cfd2f667f74714e4000371e92e5c57adc53ec781) · Add interactive chess marathon progress prototype
- 15:43 · [a816fcd](https://github.com/folamhmark/T-Chess/commit/a816fcdca47ea7a09d3cefaa6d159e2795f64d75) · Organize progress animation in a folder and add implementation specification
- 15:55 · [95eef13](https://github.com/folamhmark/T-Chess/commit/95eef13790ff839f7fdd89d994553939b15bc152) · Use English folder and specification names
- 17:19 · [34da3d8](https://github.com/folamhmark/T-Chess/commit/34da3d88cf854dab8bb545ac127a4bd7e4d7987e) · Expand progress animation specification with full states and timing contract
- 21:57 · [1fc61e0](https://github.com/folamhmark/T-Chess/commit/1fc61e0b1ae58217e9047de1be90fc0c5f33e676) · Add faithful gift appearance screen with original Figma artwork
- 22:11 · [7556385](https://github.com/folamhmark/T-Chess/commit/75563856c19ba29990a1838e2ec7cb096ca0834e) · Animate gift reveal and edge snow burst with Anime.js
- 22:12 · [56e9429](https://github.com/folamhmark/T-Chess/commit/56e9429b247e31f6aa62e3268a2c6a696206f344) · Version motion assets for GitHub Pages refresh
- 22:22 · [aaf4741](https://github.com/folamhmark/T-Chess/commit/aaf4741425b0cf864dce390972cbe6cb02209a8b) · Add dense fullscreen snow and playful staggered gift reveal
- 22:25 · [52a64b8](https://github.com/folamhmark/T-Chess/commit/52a64b81756b7ac8b628ba0b1c2ffe918144e240) · Lighten snow and tighten gift reveal timing
- 22:27 · [1aedd90](https://github.com/folamhmark/T-Chess/commit/1aedd9043ab02ef4ed4fbc3feb43a5ff20c37cd5) · Slightly reduce the white snow glow
- 22:30 · [a7f51ab](https://github.com/folamhmark/T-Chess/commit/a7f51abc89c16255ec10ceb47df39d348a22f9ad) · Keep snow haze barely visible without washing out the gift
- 22:39 · [21f0615](https://github.com/folamhmark/T-Chess/commit/21f06150665a61066fb439b040e3e4851dfe24bb) · Extend snow fade-out and restore a light glow
- 23:39 · [1939af5](https://github.com/folamhmark/T-Chess/commit/1939af5a487d70c89f5b03ab113800e3fd5f8092) · Reveal gift with a soft zigzag snow wipe instead of confetti
- 23:44 · [0a515cd](https://github.com/folamhmark/T-Chess/commit/0a515cd47ed54f617343f0c85e8cd4d25462f1e3) · Slow the snow wipe and add small flakes along its edge
- 23:50 · [87af357](https://github.com/folamhmark/T-Chess/commit/87af357bee83be765bcbdf862909fe4201b3c2bb) · Increase snowflakes along the wipe edge to 220
- 23:56 · [9a643d5](https://github.com/folamhmark/T-Chess/commit/9a643d5f3eb13885fab425feffc0d17eef5dcfbf) · Give snowflakes independent flight after leaving the wipe edge
- 23:58 · [4dd7aa5](https://github.com/folamhmark/T-Chess/commit/4dd7aa5adb755e3580e16e246edd9e2c7cfd6323) · Add larger snowflakes with longer independent falling motion

### 17 ноября 2026

- 00:05 · [6996434](https://github.com/folamhmark/T-Chess/commit/6996434471b32332ab051e4968f8688529ad025d) · Document the approved gift reveal animation specification
- 14:43 · [8bf5769](https://github.com/folamhmark/T-Chess/commit/8bf5769524e3302884e6b56de4f86b37940e23d8) · Add approved daily tasks prototype with Figma artwork and result sheet
- 14:43 · [2e95676](https://github.com/folamhmark/T-Chess/commit/2e956761c526d651cbdb64539ca269e93c816368) · Add daily task prototype styles.css
- 14:43 · [3190b3e](https://github.com/folamhmark/T-Chess/commit/3190b3e0cc72ce2419d5ce720b2af2ae29e046bd) · Add daily task prototype app.js
- 14:43 · [a010505](https://github.com/folamhmark/T-Chess/commit/a01050584068a112a6872902199c19c01409477a) · Add daily task prototype vendor/anime.min.js
- 14:43 · [e4cddb7](https://github.com/folamhmark/T-Chess/commit/e4cddb7d28bf616c854b0c0800ea89c2e2dea176) · Add daily task prototype vendor/ANIME-LICENSE.md
- 14:43 · [164c9e1](https://github.com/folamhmark/T-Chess/commit/164c9e18384da91a8f6a5f8db40c62c6b83933f2) · Add daily task prototype README.md
- 14:44 · [0cfa938](https://github.com/folamhmark/T-Chess/commit/0cfa938cc1933fe075ae0f54aebdf20ef826156a) · Link daily tasks animation prototype
- 14:50 · [f2d389d](https://github.com/folamhmark/T-Chess/commit/f2d389d30aec763f657c0b18c5cb83085468e1b5) · Animate completed-task progress: index.html
- 14:50 · [962e8d5](https://github.com/folamhmark/T-Chess/commit/962e8d5de6f37fdc23aad7f6958c518fdb5de627) · Animate completed-task progress: styles.css
- 14:50 · [2c6c838](https://github.com/folamhmark/T-Chess/commit/2c6c8388748bc96714a7b8c88390feff7e6b86d6) · Animate completed-task progress: app.js
- 14:50 · [dd8a302](https://github.com/folamhmark/T-Chess/commit/dd8a3029d42b6e1a4527f0ebff930441dbf25ac9) · Animate completed-task progress: README.md
- 14:56 · [a1184ec](https://github.com/folamhmark/T-Chess/commit/a1184ecc1de714ed2275e0000139b2772a1cf5ae) · Remove progress gloss and use GitHub Pages: index.html
- 14:56 · [f7cec8d](https://github.com/folamhmark/T-Chess/commit/f7cec8dc054ebfa3585de879574fccef7129dbae) · Remove progress gloss and use GitHub Pages: styles.css
- 14:57 · [a482615](https://github.com/folamhmark/T-Chess/commit/a4826152ac19e1869901f30b6a54f0da2ae33719) · Remove progress gloss and use GitHub Pages: app.js
- 14:57 · [5a92865](https://github.com/folamhmark/T-Chess/commit/5a928654ae8626d03c844d8f7d9cc532f1000134) · Remove progress gloss and use GitHub Pages: README.md
- 15:04 · [995f03a](https://github.com/folamhmark/T-Chess/commit/995f03a442df21e2279ee5ffc473facfe90bfb64) · Document daily tasks state, layout, motion and QA specification
- 15:05 · [a5bfbcc](https://github.com/folamhmark/T-Chess/commit/a5bfbcccd3876a5b5cb515b75cc73478e33b036c) · Link detailed daily tasks specification
- 15:10 · [ba6105e](https://github.com/folamhmark/T-Chess/commit/ba6105eff4034d02cc21465852d83c25504f3537) · Add 500ms white anticipation before gift animation: app.js
- 15:10 · [8da8e86](https://github.com/folamhmark/T-Chess/commit/8da8e86a015eefdcb2b7b742c877b55983c8da42) · Add 500ms white anticipation before gift animation: styles.css
- 15:10 · [0839b81](https://github.com/folamhmark/T-Chess/commit/0839b819a5ca0fcd706bf3837a2dc5e02e56324f) · Add 500ms white anticipation before gift animation: index.html
- 15:10 · [13d4b17](https://github.com/folamhmark/T-Chess/commit/13d4b17b93125c0505a2d14126a64e39621391d1) · Add 500ms white anticipation before gift animation: README.md
- 15:10 · [5dce15c](https://github.com/folamhmark/T-Chess/commit/5dce15c0d6ba58602ce0554806a7e9f355b84fd7) · Add 500ms white anticipation before gift animation: specification.md

### 19 ноября 2026

- 14:53 · [9db9d62](https://github.com/folamhmark/T-Chess/commit/9db9d628898ad4c94bafd3f83e97b3b5b435671f) · Animate the daily tasks finale
- 15:00 · [bfafea2](https://github.com/folamhmark/T-Chess/commit/bfafea238f52cb3ad6d7e94c462310f585aebae8) · Soften the daily tasks finale
- 15:11 · [4635a9c](https://github.com/folamhmark/T-Chess/commit/4635a9c64cbaef3a0f79d9efec6738abdf8bb422) · Reveal the daily task success screen
- 15:29 · [3127c79](https://github.com/folamhmark/T-Chess/commit/3127c790b7fa03b6a239ecacbd87f368f30a2bed) · Match first-task typography to Figma
- 15:39 · [b3435e1](https://github.com/folamhmark/T-Chess/commit/b3435e1547952d031eae662f45871a47ea223549) · Restore the result sheet typography
- 20:45 · [1862c18](https://github.com/folamhmark/T-Chess/commit/1862c184eae8001ebed020796a9a38405a5f5a07) · Add adaptive chess marathon onboarding preview
- 21:43 · [8f34608](https://github.com/folamhmark/T-Chess/commit/8f34608b2e154c93f23331e1eb4f6cfc8405431c) · Keep onboarding copy visible in short viewports
- 22:00 · [d1c0682](https://github.com/folamhmark/T-Chess/commit/d1c06827658aec4d96faca475606c32dced3b7b8) · Match onboarding typography and update device sizes
- 22:13 · [2987c34](https://github.com/folamhmark/T-Chess/commit/2987c34046d5d792193298fded046082f0d5c675) · Remove onboarding overflow and blend artwork edges
- 22:17 · [7aabdc6](https://github.com/folamhmark/T-Chess/commit/7aabdc6dd85edc5086b8abc6991baf8355e90ceb) · Lighten the onboarding headline
- 22:26 · [76a9cca](https://github.com/folamhmark/T-Chess/commit/76a9ccabf96442b99bf47b85b8187f5859c22ab9) · Use locally installed variable SF Pro in onboarding
- 22:38 · [759c88d](https://github.com/folamhmark/T-Chess/commit/759c88d2b7250b513db6ed337b7d47d1eb8caf86) · Detect the installed SF Pro face in the preview

### 20 ноября 2026

- 00:22 · [3f256a6](https://github.com/folamhmark/T-Chess/commit/3f256a65856bdad941eb62a925d4d69f29c2cd7f) · Soften the illustration fade into the white background
- 00:52 · [9e0c9d1](https://github.com/folamhmark/T-Chess/commit/9e0c9d13747ed73ad22c993aa4be41ba2b95c18e) · Add responsive chess lesson previews
- 00:59 · [ec72789](https://github.com/folamhmark/T-Chess/commit/ec727890694ffc20b59c6fe562a6f2864e648bb1) · Refine the compact 320px chess lesson layout
- 11:37 · [3c8d076](https://github.com/folamhmark/T-Chess/commit/3c8d0768b5cb66ba91dccf86d9940fc1c17c98ed) · Align compact game blocks to shared margins
- 11:58 · [21e6d23](https://github.com/folamhmark/T-Chess/commit/21e6d23a235b08d1137f49d7e7b9d5a75bec64cf) · Use a smaller corner radius on the compact lesson card
- 12:23 · [12c3b90](https://github.com/folamhmark/T-Chess/commit/12c3b90d0dd1f1affebe38c47f55e965e5b3bff3) · Align the top navigation on compact game previews
- 12:34 · [a7f4e51](https://github.com/folamhmark/T-Chess/commit/a7f4e51c14e4792141bb4b86ea165cf7759fc92e) · Correct the classic iPhone status bar in compact previews
- 16:05 · [72adbbc](https://github.com/folamhmark/T-Chess/commit/72adbbcf9627aa3ed0024c33dacdbb716ce83467) · Add breathing room to the 375×667 lesson card
- 16:36 · [b12f1e1](https://github.com/folamhmark/T-Chess/commit/b12f1e1ffa0abc2e336866a711c0ed0e8d3a197a) · Use proportional spacing on the onboarding screen

### 25 ноября 2026

- 14:30 · [e3c1d8a](https://github.com/folamhmark/T-Chess/commit/e3c1d8a482fdf3e7cd097e955ce1ae14e2c51eba) · Add a subtle bounce to the daily task bubble
- 14:38 · [08991e5](https://github.com/folamhmark/T-Chess/commit/08991e55aa731b7e8b237cca8fb0f1696ee0dfeb) · Soften the daily task bubble bounce
