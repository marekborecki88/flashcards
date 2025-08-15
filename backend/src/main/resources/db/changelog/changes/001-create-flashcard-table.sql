--liquibase formatted sql

--changeset marekborecki88:1
CREATE TABLE flashcard (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer VARCHAR(255) NOT NULL
); 