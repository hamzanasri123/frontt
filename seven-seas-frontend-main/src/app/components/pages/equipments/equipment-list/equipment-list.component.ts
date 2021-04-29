import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Equipment, EquipmentType } from 'src/app/interfaces/equipments.interface';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var initForm, $: any;
declare var initSidebar, initPopups: any;

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private equipmentService: EquipmentService,
    private translate: TranslateService,
    private modalService: NgbModal

  ) { }
  readonly API: string = environment.apiUrl + '/';

  currentUser: User
  equipments: Equipment[];
  equipmentType: EquipmentType;
  formData: FormData;
  imageSrc: any;
  newEquipment: Equipment;

  
  userEquipements: Equipment[] = [];
  selectedEquipment = -1;



  ngOnInit(): void {
    initForm();
    initSidebar();
    initPopups();
    this.currentUser = this.authService.getCurrentUser();

    this.route.params.subscribe(params => {
      let typeId = params.typeId;
      if (!typeId) {
        this.router.navigate(['/equipments']);
      }
      this.initEquipments(typeId);
    })
  }

  initEquipments(typeId: string) {
    this.newEquipment = new Equipment();
    this.equipmentService.getEquipmentsByTypeAndUser(typeId, this.currentUser._id).subscribe(
      res => {
        console.log(res);

        this.equipmentType = res.data.type;
        this.equipments = res.data.equipments
      }
    )
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    console.log(event.target.files);
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.formData = new FormData();
      this.formData.append('file', file, file.name);
      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = e.target['result'];
      };
      reader.readAsDataURL(fileList[0]);
    }
  }

  createEquipment() {
    if (!this.newEquipment.name) {
      return;
    }
    this.formData = this.formData || new FormData();
    this.newEquipment.type = this.equipmentType._id;
    for (const key in this.newEquipment) {
      if (this.newEquipment.hasOwnProperty(key)) {
        this.formData.append(key, this.newEquipment[key]);
      }
    }
    this.equipmentService.createEquipment(this.formData).subscribe(
      res => {
        this.equipments.unshift(res.data);
        this.toastr.success(res.message);
        this.newEquipment = new Equipment();
      },
      err => {
        console.log(err);
        this.toastr.error(err.error.message);
      }
    )
  }

  openFileInput() {
    $("#postPhoto").click();
  }

  deleteEquipment(i) {
    Swal.fire({
      title: this.translate.instant('delete_equipment') + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_equipment'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        this.equipmentService.deleteEquipment(this.equipments[i]._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('deleted_equipment'),
                icon: 'success'
              });
            this.equipments.splice(i, 1);
          },
          err => {
            Swal.fire({
              title: this.translate.instant('delete_error'),
              icon: 'error'
            });
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    })
  }
  onUpdateEquipement() {
    this.formData = this.formData || new FormData();
    for (const key in this.equipments[this.selectedEquipment]) {
      if (this.equipments[this.selectedEquipment].hasOwnProperty(key)) {
        this.formData.append(key, this.equipments[this.selectedEquipment][key]);
      }
    }
    this.equipmentService.updateEquipment(this.formData, this.equipments[this.selectedEquipment]._id).subscribe(
      res => {
        this.toastr.success(res.message);
        this.formData = new FormData();
        this.imageSrc = "";
        this.modalService.dismissAll();
      },
      err => {
        this.imageSrc = "";
        console.log(err);
        this.toastr.error(err.error.message);
      },
      () => {
      }
    )
  }
  openUpdatePopup(i) {
    initForm();
    this.imageSrc = "";
    this.selectedEquipment = i;
    $("#updateBtn").click();
  }

  openVerticallyCentered(content,i) {
    this.modalService.open(content, { centered: true });
    this.selectedEquipment = i;
  }
}