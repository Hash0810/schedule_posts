package com.example.demo.controller;

import com.example.demo.model.AppCredential;
import com.example.demo.repository.AppCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/app-credentials")
public class AppCredentialController {
    @Autowired
    private AppCredentialRepository repo;

    @PostMapping("/set")
    public ResponseEntity<?> setCredential(@RequestBody AppCredential cred, Authentication auth) {
        cred.setUsername(auth.getName());
        repo.save(cred);
        return ResponseEntity.ok("Saved");
    }

    @GetMapping("/{platform}")
    public ResponseEntity<?> getCredential(@PathVariable String platform, Authentication auth) {
        return repo.findByUsernameAndPlatform(auth.getName(), platform)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
