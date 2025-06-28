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
public class PinterestService {
    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(PinterestService.class);

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "pinterest")
            .orElseThrow(() -> new RuntimeException("No app credentials set for pinterest"));
    }

    public void schedulePost(SocialPostRequest request, String username) {
        @SuppressWarnings("unused")
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "pinterest")
            .orElseThrow(() -> new RuntimeException("Pinterest not connected for user"));
        // TODO: Implement Pinterest API call using token
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            return UriComponentsBuilder.fromUriString("https://www.pinterest.com/oauth/")
                    .queryParam("response_type", "code")
                    .queryParam("client_id", cred.getClientId())
                    .queryParam("redirect_uri", cred.getRedirectUri())
                    .queryParam("scope", "pins:read,pins:write,boards:read,boards:write,user_accounts:read")
                    .build().toUriString();
        } catch (Exception e) {
            logger.error("Error building Pinterest OAuth URL", e);
            throw new RuntimeException("Failed to build Pinterest OAuth URL");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String code = params.get("code");
            if (code == null) throw new IllegalArgumentException("Missing code parameter");
            String tokenUrl = UriComponentsBuilder.fromUriString("https://api.pinterest.com/v5/oauth/token")
                    .build().toUriString();
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, String> body = Map.of(
                    "grant_type", "authorization_code",
                    "code", code,
                    "redirect_uri", cred.getRedirectUri(),
                    "client_id", cred.getClientId(),
                    "client_secret", cred.getClientSecret()
            );
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(tokenUrl, body, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                logger.error("No access_token in Pinterest response: {}", response);
                throw new RuntimeException("Failed to retrieve Pinterest access token");
            }
            String accessToken = (String) response.get("access_token");
            SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "pinterest")
                    .orElse(new SocialToken());
            token.setUsername(username);
            token.setPlatform("pinterest");
            token.setAccessToken(accessToken);
            socialTokenRepository.save(token);
        } catch (Exception e) {
            logger.error("Error handling Pinterest OAuth callback", e);
            throw new RuntimeException("Pinterest OAuth callback failed: " + e.getMessage());
        }
    }
}
