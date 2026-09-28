package com.paysplit.backend.payment.service;

import com.paysplit.backend.invoice.model.Invoice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Stub: logs intended payouts. Replace with Payaza transfer API + wallets later.
 */
@Slf4j
@Service
public class PayoutStubService {

    public void onInvoicePaid(Invoice inv) {
        BigDecimal amount = inv.getAmount() != null ? inv.getAmount() : BigDecimal.ZERO;
        BigDecimal creator = share(amount, inv.getCreatorSharePercent());
        BigDecimal agency = share(amount, inv.getAgencySharePercent());
        BigDecimal platform = share(amount, inv.getPlatformSharePercent());

        log.info("PAYOUT_STUB invoice={} currency={} creator={} agency={} platform={}",
                inv.getId(), inv.getCurrencyCode(), creator, agency, platform);
        // TODO: credit wallets / call payout API
    }

    private static BigDecimal share(BigDecimal amount, BigDecimal percent) {
        BigDecimal p = percent != null ? percent : BigDecimal.ZERO;
        return amount.multiply(p).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
    }
}
