package com.paysplit.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String clientName;
    private String clientEmail;
    private String clientPhone;

    private BigDecimal amount;
    private String currencyCode;

    private BigDecimal creatorSharePercent;
    private BigDecimal agencySharePercent;
    private BigDecimal platformSharePercent;

    private String transactionReference;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status = InvoiceStatus.PENDING;

    private Instant createdAt = Instant.now();
    private Instant paidAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }

    public BigDecimal getCreatorSharePercent() { return creatorSharePercent; }
    public void setCreatorSharePercent(BigDecimal creatorSharePercent) { this.creatorSharePercent = creatorSharePercent; }

    public BigDecimal getAgencySharePercent() { return agencySharePercent; }
    public void setAgencySharePercent(BigDecimal agencySharePercent) { this.agencySharePercent = agencySharePercent; }

    public BigDecimal getPlatformSharePercent() { return platformSharePercent; }
    public void setPlatformSharePercent(BigDecimal platformSharePercent) { this.platformSharePercent = platformSharePercent; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public InvoiceStatus getStatus() { return status; }
    public void setStatus(InvoiceStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getPaidAt() { return paidAt; }
    public void setPaidAt(Instant paidAt) { this.paidAt = paidAt; }
}
