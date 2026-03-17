package com.aaryan.expense_intelligence.controller;

import com.aaryan.expense_intelligence.entity.Transaction;
import com.aaryan.expense_intelligence.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        return service.addTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getTransactions() {
        return service.getAllTransactions();
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        service.deleteTransaction(id);
    }
}