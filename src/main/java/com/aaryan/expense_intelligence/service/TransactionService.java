package com.aaryan.expense_intelligence.service;

import com.aaryan.expense_intelligence.entity.Transaction;
import com.aaryan.expense_intelligence.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public Transaction addTransaction(Transaction transaction) {
        return repository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    public void deleteTransaction(Long id) {
        repository.deleteById(id);
    }
}