package com.paysplit.backend.controller;

import com.paysplit.backend.model.Invoice;
import com.paysplit.backend.repository.InvoiceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @GetMapping("/{id}")
    public Optional<Invoice> getInvoice(@PathVariable String id) {
        return invoiceRepository.findById(id);
    }

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
