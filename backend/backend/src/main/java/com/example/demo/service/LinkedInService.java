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
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class LinkedInService {
    private static final Logger logger = LoggerFactory.getLogger(LinkedInService.class);

    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "linkedin")
            .orElseThrow(() -> new RuntimeException("No app credentials set for linkedin"));
    }

    public void schedulePost(SocialPostRequest request, String username) {
        // Retrieve token for user
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "linkedin")
            .orElseThrow(() -> new RuntimeException("LinkedIn not connected for user"));
        postToLinkedIn(request.getContent(), token);
    }

    public void postToLinkedIn(String content, SocialToken token) {
        String url = "https://api.linkedin.com/v2/ugcPosts";
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> body = new HashMap<>();
        body.put("author", "urn:li:person:" + token.getAccessToken()); // This is a placeholder, you must use the correct URN
        body.put("lifecycleState", "PUBLISHED");
        Map<String, Object> specificContent = new HashMap<>();
        Map<String, Object> shareContent = new HashMap<>();
        shareContent.put("shareCommentary", Map.of("text", content));
        shareContent.put("shareMediaCategory", "NONE");
        specificContent.put("com.linkedin.ugc.ShareContent", shareContent);
        body.put("specificContent", specificContent);
        body.put("visibility", Map.of("com.linkedin.ugc.MemberNetworkVisibility", "PUBLIC"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token.getAccessToken());
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to post to LinkedIn: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to post to LinkedIn", e);
        }
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return UriComponentsBuilder.fromUriString("https://www.linkedin.com/oauth/v2/authorization")
                    .queryParam("response_type", "code")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("scope", "r_liteprofile r_emailaddress w_member_social")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building LinkedIn OAuth URL", e);
            throw new RuntimeException("Failed to build LinkedIn OAuth URL");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = UriComponentsBuilder.fromUriString("https://www.linkedin.com/oauth/v2/accessToken")
                    .queryParam("grant_type", "authorization_code")
                    .queryParam("code", code)
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("client_secret", cred.getClientSecret())
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(tokenUrl, null, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in LinkedIn response: {}", response);
                throw new RuntimeException("Failed to retrieve LinkedIn access token");
            }
            String accessToken = (String) response.get("access_token");
            SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "linkedin")
                    .orElse(new SocialToken());
            token.setUsername(username);
            token.setPlatform("linkedin");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling LinkedIn OAuth callback", e);
            throw new RuntimeException("LinkedIn OAuth callback failed: " + e.getMessage());
        }
    }
}
