package com.devtinder.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String bio;
    private String location;
    private String githubUrl;
    private String linkedinUrl;
    private List<String> skills;
    private String experienceLevel;
    private String lookingFor;
}