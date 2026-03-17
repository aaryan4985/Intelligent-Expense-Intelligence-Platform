package com.aaryan.expense_intelligence.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;

}