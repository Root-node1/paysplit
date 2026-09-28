package com.paysplit.backend.payment.service;

import com.paysplit.backend.config.PayazaProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayazaSignatureService {

    private final PayazaProperties props;

    @PostConstruct
    void announce() {
        log.info("PayazaSignatureService configured: webhookSkipSignature={}", props.webhookSkipSignature());
    }

    public boolean isValid(String rawBody, String signatureHeader) {
        if (props.webhookSkipSignature()) {
            log.info("Webhook signature check SKIPPED (payaza.webhook-skip-signature=true)");
            return true;
        }
        if (rawBody == null || signatureHeader == null || signatureHeader.isBlank()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(
                    props.secretKey().getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            String computed = Base64.getEncoder()
                    .encodeToString(mac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8)));
            return MessageDigest.isEqual(
                    computed.getBytes(StandardCharsets.UTF_8),
                    signatureHeader.trim().getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.warn("Signature check failed: {}", e.getMessage());
            return false;
        }
    }
}
