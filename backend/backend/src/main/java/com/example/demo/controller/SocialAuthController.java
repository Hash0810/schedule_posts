package com.example.demo.controller;

import com.example.demo.repository.SocialTokenRepository;
import com.example.demo.service.FacebookService;
import com.example.demo.service.LinkedInService;
import com.example.demo.service.InstagramService;
import com.example.demo.service.YouTubeService;
import com.example.demo.service.PinterestService;
import com.example.demo.service.TumblrService;
import com.example.demo.service.RedditService;
import com.example.demo.service.TwitterService;
import com.example.demo.service.TikTokService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/socialauth")
public class SocialAuthController {
    @Autowired
    private SocialTokenRepository socialTokenRepository;

    @Autowired
    private FacebookService facebookService;
    @Autowired
    private LinkedInService linkedInService;
    @Autowired
    private InstagramService instagramService;
    @Autowired
    private YouTubeService youTubeService;
    @Autowired
    private PinterestService pinterestService;
    @Autowired
    private TumblrService tumblrService;
    @Autowired
    private RedditService redditService;
    @Autowired
    private TwitterService twitterService;
    @Autowired
    private TikTokService tikTokService;

    @GetMapping("/connect/{platform}")
    public ResponseEntity<String> connect(@PathVariable String platform, Authentication authentication) {
        String authUrl;
        String username = authentication.getName();
        switch (platform.toLowerCase()) {
            case "twitter":
                authUrl = twitterService.getAuthorizationUrl(username);
                break;
            case "facebook":
                authUrl = facebookService.getAuthorizationUrl(username);
                break;
            case "linkedin":
                authUrl = linkedInService.getAuthorizationUrl(username);
                break;
            case "instagram":
                authUrl = instagramService.getAuthorizationUrl(username);
                break;
            case "youtube":
                authUrl = youTubeService.getAuthorizationUrl(username);
                break;
            case "pinterest":
                authUrl = pinterestService.getAuthorizationUrl(username);
                break;
            case "tumblr":
                authUrl = tumblrService.getAuthorizationUrl(username);
                break;
            case "reddit":
                authUrl = redditService.getAuthorizationUrl(username);
                break;
            case "tiktok":
                authUrl = tikTokService.getAuthorizationUrl(username);
                break;
            default:
                return ResponseEntity.badRequest().body("Unsupported platform");
        }
        return ResponseEntity.ok(authUrl);
    }

    @GetMapping("/callback/{platform}")
    public ResponseEntity<String> callback(@PathVariable String platform, @RequestParam Map<String, String> params, Authentication authentication) {
        String username = authentication.getName();
        switch (platform.toLowerCase()) {
            case "facebook":
                facebookService.handleCallback(params, username);
                return ResponseEntity.ok("facebook connected");
            case "linkedin":
                linkedInService.handleCallback(params, username);
                return ResponseEntity.ok("linkedin connected");
            case "instagram":
                instagramService.handleCallback(params, username);
                return ResponseEntity.ok("instagram connected");
            case "youtube":
                youTubeService.handleCallback(params, username);
                return ResponseEntity.ok("youtube connected");
            case "pinterest":
                pinterestService.handleCallback(params, username);
                return ResponseEntity.ok("pinterest connected");
            case "reddit":
                redditService.handleCallback(params, username);
                return ResponseEntity.ok("reddit connected");
            case "twitter":
                twitterService.handleCallback(params, username);
                return ResponseEntity.ok("twitter connected");
            case "tumblr":
                tumblrService.handleCallback(params, username);
                return ResponseEntity.ok("tumblr connected");
            case "tiktok":
                tikTokService.handleCallback(params, username);
                return ResponseEntity.ok("tiktok connected");
            default:
                return ResponseEntity.badRequest().body("Unsupported platform");
        }
    }

    @GetMapping("/status/{platform}")
    public ResponseEntity<?> status(@PathVariable String platform, Authentication authentication) {
        boolean connected = socialTokenRepository.findByUsernameAndPlatform(authentication.getName(), platform).isPresent();
        return ResponseEntity.ok(Map.of("connected", connected));
    }
}
