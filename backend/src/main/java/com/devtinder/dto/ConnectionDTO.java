package com.devtinder.dto;

import lombok.Data;
import java.util.List;

@Data
public class ConnectionDTO {
    private Long id;
    private String email;
    private String name;
    private String bio;
    private String location;
    private List<String> skills;
}