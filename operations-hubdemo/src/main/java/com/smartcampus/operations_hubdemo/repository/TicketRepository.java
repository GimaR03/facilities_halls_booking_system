package com.smartcampus.operations_hubdemo.repository;

import com.smartcampus.operations_hubdemo.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
