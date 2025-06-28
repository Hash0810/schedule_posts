package com.example.demo.service;

import com.example.demo.model.AppCredential;
import com.example.demo.model.SocialPostRequest;
import com.example.demo.model.SocialToken;
import com.example.demo.repository.AppCredentialRepository;
import com.example.demo.repository.SocialTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FacebookService {
    private static final Logger logger = LoggerFactory.getLogger(FacebookService.class);

    @Autowired
    private SocialTokenRepository socialTokenRepository;

    @Autowired
    private AppCredentialRepository appCredentialRepository;

    public void schedulePost(SocialPostRequest request, String username) {
        // Retrieve token for user
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "facebook")
            .orElseThrow(() -> new RuntimeException("Facebook not connected for user"));
        postToFacebook(request.getContent(), token);
    }

    public void postToFacebook(String content, SocialToken token) {
        String url = "https://graph.facebook.com/v19.0/me/feed?access_token=" + token.getAccessToken();
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> body = new HashMap<>();
        body.put("message", content);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to post to Facebook: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to post to Facebook", e);
        }
    }

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "facebook")
            .orElseThrow(() -> new RuntimeException("No app credentials set for facebook"));
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return org.springframework.web.util.UriComponentsBuilder.fromUriString("https://www.facebook.com/v19.0/dialog/oauth")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("scope", "pages_manage_posts,pages_read_engagement,pages_show_list,publish_to_groups,pages_manage_metadata,pages_read_user_content,email,public_profile")
                    .queryParam("response_type", "code")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building Facebook OAuth URL", e);
            throw new RuntimeException("Failed to build Facebook OAuth URL");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = org.springframework.web.util.UriComponentsBuilder.fromUriString("https://graph.facebook.com/v19.0/oauth/access_token")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("client_secret", cred.getClientSecret())
                    .queryParam("code", code)
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(tokenUrl, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in Facebook response: {}", response);
                throw new RuntimeException("Failed to retrieve Facebook access token");
            }
            String accessToken = (String) response.get("access_token");
            com.example.demo.model.SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "facebook")
                .orElse(new com.example.demo.model.SocialToken());
            token.setUsername(username);
            token.setPlatform("facebook");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling Facebook OAuth callback", e);
            throw new RuntimeException("Facebook OAuth callback failed: " + e.getMessage());
        }
    }
}
