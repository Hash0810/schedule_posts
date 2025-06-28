package com.example.demo.controller;

import com.example.demo.model.AppCredential;
import com.example.demo.repository.AppCredentialRepository;
import com.example.demo.repository.SocialTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/facebook")
public class FacebookController {
    @Autowired
    private SocialTokenRepository socialTokenRepository;
    @Autowired
    private AppCredentialRepository appCredentialRepository;

    private AppCredential getCred(String username) {
        return appCredentialRepository.findByUsernameAndPlatform(username, "facebook")
            .orElseThrow(() -> new RuntimeException("No app credentials set for facebook"));
    }

    @GetMapping("/connect")
    public ResponseEntity<String> connectFacebook(Authentication authentication) {
        String username = authentication.getName();
        AppCredential cred = getCred(username);
        String authUrl = UriComponentsBuilder.fromUriString("https://www.facebook.com/v19.0/dialog/oauth")
                .queryParam("client_id", cred.getClientId())
                .queryParam("redirect_uri", cred.getRedirectUri())
                .queryParam("scope", "pages_manage_posts,pages_read_engagement,pages_show_list,publish_to_groups,pages_manage_metadata,pages_read_user_content,email,public_profile")
                .queryParam("response_type", "code")
                .build().toUriString();
        return ResponseEntity.ok(authUrl);
    }

    @GetMapping("/callback")
    public ResponseEntity<String> facebookCallback(@RequestParam String code, Authentication authentication) {
        // TODO: Implement token exchange and save logic here, as in FacebookService
        return ResponseEntity.ok("Facebook connected");
    }
}
