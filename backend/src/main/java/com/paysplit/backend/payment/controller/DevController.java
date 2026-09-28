package com.paysplit.backend.payment.controller;

import com.paysplit.backend.invoice.model.Invoice;
import com.paysplit.backend.invoice.repository.InvoiceRepository;
import com.paysplit.backend.payment.service.PayazaWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class DevController {

    private final InvoiceRepository invoiceRepository;
    private final PayazaWebhookService webhookService;

    /**
     * Dev-only: simulate a Payaza "Completed" webhook for the given invoice.
     * Use only in the demo fallback when the sandbox doesn't fire a real webhook.
     */
    @PostMapping("/simulate-paid/{invoiceId}")
    public Map<String, Object> simulatePaid(@PathVariable String invoiceId) throws Exception {
        Invoice inv = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceId));

        String ref = inv.getTransactionReference();
        if (ref == null || ref.isBlank()) {
            throw new RuntimeException("Invoice has no transaction_reference");
        }

        String payload = "{\"merchant_reference\":\"" + ref
                + "\",\"transaction_reference\":\"P-C-SIMULATED\",\"status\":\"Completed\"}";

        log.info("DEV simulate-paid for invoice={} ref={}", invoiceId, ref);
        webhookService.handle(payload);

        return Map.of("ok", true, "invoiceId", invoiceId, "ref", ref);
    }
}
