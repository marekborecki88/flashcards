erDiagram
USERS {
int id PK
string username
string email
string password_hash
datetime created_at
datetime updated_at
}

    COURSES {
        int id PK
        string name
        string description
        string taught_language
        string learning_language
        boolean is_public
        int created_by_user_id FK
        datetime created_at
        datetime updated_at
    }
    
    LEVELS {
        int id PK
        int course_id FK
        string name
        string description
        int order_position
        datetime created_at
        datetime updated_at
    }
    
    FLASHCARDS {
        int id PK
        int level_id FK
        string side_a
        string side_b
        string image_url
        string audio_mp3_url
        string example_sentence
        int order_position
        datetime created_at
        datetime updated_at
    }
    
    USER_COURSE_ACCESS {
        int id PK
        int user_id FK
        int course_id FK
        string access_type
        datetime granted_at
    }
    
    USER_PROGRESS {
        int id PK
        int user_id FK
        int flashcard_id FK
        int times_seen
        int correct_answers
        int incorrect_answers
        datetime last_reviewed
        datetime next_review
        float ease_factor
        datetime created_at
        datetime updated_at
    }
    
    USERS ||--o{ COURSES : "creates"
    USERS ||--o{ USER_COURSE_ACCESS : "has access to"
    USERS ||--o{ USER_PROGRESS : "tracks progress"
    
    COURSES ||--o{ LEVELS : "contains"
    COURSES ||--o{ USER_COURSE_ACCESS : "grants access"
    
    LEVELS ||--o{ FLASHCARDS : "contains"
    
    FLASHCARDS ||--o{ USER_PROGRESS : "has progress"
