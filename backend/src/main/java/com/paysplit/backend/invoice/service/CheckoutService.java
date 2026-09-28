package com.paysplit.backend.invoice.service;


import com.paysplit.backend.config.PayazaProperties;
import com.paysplit.backend.invoice.dto.CheckoutConfigResponse;
import com.paysplit.backend.invoice.model.Invoice;
import com.paysplit.backend.invoice.model.InvoiceStatus;
import com.paysplit.backend.invoice.repository.InvoiceRepository;
import com.paysplit.backend.payment.service.SplitAccountsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final InvoiceRepository invoiceRepository;
    private final PayazaProperties payazaProperties;
    private final SplitAccountsService splitAccountsService;

    @Transactional
    public CheckoutConfigResponse getCheckoutConfig(String invoiceId) {
        Invoice inv = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));

        if (inv.getStatus() == InvoiceStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invoice already paid");
        }
        if (inv.getStatus() == InvoiceStatus.FAILED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invoice failed");
        }

        if (inv.getTransactionReference() == null || inv.getTransactionReference().isBlank()) {
            String ref = "PSA-" + inv.getId() + "-" + Instant.now().getEpochSecond();
            inv.setTransactionReference(ref);
            invoiceRepository.save(inv);
        }

        String fullName = inv.getClientName() != null ? inv.getClientName().trim() : "Client";
        String firstName = fullName;
        String lastName = "Customer";
        int space = fullName.indexOf(' ');
        if (space > 0) {
            firstName = fullName.substring(0, space);
            lastName = fullName.substring(space + 1).trim();
            if (lastName.isEmpty()) lastName = "Customer";
        }

        return new CheckoutConfigResponse(
                payazaProperties.merchantKey(),
                payazaProperties.connectionMode(),
                inv.getAmount(),
                inv.getCurrencyCode(),
                inv.getClientEmail(),
                firstName,
                lastName,
                inv.getClientPhone() != null ? inv.getClientPhone() : "",
                inv.getTransactionReference(),
                splitAccountsService.buildForInvoice(inv)
        );
    }
}
