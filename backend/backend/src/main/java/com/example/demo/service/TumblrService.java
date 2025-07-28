package com.example.demo.service;

import com.example.demo.model.AppCredential;
import com.example.demo.model.SocialPostRequest;
import com.example.demo.model.SocialToken;
import com.example.demo.repository.AppCredentialRepository;
import com.example.demo.repository.SocialTokenRepository;
import com.github.scribejava.core.model.OAuth1RequestToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TumblrService {
    private static final Logger logger = LoggerFactory.getLogger(TumblrService.class);

    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    // In-memory store for request tokens (for demo; use a distributed cache in production)
    private final Map<String, OAuth1RequestToken> requestTokenStore = new ConcurrentHashMap<>();

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "tumblr")
            .orElseThrow(() -> new RuntimeException("No app credentials set for tumblr"));
    }

    public String getAuthorizationUrl(String username) {
        try {
            AppCredential cred = getCred(username);
            com.github.scribejava.core.oauth.OAuth10aService service = new com.github.scribejava.core.builder.ServiceBuilder(cred.getClientId())
                    .apiSecret(cred.getClientSecret())
                    .callback(cred.getRedirectUri())
                    .build(com.github.scribejava.apis.TumblrApi.instance());
            com.github.scribejava.core.model.OAuth1RequestToken requestToken = service.getRequestToken();
            requestTokenStore.put(username, requestToken);
            return service.getAuthorizationUrl(requestToken);
        } catch (Exception e) {
            logger.error("Failed to get Tumblr auth URL", e);
            throw new RuntimeException("Tumblr OAuth error");
        }
    }

    public void handleCallback(Map<String, String> params, String username) {
        try {
            AppCredential cred = getCred(username);
            String oauthToken = params.get("oauth_token");
            String oauthVerifier = params.get("oauth_verifier");
            com.github.scribejava.core.oauth.OAuth10aService service = new com.github.scribejava.core.builder.ServiceBuilder(cred.getClientId())
                    .apiSecret(cred.getClientSecret())
                    .callback(cred.getRedirectUri())
                    .build(com.github.scribejava.apis.TumblrApi.instance());
            com.github.scribejava.core.model.OAuth1RequestToken requestToken = requestTokenStore.get(username);
            if (requestToken == null || !requestToken.getToken().equals(oauthToken)) {
                throw new RuntimeException("Invalid or expired request token");
            }
            com.github.scribejava.core.model.OAuth1AccessToken accessToken = service.getAccessToken(requestToken, oauthVerifier);
            com.example.demo.model.SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "tumblr")
                    .orElse(new com.example.demo.model.SocialToken());
            token.setUsername(username);
            token.setPlatform("tumblr");
            token.setAccessToken(accessToken.getToken());
            token.setAccessTokenSecret(accessToken.getTokenSecret());
            socialTokenRepository.save(token);
            requestTokenStore.remove(username);
        } catch (Exception e) {
            logger.error("Tumblr OAuth callback failed", e);
            throw new RuntimeException("Tumblr OAuth callback error");
        }
    }

    public void schedulePost(SocialPostRequest request, String username) {
        @SuppressWarnings("unused")
        SocialToken token = socialTokenRepository.findByUsernameAndPlatform(username, "tumblr")
            .orElseThrow(() -> new RuntimeException("Tumblr not connected for user"));
        // TODO: Implement Tumblr API call using token
    }
}
