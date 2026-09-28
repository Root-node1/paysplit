package com.paysplit.backend.config;


import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "payaza")
public record PayazaProperties(
        String merchantKey,
        String secretKey,
        String connectionMode,
        String baseUrl,
        boolean webhookSkipSignature
) {}
