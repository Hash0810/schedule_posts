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
public class TikTokService {
    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(TikTokService.class);

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "tiktok")
            .orElseThrow(() -> new RuntimeException("No app credentials set for tiktok"));
    }

    public void schedulePost(SocialPostRequest request, String username) {
        @SuppressWarnings("unused")
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "tiktok")
            .orElseThrow(() -> new RuntimeException("TikTok not connected for user"));
        // TODO: Implement TikTok API call using token
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return UriComponentsBuilder.fromUriString("https://www.tiktok.com/v2/auth/authorize/")
                    .queryParam("client_key", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("response_type", "code")
                    .queryParam("scope", "user.info.basic,video.list,video.upload")
                    .queryParam("state", "state")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building TikTok OAuth URL", e);
            throw new RuntimeException("Failed to build TikTok OAuth URL");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = UriComponentsBuilder.fromUriString("https://open-api.tiktok.com/oauth/access_token/")
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, String> body = Map.of(
                    "client_key", cred.getClientId(),
                    "client_secret", cred.getClientSecret(),
                    "code", code,
                    "grant_type", "authorization_code"
            );
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(tokenUrl, body, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in TikTok response: {}", response);
                throw new RuntimeException("Failed to retrieve TikTok access token");
            }
            String accessToken = (String) response.get("access_token");
            SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "tiktok")
                    .orElse(new SocialToken());
            token.setUsername(username);
            token.setPlatform("tiktok");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling TikTok OAuth callback", e);
            throw new RuntimeException("TikTok OAuth callback failed: " + e.getMessage());
        }
    }
}
