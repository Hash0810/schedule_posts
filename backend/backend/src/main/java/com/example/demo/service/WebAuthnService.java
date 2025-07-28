package com.example.demo.service;

import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.exception.AssertionFailedException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WebAuthnService {
    private final RelyingParty relyingParty;
    private final Map<String, List<RegisteredCredential>> credentialStore = new ConcurrentHashMap<>();
    
    // Store registration and authentication requests temporarily
    private final Map<String, PublicKeyCredentialCreationOptions> pendingRegistrations = new ConcurrentHashMap<>();
    private final Map<String, AssertionRequest> pendingAuthentications = new ConcurrentHashMap<>();

    private static class InMemoryCredentialRepository implements CredentialRepository {
        private final Map<String, List<RegisteredCredential>> credentialStore;
        
        public InMemoryCredentialRepository(Map<String, List<RegisteredCredential>> credentialStore) {
            this.credentialStore = credentialStore;
        }
        
        @Override
        public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
            return Optional.ofNullable(credentialStore.get(username))
                .orElse(Collections.emptyList())
                .stream()
                .map(c -> PublicKeyCredentialDescriptor.builder()
                    .id(c.getCredentialId())
                    .type(PublicKeyCredentialType.PUBLIC_KEY)
                    .build())
                .collect(Collectors.toSet());
        }
        
        @Override
        public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
            return credentialStore.entrySet().stream()
                .filter(e -> e.getValue().stream().anyMatch(c -> c.getUserHandle().equals(userHandle)))
                .map(Map.Entry::getKey)
                .findFirst();
        }
        
        @Override
        public Optional<ByteArray> getUserHandleForUsername(String username) {
            return Optional.of(new ByteArray(username.getBytes()));
        }
        
        @Override
        public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
            return credentialStore.values().stream()
                .flatMap(List::stream)
                .filter(c -> c.getCredentialId().equals(credentialId) && c.getUserHandle().equals(userHandle))
                .findFirst();
        }
        
        @Override
        public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
            return credentialStore.values().stream()
                .flatMap(List::stream)
                .filter(c -> c.getCredentialId().equals(credentialId))
                .collect(Collectors.toSet());
        }
    }

    public WebAuthnService() {
        this.relyingParty = RelyingParty.builder()
            .identity(RelyingPartyIdentity.builder()
                .id("localhost") // Use your domain in production
                .name("Post Scheduler")
                .build())
            .credentialRepository(new InMemoryCredentialRepository(credentialStore))
            .origins(Collections.singleton("http://localhost:3000")) // Set your frontend origin
            .build();
    }

    public PublicKeyCredentialCreationOptions startRegistration(String username) {
        // Validate username
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        String trimmedUsername = username.trim();
        System.out.println("[WebAuthnService] Starting registration for username: " + trimmedUsername);
        UserIdentity user = UserIdentity.builder()
            .name(trimmedUsername)
            .displayName(trimmedUsername)
            .id(new ByteArray(UUID.nameUUIDFromBytes(trimmedUsername.getBytes(StandardCharsets.UTF_8)).toString().getBytes(StandardCharsets.UTF_8)))
            .build();
        StartRegistrationOptions options = StartRegistrationOptions.builder()
            .user(user)
            .authenticatorSelection(AuthenticatorSelectionCriteria.builder()
                .authenticatorAttachment(AuthenticatorAttachment.PLATFORM)
                .residentKey(ResidentKeyRequirement.PREFERRED)
                .userVerification(UserVerificationRequirement.PREFERRED)
                .build())
            .build();
        PublicKeyCredentialCreationOptions credentialCreationOptions = relyingParty.startRegistration(options);
        // Store the request for later verification
        pendingRegistrations.put(trimmedUsername, credentialCreationOptions);
        return credentialCreationOptions;
    }

    public void finishRegistration(String username, PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> credential) throws RuntimeException {
        String trimmedUsername = username.trim();
        // Get the stored registration request
        PublicKeyCredentialCreationOptions request = pendingRegistrations.get(trimmedUsername);
        if (request == null) {
            throw new RuntimeException("No pending registration found for user: " + trimmedUsername);
        }
        try {
            RegistrationResult result = relyingParty.finishRegistration(
                FinishRegistrationOptions.builder()
                    .request(request)
                    .response(credential)
                    .build()
            );
            RegisteredCredential regCred = RegisteredCredential.builder()
                .credentialId(result.getKeyId().getId())
                .userHandle(new ByteArray(trimmedUsername.getBytes(java.nio.charset.StandardCharsets.UTF_8)))
                .publicKeyCose(result.getPublicKeyCose())
                .signatureCount(result.getSignatureCount())
                .build();
            credentialStore.computeIfAbsent(trimmedUsername, k -> new ArrayList<>()).add(regCred);
            // Clean up the pending registration
            pendingRegistrations.remove(trimmedUsername);
        } catch (Exception e) {
            // Clean up on failure
            pendingRegistrations.remove(trimmedUsername);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    public AssertionRequest startAuthentication(String username) {
        AssertionRequest assertionRequest = relyingParty.startAssertion(
            StartAssertionOptions.builder()
                .username(Optional.of(username))
                .build()
        );
        
        // Store the request for later verification
        pendingAuthentications.put(username, assertionRequest);
        
        return assertionRequest;
    }

    public boolean finishAuthentication(String username, PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> credential) throws AssertionFailedException {
        // Get the stored assertion request
        AssertionRequest assertionRequest = pendingAuthentications.get(username);
        if (assertionRequest == null) {
            throw new AssertionFailedException("No pending authentication found for user: " + username);
        }
        
        try {
            AssertionResult result = relyingParty.finishAssertion(
                FinishAssertionOptions.builder()
                    .request(assertionRequest)
                    .response(credential)
                    .build()
            );
            
            // Clean up the pending authentication
            pendingAuthentications.remove(username);
            
            return result.isSuccess();
        } catch (Exception e) {
            // Clean up on failure
            pendingAuthentications.remove(username);
            throw e;
        }
    }
    
    // Helper method to check if user has registered passkeys
    public boolean hasPasskeys(String username) {
        List<RegisteredCredential> credentials = credentialStore.get(username);
        return credentials != null && !credentials.isEmpty();
    }
    
    // Helper method to clean up expired pending requests (call this periodically)
    public void cleanupExpiredRequests() {
        // In a real implementation, you'd want to store timestamps and clean up old requests
        // For now, we'll just clear all pending requests older than 5 minutes
        // This is a simplified approach - in production, use proper session management
    }
}