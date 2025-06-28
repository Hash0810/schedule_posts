package com.example.demo.repository;

import com.example.demo.model.SocialToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocialTokenRepository extends JpaRepository<SocialToken, Long> {
    Optional<SocialToken> findByUsernameAndPlatform(String username, String platform);
}
