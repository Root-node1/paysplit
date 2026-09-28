package com.paysplit.backend.invoice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Entity
@Table(
        name = "invoices",
        indexes = {
                @Index(name = "idx_invoices_status", columnList = "status"),
                @Index(name = "idx_invoices_transaction_reference", columnList = "transaction_reference")
        }
)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;

    @Column(name = "agency_id", length = 36)
    private String agencyId;

    @Column(name = "creator_id", length = 36)
    private String creatorId;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_email", nullable = false)
    private String clientEmail;

    @Column(name = "client_phone", length = 50)
    private String clientPhone;

    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "currency_code", nullable = false, length = 3)
    private String currencyCode;

    @Column(name = "creator_share_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal creatorSharePercent;

    @Column(name = "agency_share_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal agencySharePercent;

    @Column(name = "platform_share_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal platformSharePercent;

    @Column(name = "transaction_reference", unique = true, length = 100)
    private String transactionReference;

    @Column(name = "payaza_reference", length = 100)
    private String payazaReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private InvoiceStatus status = InvoiceStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "paid_at")
    private Instant paidAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (status == null) {
            status = InvoiceStatus.PENDING;
        }
    }

    // --- computed (not persisted) ---

    @Transient
    public BigDecimal getCreatorAmount() {
        return portion(creatorSharePercent);
    }

    @Transient
    public BigDecimal getAgencyAmount() {
        return portion(agencySharePercent);
    }

    @Transient
    public BigDecimal getPlatformAmount() {
        return portion(platformSharePercent);
    }

    private BigDecimal portion(BigDecimal percent) {
        if (amount == null || percent == null) {
            return BigDecimal.ZERO;
        }
        return amount.multiply(percent)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
    }

    // --- getters / setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(String agencyId) {
        this.agencyId = agencyId;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public BigDecimal getCreatorSharePercent() {
        return creatorSharePercent;
    }

    public void setCreatorSharePercent(BigDecimal creatorSharePercent) {
        this.creatorSharePercent = creatorSharePercent;
    }

    public BigDecimal getAgencySharePercent() {
        return agencySharePercent;
    }

    public void setAgencySharePercent(BigDecimal agencySharePercent) {
        this.agencySharePercent = agencySharePercent;
    }

    public BigDecimal getPlatformSharePercent() {
        return platformSharePercent;
    }

    public void setPlatformSharePercent(BigDecimal platformSharePercent) {
        this.platformSharePercent = platformSharePercent;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getPayazaReference() {
        return payazaReference;
    }

    public void setPayazaReference(String payazaReference) {
        this.payazaReference = payazaReference;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Instant paidAt) {
        this.paidAt = paidAt;
    }
}