# Proposal: Resume Completion Modal

## Цель
После сабмита последнего шага показать модальное окно, которое мягко доводит пользователя до финального заполнения резюме и просит указать недостающие данные.

## Общая структура

### 1. Intro-block
- **Just a few details left**

### 2. Main headline
Основной заголовок:
- **Let’s finalize your resume**

### 3. Подзаголовок
Подзаголовок / пояснение:
- **resume-finish-details**
- **You’ve filled most of your resume. Add the missing details below to finish it.**

### 4. Название секции
Варианты вместо `resume-finish-details`:
- **resume-finish-details** — мой основной вариант

Если нужен самый понятный и короткий вариант для логики, я бы рекомендовал:
- **resume-finish-details**

### 5. Поля формы
Перед каждым полем должен быть короткий текст-лейбл:

#### `#sym:statusSearchResume`
- **Статус поиска работы**

#### `#sym:busyness`
- **Тип занятости**

#### `#sym:workFormat`
- **Формат работы**

#### `#sym:salary`
- **Ожидаемая зарплата**


## Recommended copy
- Intro: **Just a few details left**
- Headline: **Let’s finalize your resume**
- Subtitle: **You’ve filled most of your resume. Add the missing details below to finish it.**
- Section name: **resume-finish-details**
- Labels:
  - **Статус поиска работы**
  - **Тип занятости**
  - **Занятость** / **График работы**
  - **Ожидаемая зарплата**

## Final recommendation
Если брать один согласованный вариант, я бы оставил:
- **Intro:** Just a few details left
- **Headline:** Let’s finalize your resume
- **Subtitle:** You’ve filled most of your resume. Add the missing details below to finish it.
- **Section name:** resume-finish-details
- **Fields:** статус поиска работы, тип занятости, график работы, ожидаемая зарплата

