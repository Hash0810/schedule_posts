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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RedditService {
    private static final Logger logger = LoggerFactory.getLogger(RedditService.class);

    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "reddit")
            .orElseThrow(() -> new RuntimeException("No app credentials set for reddit"));
    }

    public void schedulePost(SocialPostRequest request, String username) {
        @SuppressWarnings("unused")
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "reddit")
            .orElseThrow(() -> new RuntimeException("Reddit not connected for user"));
        // TODO: Implement Reddit API call using token
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return UriComponentsBuilder.fromUriString("https://www.reddit.com/api/v1/authorize")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("response_type", "code")
                    .queryParam("state", "random_string")
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("duration", "permanent")
                    .queryParam("scope", "identity submit read")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building Reddit OAuth URL", e);
            throw new RuntimeException("Failed to build Reddit OAuth URL");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = UriComponentsBuilder.fromUriString("https://www.reddit.com/api/v1/access_token")
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, String> body = Map.of(
                    "grant_type", "authorization_code",
                    "code", code,
                    "redirect_uri", cred.getRedirectUri()
            );
            // Reddit requires HTTP Basic Auth with client_id:client_secret as username:password
            // TODO: Use RestTemplate with Basic Auth for production
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(tokenUrl, body, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in Reddit response: {}", response);
                throw new RuntimeException("Failed to retrieve Reddit access token");
            }
            String accessToken = (String) response.get("access_token");
            SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "reddit")
                    .orElse(new SocialToken());
            token.setUsername(username);
            token.setPlatform("reddit");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling Reddit OAuth callback", e);
            throw new RuntimeException("Reddit OAuth callback failed: " + e.getMessage());
        }
    }
}
