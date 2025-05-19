# Ticket Booker — Система онлайн-бронирования авиабилетов

[![Django](https://img.shields.io/badge/Django-4.2-brightgreen)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Репозиторий проекта:** [https://github.com/sabina301/ticket_booker](https://github.com/sabina301/ticket_booker)

## Описание
Веб-приложение для бронирования авиабилетов с возможностью поиска рейсов, управления заказами и оплаты. Проект разработан в рамках курсовой работы с использованием Django (Python) для серверной части и HTML/CSS/JavaScript для клиентского интерфейса.

## Основные возможности
- Поиск рейсов по дате, цене и авиакомпании.
- Бронирование билетов с временным резервированием мест.
- Интеграция с тестовым платежным шлюзом (Stripe).
- Личный кабинет для просмотра истории заказов.
- Аутентификация пользователей (регистрация, авторизация, восстановление пароля).

## Стек технологий
- **Бэкенд**: Django, Django REST Framework.
- **База данных**: PostgreSQL.
- **Фронтенд**: HTML5, CSS3, Vanilla JavaScript.
- **Развёртывание**: Heroku, Docker (опционально).
- **Инструменты**: Git, Selenium для тестирования, Apache JMeter.

## Установка и запуск

### Предварительные требования
- Python 3.10+
- PostgreSQL 15+
- Node.js (для сборки статики, опционально)

### Шаги:
1. Клонировать репозиторий:
```bash
git clone https://github.com/sabina301/ticket_booker.git
cd ticket_booker
```
3. Установить зависимости
```bash
pip install -r requirements.txt
```
4. Настроить бд
5. Применить миграции
 ```bash
python manage.py migrate
```
6. Заупск
```bash
python manage.py runserver
```
