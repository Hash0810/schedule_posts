package com.example.demo.controller;

import com.example.demo.model.ApiKey;
import com.example.demo.repository.ApiKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apikeys")
public class ApiKeyController {
    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @GetMapping
    public List<ApiKey> getApiKeys(Authentication authentication) {
        String username = authentication.getName();
        return apiKeyRepository.findByUsername(username);
    }

    @PostMapping
    public ResponseEntity<ApiKey> saveApiKey(@RequestBody ApiKey apiKey, Authentication authentication) {
        apiKey.setUsername(authentication.getName());
        ApiKey saved = apiKeyRepository.save(apiKey);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApiKey(@PathVariable Long id, Authentication authentication) {
        ApiKey apiKey = apiKeyRepository.findById(id).orElse(null);
        if (apiKey == null || !apiKey.getUsername().equals(authentication.getName())) {
            return ResponseEntity.notFound().build();
        }
        apiKeyRepository.delete(apiKey);
        return ResponseEntity.ok().build();
    }
}
