package com.aaryan.expense_intelligence.service;

import com.aaryan.expense_intelligence.entity.Transaction;
import com.aaryan.expense_intelligence.entity.User;
import com.aaryan.expense_intelligence.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public Transaction addTransaction(Transaction transaction) {
        return repository.save(transaction);
    }

    public List<Transaction> getUserTransactions(User user) {
        return repository.findByUser(user);
    }

    public void deleteTransaction(Long id) {
        repository.deleteById(id);
    }

    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        return repository.findById(id).map(transaction -> {
            transaction.setAmount(updatedTransaction.getAmount());
            transaction.setType(updatedTransaction.getType());
            transaction.setCategory(updatedTransaction.getCategory());
            transaction.setDescription(updatedTransaction.getDescription());
            transaction.setDate(updatedTransaction.getDate());
            return repository.save(transaction);
        }).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public Map<String, Double> getTransactionSummary(User user) {
        List<Transaction> transactions = repository.findByUser(user);
        double totalIncome = transactions.stream()
                .filter(t -> "income".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        double totalExpense = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        Map<String, Double> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("balance", totalIncome - totalExpense);
        return summary;
    }
}