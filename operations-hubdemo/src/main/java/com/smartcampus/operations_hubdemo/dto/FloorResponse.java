package com.smartcampus.operations_hubdemo.dto;

public record FloorResponse(
        Long id,
        Long buildingId,
        Integer floorNumber,
        String label
) {
}
