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
public class InstagramService {
    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(InstagramService.class);

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "instagram")
            .orElseThrow(() -> new RuntimeException("No app credentials set for instagram"));
    }

    public void schedulePost(SocialPostRequest request, String username) {
        @SuppressWarnings("unused")
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "instagram")
            .orElseThrow(() -> new RuntimeException("Instagram not connected for user"));
        // TODO: Implement Instagram API call using token
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return UriComponentsBuilder.fromUriString("https://api.instagram.com/oauth/authorize")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("scope", "user_profile,user_media")
                    .queryParam("response_type", "code")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building Instagram OAuth URL", e);
            throw new RuntimeException("Failed to build Instagram OAuth URL");
        }
    }

    @SuppressWarnings("unchecked")
    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = UriComponentsBuilder.fromUriString("https://api.instagram.com/oauth/access_token")
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, String> body = Map.of(
                    "client_id", cred.getClientId(),
                    "client_secret", cred.getClientSecret(),
                    "grant_type", "authorization_code",
                    "redirect_uri", cred.getRedirectUri(),
                    "code", code
            );
            Map<String, Object> response = restTemplate.postForObject(tokenUrl, body, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in Instagram response: {}", response);
                throw new RuntimeException("Failed to retrieve Instagram access token");
            }
            String accessToken = (String) response.get("access_token");
            SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "instagram")
                    .orElse(new SocialToken());
            token.setUsername(username);
            token.setPlatform("instagram");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling Instagram OAuth callback", e);
            throw new RuntimeException("Instagram OAuth callback failed: " + e.getMessage());
        }
    }
}
