package com.example.demo.service;

import com.example.demo.model.AppCredential;
import com.example.demo.model.SocialPostRequest;
import com.example.demo.model.SocialToken;
import com.example.demo.repository.AppCredentialRepository;
import com.example.demo.repository.SocialTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class YouTubeService {
    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(YouTubeService.class);

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "youtube")
            .orElseThrow(() -> new RuntimeException("No app credentials set for youtube"));
    }

    public void schedulePost(SocialPostRequest request, String username) {
        @SuppressWarnings("unused")
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "youtube")
            .orElseThrow(() -> new RuntimeException("YouTube not connected for user"));
        // TODO: Implement YouTube API call using token
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("scope", "https://www.googleapis.com/auth/youtube.force-ssl")
                    .queryParam("response_type", "code")
                    .queryParam("access_type", "offline")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building YouTube OAuth URL", e);
            throw new RuntimeException("Failed to build YouTube OAuth URL");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = UriComponentsBuilder.fromUriString("https://oauth2.googleapis.com/token")
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, String> body = Map.of(
                    "client_id", cred.getClientId(),
                    "client_secret", cred.getClientSecret(),
                    "grant_type", "authorization_code",
                    "redirect_uri", cred.getRedirectUri(),
                    "code", code
            );
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(tokenUrl, body, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in YouTube response: {}", response);
                throw new RuntimeException("Failed to retrieve YouTube access token");
            }
            String accessToken = (String) response.get("access_token");
            SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "youtube")
                    .orElse(new SocialToken());
            token.setUsername(username);
            token.setPlatform("youtube");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling YouTube OAuth callback", e);
            throw new RuntimeException("YouTube OAuth callback failed: " + e.getMessage());
        }
    }
}
