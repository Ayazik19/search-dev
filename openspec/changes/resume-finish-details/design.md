# Design: Resume Completion Modal

## Название изменения
**resume-finish-details**

## Цель
Показать модальное окно после сабмита последнего шага, чтобы пользователь быстро добил недостающие данные и завершил резюме.

## Структура модального окна

### 1. Intro-block
- **Just a few details left**

### 2. Главный заголовок
- **Let’s finalize your resume**

### 3. Подзаголовок
- **You’ve filled most of your resume. Add the missing details below to finish it.**

### 4. Поля формы
Перед каждым полем показывается короткий текст-лейбл.

Каждый `#sym:label` должен выглядеть **как отдельный select/dropdown по дизайну**:
- закрытое состояние — как обычный селект-инпут;
- при открытии — выпадающий список под полем;
- внутри списка — чекбоксы у вариантов;
- выбранные значения отображаются в самом поле;
- каждый блок открывается отдельно и не сливается с другими.

- `#sym:statusSearchResume` — **Job search status**
  - select/dropdown
  - options:
    - Actively looking for a job
    - Considering offers
    - Offered a job, still deciding
    - Starting a new role soon
    - Not looking for a job
- `#sym:busyness` — **Employment type**
  - select/dropdown
  - options:
    - Permanent job
    - Part-time job
    - Internship
- `#sym:workFormat` — **Work format**
  - select/dropdown
  - options:
    - On-site
    - Remote
    - Hybrid
- `#sym:salary` — **Expected salary**
  - currency select + amount input

## Дизайн-решение

- Модалка должна выглядеть как мягкое продолжение флоу, а не как отдельный попап.
- Визуальный акцент на заголовке и первом тексте intro.
- Поля идут вертикальным списком, с понятной иерархией: лейбл сверху, инпут снизу.
- Интервалы между блоками должны быть комфортными, чтобы форма читалась как короткий финальный шаг.
- CTA-кнопка должна завершать сценарий и быть визуально доминирующей среди остальных элементов.

## Тон
- Спокойный, поддерживающий, без давления.
- Формулировки должны подчеркивать, что резюме уже почти готово.

## Итоговый согласованный вариант
- **Intro:** Just a few details left
- **Headline:** Let’s finalize your resume
- **Subtitle:** You’ve filled most of your resume. Add the missing details below to finish it.
- **Section name:** resume-finish-details
- **Fields:** статус поиска работы, тип занятости, график работы, ожидаемая зарплата