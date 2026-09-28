package com.paysplit.backend.invoice.controller;

import com.paysplit.backend.invoice.dto.CheckoutConfigResponse;
import com.paysplit.backend.invoice.model.Invoice;
import com.paysplit.backend.invoice.repository.InvoiceRepository;
import com.paysplit.backend.invoice.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final CheckoutService checkoutService;

    public InvoiceController(InvoiceRepository invoiceRepository, CheckoutService checkoutService) {
        this.invoiceRepository = invoiceRepository;
        this.checkoutService = checkoutService;
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

    // NEW — single source of transaction_reference generation
    @GetMapping("/{id}/checkout")
    public CheckoutConfigResponse getCheckoutConfig(@PathVariable String id) {
        return checkoutService.getCheckoutConfig(id);
    }
}
