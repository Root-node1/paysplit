package com.paysplit.backend.payment.service;

import com.paysplit.backend.config.PayazaProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayazaVerificationService {

    private final PayazaProperties props;

    /**
     * Returns true if Payaza confirms success, or if local/test skip is on.
     */
    public boolean verifyTransaction(String transactionReference) {
        if (props.webhookSkipSignature()) {
            log.info("Skip remote verify (local/test) ref={}", transactionReference);
            return true;
        }
        try {
            RestClient client = RestClient.builder()
                    .baseUrl(props.baseUrl())
                    .build();

            var response = client.get()
                    .uri("/transaction/status/{ref}", transactionReference)
                    .header("Authorization", "Bearer " + props.secretKey())
                    .retrieve()
                    .toEntity(String.class);

            log.info("Payaza status HTTP {} for ref={}", response.getStatusCode(), transactionReference);
            return response.getStatusCode().is2xxSuccessful()
                    && response.getBody() != null
                    && response.getBody().toLowerCase().contains("success");
        } catch (Exception e) {
            log.error("Verify failed ref={}: {}", transactionReference, e.getMessage());
            return false;
        }
    }
}