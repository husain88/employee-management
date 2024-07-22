import { Component, OnInit, Signal, computed, signal } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Router } from '@angular/router';
import {Employee} from '../interfaces/employeeInterface';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})

export class EmployeeListComponent implements OnInit {
  currentEmployees: Signal<Employee[]> = signal([]);
  previousEmployees: Signal<Employee[]> = signal([]);

  constructor(private employeeService: EmployeesService, private router: Router) {
  }

  ngOnInit() {
      this.employeeService.employees$.subscribe((res:any) => {
        let employeeList = res;
        this.separateEmployees(employeeList);
      })
  }

  separateEmployees(employees: Employee[]) {
    this.currentEmployees = computed(() => employees.filter(
      (employee) => employee.startDate && !employee.endDate
    ));
    this.previousEmployees = computed(() => employees.filter(
      (employee) => employee.startDate && employee.endDate
    ));
  }

  onEmployeeClick(employeeId: any) {
    this.router.navigate(['/', employeeId, 'edit']); // Route with dynamic ID
  }

  onDeleteItem(event:any, item: any) {
    this.employeeService.deleteEmployee(item.id);
  }
}