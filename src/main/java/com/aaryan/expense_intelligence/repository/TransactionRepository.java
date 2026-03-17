package com.aaryan.expense_intelligence.repository;

import com.aaryan.expense_intelligence.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByType(String type);

}