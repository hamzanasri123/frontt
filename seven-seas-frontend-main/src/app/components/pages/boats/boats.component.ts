import { Component, OnInit } from '@angular/core';
import { Boat } from 'src/app/interfaces/equipments.interface';
import { EquipmentService } from 'src/app/services/equipment.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';

declare var initSidebar, initPopups: any;
declare var initForm, $: any;
@Component({
  selector: 'app-boats',
  templateUrl: './boats.component.html',
  styleUrls: ['./boats.component.scss']
})
export class BoatsComponent implements OnInit {

  constructor(
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,

  ) { }

  readonly API: string = environment.apiUrl + '/';

  currentUser: User

  formData: FormData;
  imageSrc: any;
  newBoat: Boat;

  userBoats: Boat[] = [];

  selectedBoat = -1;


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.newBoat = new Boat();
    initSidebar();
    initPopups();
    initForm();
    this.equipmentService.getBoatsByUser(this.currentUser._id).subscribe(
      res => {
        this.userBoats = res.data;
      },
      err => {
        this.toastr.error('Error while loading boats');
      }
    )
  }

  fileChange(event) {
    this.imageSrc = "";
    let fileList: FileList = event.target.files;
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

  createBoat() {
    if (!this.newBoat.name) {
      return;
    }
    this.formData = this.formData || new FormData();
    for (const key in this.newBoat) {
      if (this.newBoat.hasOwnProperty(key)) {
        this.formData.append(key, this.newBoat[key]);
      }
    }
    this.equipmentService.createBoat(this.formData).subscribe(
      res => {
        this.userBoats.unshift(res.data);
        this.toastr.success(res.message);
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

  removeBoat(i: number) {
    Swal.fire({
      title: this.translate.instant('delete_boat') + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_boat'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        this.equipmentService.deleteBoat(this.userBoats[i]._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('deleted_boat'),
                icon: 'success'
              });
            this.userBoats.splice(i, 1);
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


  updateBoat() {
    this.formData = this.formData || new FormData();
    for (const key in this.userBoats[this.selectedBoat]) {
      if (this.userBoats[this.selectedBoat].hasOwnProperty(key)) {
        this.formData.append(key, this.userBoats[this.selectedBoat][key]);
      }
    }

    this.equipmentService.updateBoat(this.formData, this.userBoats[this.selectedBoat]._id).subscribe(
      res => {
        this.toastr.success(res.message);
        this.formData = new FormData();
        this.imageSrc = "";
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
    this.selectedBoat = i;
    $("#updateBtn").click();
  }

}
