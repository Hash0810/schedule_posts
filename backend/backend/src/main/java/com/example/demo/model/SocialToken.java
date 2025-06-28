package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "social_tokens")
public class SocialToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String platform; // e.g., "twitter"

    @Column(nullable = false)
    private String accessToken;

    @Column
    private String accessTokenSecret; // For Twitter

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getAccessTokenSecret() { return accessTokenSecret; }
    public void setAccessTokenSecret(String accessTokenSecret) { this.accessTokenSecret = accessTokenSecret; }
}
