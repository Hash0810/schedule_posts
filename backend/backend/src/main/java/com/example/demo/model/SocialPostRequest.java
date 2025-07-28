package com.example.demo.model;

public class SocialPostRequest {
    private String content;
    private String scheduledTime; // ISO 8601 string
    private String platform; // e.g., "twitter", "facebook", "linkedin"
    // Optionally, add fields for media, etc.

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
}
