package com.example.flashcards.model;

import jakarta.persistence.*;

@Entity
@Table(name = "flashcards")
public class Flashcard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id", nullable = false)
    private Level level;

    @Column(name = "side_a", nullable = false, columnDefinition = "text")
    private String sideA;

    @Column(name = "side_b", nullable = false, columnDefinition = "text")
    private String sideB;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "audio_mp3_url")
    private String audioMp3Url;

    @Column(name = "example_sentence")
    private String exampleSentence;

    @Column(name = "order_position")
    private Integer orderPosition;

    public Long getId() {
        return id;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getSideA() {
        return sideA;
    }

    public void setSideA(String sideA) {
        this.sideA = sideA;
    }

    public String getSideB() {
        return sideB;
    }

    public void setSideB(String sideB) {
        this.sideB = sideB;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAudioMp3Url() {
        return audioMp3Url;
    }

    public void setAudioMp3Url(String audioMp3Url) {
        this.audioMp3Url = audioMp3Url;
    }

    public String getExampleSentence() {
        return exampleSentence;
    }

    public void setExampleSentence(String exampleSentence) {
        this.exampleSentence = exampleSentence;
    }

    public Integer getOrderPosition() {
        return orderPosition;
    }

    public void setOrderPosition(Integer orderPosition) {
        this.orderPosition = orderPosition;
    }
}
