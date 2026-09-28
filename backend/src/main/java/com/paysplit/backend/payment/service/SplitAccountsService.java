package com.paysplit.backend.payment.service;


import com.paysplit.backend.invoice.model.Invoice;
import com.paysplit.backend.payment.dto.SplitAccountDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class SplitAccountsService {

    public List<SplitAccountDto> buildForInvoice(Invoice inv) {
        BigDecimal amount = inv.getAmount() != null ? inv.getAmount() : BigDecimal.ZERO;
        return List.of(
                row("CREATOR", inv.getCreatorSharePercent(), amount),
                row("AGENCY", inv.getAgencySharePercent(), amount),
                row("PLATFORM", inv.getPlatformSharePercent(), amount)
        );
    }

    private SplitAccountDto row(String type, BigDecimal percent, BigDecimal amount) {
        BigDecimal pct = percent != null ? percent : BigDecimal.ZERO;
        BigDecimal share = amount.multiply(pct)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        // accountCode: wire real Payaza beneficiary codes from config/DB later
        return new SplitAccountDto(null, type, pct, share);
    }
}
