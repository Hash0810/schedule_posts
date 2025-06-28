package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "app_credential", uniqueConstraints = {@UniqueConstraint(columnNames = {"username", "platform"})})
public class AppCredential {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username; // or organizationId, if multi-org
    @Column(nullable = false)
    private String platform; // e.g. "facebook", "twitter"
    @Column(nullable = false)
    private String clientId;
    @Column(nullable = false)
    private String clientSecret;
    @Column(nullable = false)
    private String redirectUri;
}
