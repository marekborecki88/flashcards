# Flashcards Application

A modern web application designed to help users memorize and retain information through an interactive flashcard system. Built with Spring Boot and PostgreSQL, this application provides an efficient way to create, manage, and study flashcards for learning phrases, vocabulary, concepts, or any other information.

## Features

- **Flashcard Management**: Create, edit, and organize flashcards with questions and answers
- **Study Sessions**: Interactive study mode to test your knowledge
- **Database Persistence**: Secure storage using PostgreSQL with Liquibase migrations
- **RESTful API**: Clean API endpoints for frontend integration
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Technology Stack

- **Backend**: Spring Boot 3.5.3 with Java 24
- **Database**: PostgreSQL 17.5
- **Database Migrations**: Liquibase
- **Containerization**: Docker & Docker Compose
- **Database Management**: pgAdmin 4

## Getting Started

1. Clone the repository
2. Create a `.env` file with your database credentials
3. Run `docker-compose up -d` to start all services
4. Access the application at `http://localhost:8000/api`
5. Access pgAdmin at `http://localhost:5050` for database management

## Development

The application uses Liquibase for database migrations, with SQL scripts located in `src/main/resources/db/changelog/changes/`. New migrations are automatically discovered and applied on startup.

### How to restart only backend in Docker Compose

To restart only the backend service without affecting the database or other services:

```bash
# Restart only the backend service
docker-compose restart backend

# Or stop and start the backend service
docker-compose stop backend
docker-compose start backend

# To rebuild and restart the backend (useful after code changes)
docker-compose up -d --build backend
```

**Note**: The `--build` flag is useful when you've made changes to the backend code and need to rebuild the Docker image.