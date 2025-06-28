package com.example.demo.controller;

import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import com.yubico.webauthn.data.ClientRegistrationExtensionOutputs;
import com.yubico.webauthn.data.AuthenticatorAssertionResponse;
import com.yubico.webauthn.data.ClientAssertionExtensionOutputs;
import com.yubico.webauthn.AssertionRequest;
import com.example.demo.service.WebAuthnService;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.yubico.webauthn.exception.AssertionFailedException;
import java.util.Map;

@RestController
@RequestMapping("/webauthn")
@CrossOrigin(origins = "http://localhost:3000") // Add CORS support
public class WebAuthnController {

    @Autowired
    private WebAuthnService webAuthnService;

    @GetMapping("/register/options")
    public ResponseEntity<?> getRegistrationOptions(@RequestParam String username) {
        try {
            System.out.println("Registration options requested for username: '" + username + "'");

            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username parameter is required and cannot be empty");
            }

            PublicKeyCredentialCreationOptions options = webAuthnService.startRegistration(username.trim());
            System.out.println("Generated options for user: " + options.getUser().getName());

            // Strip nulls & handle Optional properly
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new Jdk8Module());
            mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

            String cleanedJson = mapper.writeValueAsString(options);
            JsonNode cleanedNode = mapper.readTree(cleanedJson);

            return ResponseEntity.ok(cleanedNode);
        } catch (Exception e) {
            System.err.println("Error in getRegistrationOptions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to start registration: " + e.getMessage());
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> finishRegistration(
        @RequestParam String username,
        @RequestBody PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> credential
    ) {
        try {
            webAuthnService.finishRegistration(username, credential);
            return ResponseEntity.ok("Passkey registration successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/authenticate/options")
    public ResponseEntity<?> getAuthenticationOptions(@RequestParam String username) {
        try {
            AssertionRequest assertionRequest = webAuthnService.startAuthentication(username);
            return ResponseEntity.ok(assertionRequest.getPublicKeyCredentialRequestOptions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to start authentication: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> finishAuthentication(
        @RequestParam String username,
        @RequestBody PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> credential
    ) {
        try {
            boolean success = webAuthnService.finishAuthentication(username, credential);
            if (success) {
                return ResponseEntity.ok("Authentication successful");
            } else {
                return ResponseEntity.badRequest().body("Authentication failed");
            }
        } catch (AssertionFailedException e) {
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal server error: " + e.getMessage());
        }
    }
    
    @GetMapping("/has-passkeys")
    public ResponseEntity<?> hasPasskeys(@RequestParam String username) {
        try {
            boolean hasPasskeys = webAuthnService.hasPasskeys(username);
            return ResponseEntity.ok(Map.of("hasPasskeys", hasPasskeys));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error checking passkeys: " + e.getMessage());
        }
    }
}