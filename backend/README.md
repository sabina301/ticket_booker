# Ticket Booker

A ticket booking system built with Django and PostgreSQL, following clean architecture principles and MVC pattern.

## Features

- User authentication and authorization
- Flight ticket booking
- Booking management
- Admin panel
- Search functionality
- Booking history

## Project Structure

```
ticket_booker/
├── apps/                    # Application modules
│   ├── core/               # Core functionality
│   ├── users/              # User management
│   ├── flights/            # Flight management
│   └── bookings/           # Booking management
├── config/                 # Project configuration
├── static/                 # Static files
├── templates/              # HTML templates
└── manage.py              # Django management script
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=ticket_booker
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

## Technologies Used

- Django 5.0.2
- PostgreSQL
- Bootstrap 5
- Crispy Forms
- Python-dotenv 