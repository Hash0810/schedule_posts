package com.example.demo.controller;

import com.example.demo.model.SocialPostRequest;
import com.example.demo.service.FacebookService;
import com.example.demo.service.LinkedInService;
import com.example.demo.service.TwitterService;
import com.example.demo.service.InstagramService;
import com.example.demo.service.YouTubeService;
import com.example.demo.service.PinterestService;
import com.example.demo.service.TumblrService;
import com.example.demo.service.RedditService;
import com.example.demo.service.TikTokService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/social")
public class SocialController {
    @Autowired private TwitterService twitterService;
    @Autowired private FacebookService facebookService;
    @Autowired private LinkedInService linkedInService;
    @Autowired private InstagramService instagramService;
    @Autowired private YouTubeService youtubeService;
    @Autowired private PinterestService pinterestService;
    @Autowired private TumblrService tumblrService;
    @Autowired private RedditService redditService;
    @Autowired private TikTokService tiktokService;

    @PostMapping("/post")
    public ResponseEntity<String> postToSocial(@RequestBody SocialPostRequest request, Authentication authentication) {
        String username = authentication.getName();
        switch (request.getPlatform().toLowerCase()) {
            case "twitter":
                twitterService.schedulePost(request, username);
                break;
            case "facebook":
                facebookService.schedulePost(request, username);
                break;
            case "linkedin":
                linkedInService.schedulePost(request, username);
                break;
            case "instagram":
                instagramService.schedulePost(request, username);
                break;
            case "youtube":
                youtubeService.schedulePost(request, username);
                break;
            case "pinterest":
                pinterestService.schedulePost(request, username);
                break;
            case "tumblr":
                tumblrService.schedulePost(request, username);
                break;
            case "reddit":
                redditService.schedulePost(request, username);
                break;
            case "tiktok":
                tiktokService.schedulePost(request, username);
                break;
            default:
                return ResponseEntity.badRequest().body("Unsupported platform");
        }
        return ResponseEntity.ok("Post scheduled");
    }
}
