import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HammerModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from "@angular/platform-browser";
import * as Hammer from 'hammerjs';
import { SwipeLeftDirective } from './../shared/directives/swipe-left.directive';
import { RoleSelectComponent } from './role-select/role-select.component'; // <--- Add this import
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add', component: EmployeeAddComponent },
  { path: ':id/edit', component: EmployeeEditComponent },
];
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

const dbConfig = {
  name: 'employee-management', // Your desired database name
  version: 1, // Database version (increment for schema changes)
  objectStoresMeta: [{
    store: 'employees', // Name of the object store
    storeConfig: { keyPath: 'id', autoIncrement: true }, // Use auto-incrementing ID as key
    storeSchema: [ // Define properties for each data field
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'role', keypath: 'role', options: { unique: false } },
      { name: 'startDate', keypath: 'startDate', options: { unique: false } },
      { name: 'endDate', keypath: 'endDate', options: { unique: false } },
    ]
  }],
};

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeAddComponent,
    EmployeeEditComponent,
    SwipeLeftDirective,
    RoleSelectComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxIndexedDBModule.forRoot(dbConfig),
    ReactiveFormsModule,
    HammerModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    NgbInputDatepicker,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    })
  ],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }],
  exports: [
    RouterModule, // Optional, if other modules need access to these routes
    SwipeLeftDirective
  ],
})
export class EmployeesModule { }
