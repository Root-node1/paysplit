package com.paysplit.backend.payment.dto;


import java.math.BigDecimal;

/** Shape depends on Payaza docs — keep flexible for Test. */
public record SplitAccountDto(
        String accountCode,      // Payaza split / beneficiary code when you have it
        String recipientType,    // CREATOR | AGENCY | PLATFORM
        BigDecimal percent,
        BigDecimal amount
) {}
