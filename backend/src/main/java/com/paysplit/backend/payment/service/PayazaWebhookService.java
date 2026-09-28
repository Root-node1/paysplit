package com.paysplit.backend.payment.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.paysplit.backend.invoice.model.Invoice;
import com.paysplit.backend.invoice.model.InvoiceStatus;
import com.paysplit.backend.invoice.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayazaWebhookService {

    private final InvoiceRepository invoiceRepository;
    private final PayazaVerificationService verificationService;
    private final PayoutStubService payoutStubService;
    private final ObjectMapper objectMapper;

    @Transactional
    public void handle(String rawBody) throws Exception {
        log.info("Payaza webhook received: {}", rawBody);

        JsonNode root = objectMapper.readTree(rawBody);

        String merchantRef = text(root, "merchant_reference");
        String payazaRef = text(root, "transaction_reference");
        String status = text(root, "status");
        String txStatus = text(root, "transaction_status");

        String lookupRef = (merchantRef != null && !merchantRef.isBlank()) ? merchantRef : payazaRef;
        if (lookupRef == null || lookupRef.isBlank()) {
            log.warn("Webhook missing reference");
            return;
        }

        boolean success = "Completed".equalsIgnoreCase(status)
                || "Funds Received".equalsIgnoreCase(txStatus)
                || "SUCCESS".equalsIgnoreCase(status)
                || "successful".equalsIgnoreCase(status);

        boolean failed = "Failed".equalsIgnoreCase(status)
                || "Transaction Failed".equalsIgnoreCase(txStatus);

        Optional<Invoice> opt = invoiceRepository.findByTransactionReference(lookupRef);
        if (opt.isEmpty()) {
            log.warn("No invoice for ref={}", lookupRef);
            return;
        }

        Invoice inv = opt.get();
        if (inv.getStatus() == InvoiceStatus.PAID) {
            log.info("Duplicate webhook ignored ref={}", lookupRef);
            return;
        }

        if (success) {
            if (!verificationService.verifyTransaction(lookupRef)) {
                log.warn("Verification failed — not marking PAID ref={}", lookupRef);
                return;
            }
            inv.setStatus(InvoiceStatus.PAID);
            inv.setPaidAt(Instant.now());
            if (payazaRef != null) {
                inv.setPayazaReference(payazaRef);
            }
            invoiceRepository.save(inv);
            payoutStubService.onInvoicePaid(inv);
            log.info("Invoice {} PAID ref={}", inv.getId(), lookupRef);
        } else if (failed) {
            inv.setStatus(InvoiceStatus.FAILED);
            invoiceRepository.save(inv);
            log.info("Invoice {} FAILED ref={}", inv.getId(), lookupRef);
        }
    }

    private static String text(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }
}
