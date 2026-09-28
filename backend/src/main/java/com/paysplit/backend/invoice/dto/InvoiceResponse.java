package com.paysplit.backend.invoice.dto;

import com.paysplit.backend.invoice.model.Invoice;
import com.paysplit.backend.invoice.model.InvoiceStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

public record InvoiceResponse(
        String id,
        String clientName,
        String clientEmail,
        String clientPhone,
        BigDecimal amount,
        String currencyCode,
        InvoiceStatus status,
        String transactionReference,
        BigDecimal creatorSharePercent,
        BigDecimal agencySharePercent,
        BigDecimal platformSharePercent,
        BigDecimal creatorAmount,
        BigDecimal agencyAmount,
        BigDecimal platformAmount,
        Instant createdAt,
        Instant paidAt
) {
    public static InvoiceResponse from(Invoice inv) {
        BigDecimal amount = inv.getAmount() != null ? inv.getAmount() : BigDecimal.ZERO;
        BigDecimal cPct = nullSafe(inv.getCreatorSharePercent());
        BigDecimal aPct = nullSafe(inv.getAgencySharePercent());
        BigDecimal pPct = nullSafe(inv.getPlatformSharePercent());

        return new InvoiceResponse(
                inv.getId(),
                inv.getClientName(),
                inv.getClientEmail(),
                inv.getClientPhone(),
                inv.getAmount(),
                inv.getCurrencyCode(),
                inv.getStatus(),
                inv.getTransactionReference(),
                inv.getCreatorSharePercent(),
                inv.getAgencySharePercent(),
                inv.getPlatformSharePercent(),
                pctOf(amount, cPct),
                pctOf(amount, aPct),
                pctOf(amount, pPct),
                inv.getCreatedAt(),
                inv.getPaidAt()
        );
    }

    private static BigDecimal nullSafe(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }

    private static BigDecimal pctOf(BigDecimal amount, BigDecimal percent) {
        return amount.multiply(percent)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
    }
}
