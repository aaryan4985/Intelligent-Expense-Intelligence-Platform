package com.aaryan.expense_intelligence.controller;

import com.aaryan.expense_intelligence.entity.Transaction;
import com.aaryan.expense_intelligence.entity.User;
import com.aaryan.expense_intelligence.service.TransactionService;
import com.aaryan.expense_intelligence.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;
    private final UserService userService;

    public TransactionController(TransactionService service,
            UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        transaction.setUser(user);

        return service.addTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getTransactions(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return service.getUserTransactions(user);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {

        service.deleteTransaction(id);
    }
}