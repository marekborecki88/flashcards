--liquibase formatted sql

--changeset marekborecki88:1
-- Create USERS table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Create COURSES table
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    taught_language VARCHAR(100) NOT NULL,
    learning_language VARCHAR(100) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_courses_created_by_user
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_courses_created_by_user_id ON courses(created_by_user_id);

-- Create LEVELS table
CREATE TABLE IF NOT EXISTS levels (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_position INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_levels_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_levels_course_id ON levels(course_id);

-- Create FLASHCARDS table
CREATE TABLE IF NOT EXISTS flashcards (
    id BIGSERIAL PRIMARY KEY,
    level_id BIGINT NOT NULL,
    side_a TEXT NOT NULL,
    side_b TEXT NOT NULL,
    image_url TEXT,
    audio_mp3_url TEXT,
    example_sentence TEXT,
    order_position INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_flashcards_level
        FOREIGN KEY (level_id)
        REFERENCES levels(id)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_flashcards_level_id ON flashcards(level_id);

-- Create USER_COURSE_ACCESS table
CREATE TABLE IF NOT EXISTS user_course_access (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    access_type VARCHAR(50) NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_uca_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_uca_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_uca_user_course UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_uca_user_id ON user_course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_uca_course_id ON user_course_access(course_id);

-- Create USER_PROGRESS table
CREATE TABLE IF NOT EXISTS user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    flashcard_id BIGINT NOT NULL,
    times_seen INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    incorrect_answers INT NOT NULL DEFAULT 0,
    last_reviewed TIMESTAMPTZ,
    next_review TIMESTAMPTZ,
    ease_factor REAL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_up_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_up_flashcard
        FOREIGN KEY (flashcard_id)
        REFERENCES flashcards(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_up_user_flashcard UNIQUE (user_id, flashcard_id)
);
CREATE INDEX IF NOT EXISTS idx_up_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_up_flashcard_id ON user_progress(flashcard_id);

--rollback
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS user_course_access;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;