import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.css'],
  animations: [
    trigger('dialogAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition('* => void', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})

export class RoleSelectComponent {
  roles = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];
  selectedRole: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<RoleSelectComponent>) {

  }
  onSelectRole(role: string) {
    this.dialogRef.close(role);
  }
}