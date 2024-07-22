import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../employees.service';
import { MatDialog} from '@angular/material/dialog';
import { RoleSelectComponent } from '../role-select/role-select.component';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {Employee} from '../interfaces/employeeInterface';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css'],
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  selectedRole = '';
  model!: NgbDateStruct;
	today = this.calendar.getToday();
  constructor(private calendar: NgbCalendar, private fb: FormBuilder, private dialog: MatDialog, private employeeService: EmployeesService) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      startDate: [this.today, Validators.required],
      endDate: [null],
    });
  }

  openRoleSelect(event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(RoleSelectComponent, {
      width: '80%',
      height: '50%',
      panelClass: 'role-dialog',
    }).afterClosed().subscribe((role:string) => {
      if (role) {
        this.selectedRole = role;
        this.employeeForm.get('role')?.setValue(role);
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const startDateControl = this.employeeForm.get('startDate');
      const endDateControl = this.employeeForm.get('endDate');
      let startDate = null;
      let endDate = null;

      if (startDateControl && endDateControl) {
        startDate = this.convertToIso(startDateControl.value);
        endDate = endDateControl.value ? this.convertToIso(endDateControl.value) : null;
        if (startDate && endDate) {
            if (startDate >= endDate) {
              alert('Start date should be less than end date');
              return;
            }
        }
      }

      const employee={
        name: this.employeeForm.get('name')?.value,
        role: this.employeeForm.get('role')?.value,
        startDate: startDate,
        endDate: endDate,
      }
      const newEmployee: Employee = {
        ...employee, // Spread form values onto new employee object
      };
      this.employeeService.addEmployee(newEmployee);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  convertToIso(date: { year: number, month: number, day: number } | Date): string {
    if ('year' in date && 'month' in date && 'day' in date) {
      const isoDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
      return isoDate.toISOString();
    } else if (date instanceof Date) {
      return date.toISOString();
    } else {
      throw new Error('Invalid date type');
    }
  }
}
