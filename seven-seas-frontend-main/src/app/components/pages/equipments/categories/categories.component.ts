import { Component, OnInit } from '@angular/core';
import { Boat, Equipment, EquipmentType, Hebergement } from 'src/app/interfaces/equipments.interface';
import { EquipmentService } from 'src/app/services/equipment.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

declare var initSidebar, initPopups: any;
declare var initForm, $: any;
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  constructor(
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private authService: AuthService,

  ) { }
  currentUser: User
  readonly API: string = environment.apiUrl + '/';

  equipmentTypes: EquipmentType[];
  ngOnInit(): void {

    this.currentUser = this.authService.getCurrentUser();

    initSidebar();
    initPopups();
    initForm();
    this.equipmentService.getEquipmentTypes().subscribe(
      res => {
        this.equipmentTypes = res.data;
      },
      err => {
        this.toastr.error('Error while loading homes');
      }
    )
  }

}
