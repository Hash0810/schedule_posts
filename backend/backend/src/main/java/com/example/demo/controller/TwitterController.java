package com.example.demo.controller;

import com.example.demo.repository.SocialTokenRepository;
import com.example.demo.service.TwitterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/twitter")
public class TwitterController {
    @Autowired
    private TwitterService twitterService;

    @Autowired
    private SocialTokenRepository socialTokenRepository;

    // Endpoint to start OAuth (returns auth URL)
    @GetMapping("/connect")
    public ResponseEntity<String> connectTwitter(Authentication authentication) {
        String authUrl = twitterService.getAuthorizationUrl(authentication.getName());
        return ResponseEntity.ok(authUrl);
    }

    // Callback endpoint for OAuth
    @GetMapping("/callback")
    public ResponseEntity<String> twitterCallback(@RequestParam String oauth_token, @RequestParam String oauth_verifier, Authentication authentication) {
        try {
            java.util.Map<String, String> params = java.util.Map.of(
                "oauth_token", oauth_token,
                "oauth_verifier", oauth_verifier
            );
            twitterService.handleCallback(params, authentication.getName());
            return ResponseEntity.ok("Connected");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }

    // Check Twitter connection status
    @GetMapping("/status")
    public ResponseEntity<?> twitterStatus(Authentication authentication) {
        String username = authentication.getName();
        boolean connected = socialTokenRepository.findByUsernameAndPlatform(username, "twitter").isPresent();
        return ResponseEntity.ok(java.util.Collections.singletonMap("connected", connected));
    }

    // Schedule a post
    @PostMapping("/schedule")
    public ResponseEntity<String> schedulePost(@RequestBody com.example.demo.model.SocialPostRequest request, Authentication authentication) {
        twitterService.schedulePost(request, authentication.getName());
        return ResponseEntity.ok("Post scheduled");
    }
}
