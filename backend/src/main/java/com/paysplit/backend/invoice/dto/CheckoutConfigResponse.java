package com.paysplit.backend.invoice.dto;


import java.math.BigDecimal;
import java.util.List;
import com.paysplit.backend.payment.dto.SplitAccountDto;

public record CheckoutConfigResponse(
        String merchantKey,
        String connectionMode,
        BigDecimal checkoutAmount,
        String currencyCode,
        String emailAddress,
        String firstName,
        String lastName,
        String phoneNumber,
        String transactionReference,
        List<SplitAccountDto> splitAccounts   // optional for SDK; can be empty list for now
) {}
