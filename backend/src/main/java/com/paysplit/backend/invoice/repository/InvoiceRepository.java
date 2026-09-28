package com.paysplit.backend.invoice.repository;

import com.paysplit.backend.invoice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Optional<Invoice> findByTransactionReference(String transactionReference);
}
