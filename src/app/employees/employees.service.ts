import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {Employee} from './interfaces/employeeInterface';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private employees: Employee[] = [];
  employees$ = new BehaviorSubject<Employee[]>([]);

  constructor(private toastr: ToastrService, private ngxIndexedDBService: NgxIndexedDBService, private router: Router) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.ngxIndexedDBService.getAll('employees').subscribe((res:any) => {
      this.employees$.next(res)
    }, error => {
      this.toastr.error('Sorry! could not fetch employee details at the moment. Please try in sometime', 'Toastr fun!');
    });
  }

  addEmployee(employee: Employee) {
    this.ngxIndexedDBService.add('employees', employee)
      .subscribe(() =>  {
        this.loadEmployees();
        this.toastr.success('Employee details successfully added', '');
        this.router.navigate(['/employees']);
      }, (error) => {this.toastr.error('Employee details saving failed due to some reason', 'Toastr fun!');}); // Update data and emit signal
  }

  updateEmployee(employee: Employee) {
    this.ngxIndexedDBService.update('employees', employee)
      .subscribe(() => {
        this.loadEmployees();
        this.toastr.success('Employee details successfully update', '');
        this.router.navigate(['/employees']);
      },(error) => {this.toastr.error('Employee details saving failed due to some reason');}); // Update data and emit signal
  }

  deleteEmployee(id: number) {
    this.ngxIndexedDBService.delete('employees', id)
      .subscribe(() => {
        this.loadEmployees()
        this.toastr.success('Employee details successfully deleted', '');
      },(error) => {this.toastr.error('Employee details delete failed due to some reason');}); // Update data and emit signal
  }

  getEmployees():Employee[] {
    return this.employees.slice(); // Return a copy to avoid mutation
  }

  getEmployeeById(id: number): Observable<Employee | null> {
    return this.ngxIndexedDBService.getByKey('employees', id);
  }
}
