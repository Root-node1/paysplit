package com.paysplit.backend.payment.controller;

import com.paysplit.backend.payment.service.PayazaSignatureService;
import com.paysplit.backend.payment.service.PayazaWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/webhooks/payaza")
@RequiredArgsConstructor
public class PayazaWebhookController {

    private final PayazaSignatureService signatureService;
    private final PayazaWebhookService webhookService;

    @PostMapping
    public ResponseEntity<Void> receive(
            @RequestHeader(value = "x-payaza-signature", required = false) String signature,
            @RequestBody String rawBody
    ) {
        if (!signatureService.isValid(rawBody, signature)) {
            log.warn("Invalid Payaza signature");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            webhookService.handle(rawBody);
        } catch (Exception e) {
            log.error("Webhook error: {}", e.getMessage(), e);
        }
        return ResponseEntity.ok().build();
    }
}
