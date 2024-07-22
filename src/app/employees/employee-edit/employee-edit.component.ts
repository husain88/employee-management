import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../employees.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleSelectComponent } from '../role-select/role-select.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import {Employee} from '../interfaces/employeeInterface';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: any = null;
  selectedRole = '';
  model!: NgbDateStruct;
	today = this.calendar.getToday();

  constructor(
    private calendar: NgbCalendar,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeesService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.route.params
      .subscribe((params) => {
          this.employeeId = Number(params['id']);
          this.employeeService.getEmployeeById(this.employeeId).subscribe((employee:any) => {
            const isoStartString = employee.startDate;
            const sdate = new Date(isoStartString);
            const syear = sdate.getFullYear();
            const smonth = sdate.getMonth() + 1; // months are 0-based, so add 1
            const sday = sdate.getDate();
            const sFinal = { year: syear, month: smonth, day: sday };

            const isoEndString = employee.endDate;
            const edate = new Date(isoEndString);
            const eyear = edate.getFullYear();
            const emonth = edate.getMonth() + 1; // months are 0-based, so add 1
            const eday = edate.getDate();
            const eFinal = { year: eyear, month: emonth, day: eday };
            const employeeData = {
              name: employee.name,
              role: employee.role,
              startDate: employee.startDate ? sFinal : null,
              endDate: employee.endDate ? eFinal : null
            }
            this.employeeForm.patchValue(employeeData); // Pre-populate form with employee data
          })
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
    if (this.employeeForm.valid && this.employeeForm.valid && this.employeeId) {
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
        id: this.employeeId,
      };
      this.employeeService.updateEmployee(newEmployee);
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
