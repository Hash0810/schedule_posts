package com.example.demo.repository;

import com.example.demo.model.AppCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppCredentialRepository extends JpaRepository<AppCredential, Long> {
    Optional<AppCredential> findByUsernameAndPlatform(String username, String platform);
}
