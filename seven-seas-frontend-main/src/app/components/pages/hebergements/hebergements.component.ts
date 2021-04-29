import { Component, OnInit } from '@angular/core';
import { Boat, Hebergement } from 'src/app/interfaces/equipments.interface';
import { EquipmentService } from 'src/app/services/equipment.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

declare var initSidebar, initPopups, loadSvg: any;
declare var initForm, $: any;

@Component({
  selector: 'app-hebergements',
  templateUrl: './hebergements.component.html',
  styleUrls: ['./hebergements.component.scss']
})
export class HebergementsComponent implements OnInit {

  constructor(
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authService: AuthService,

  ) { }

  readonly API: string = environment.apiUrl + '/';

  currentUser: User

  formData: FormData;
  imageSrc: any;
  newHome: Hebergement;

  userHomes: Hebergement[] = [];

  selectedHome = -1;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.newHome = new Hebergement();
    this.newHome.price = 0;
    initSidebar();
    initPopups();
    initForm();
    loadSvg();
    this.equipmentService.getHebergementsByUser(this.currentUser._id).subscribe(
      res => {
        this.userHomes = res.data;
      },
      err => {
        this.toastr.error('Error while loading homes');
      }
    );
  }

  fileChange(event) {
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

  createHebergement() {
    if (!this.newHome.name) {
      return;
    }
    this.formData = this.formData || new FormData();
    for (const key in this.newHome) {
      if (this.newHome.hasOwnProperty(key)) {
        this.formData.append(key, this.newHome[key]);
      }
    }
    if (this.newHome.position) {
      this.formData.append('lat', this.newHome.position['lat']);
      this.formData.append('lng', this.newHome.position['lng']);
    }
    this.equipmentService.createHebergement(this.formData).subscribe(
      res => {
        this.userHomes.unshift(res.data);
        this.toastr.success(res.message);
        this.formData = new FormData();
        this.newHome = new Hebergement();
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

  openFileInput() {
    $("#postPhoto").click();
  }

  deleteHebergement(i) {
    Swal.fire({
      title: this.translate.instant('delete_home') + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_home'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        this.equipmentService.deleteHebergement(this.userHomes[i]._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('deleted_home'),
                icon: 'success'
              });
            this.userHomes.splice(i, 1);
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

  updateHebergement() {
    this.formData = this.formData || new FormData();
    for (const key in this.userHomes[this.selectedHome]) {
      if (this.userHomes[this.selectedHome].hasOwnProperty(key)) {
        this.formData.append(key, this.userHomes[this.selectedHome][key]);
      }
    }
    if (this.userHomes[this.selectedHome].position) {
      this.formData.append('lat', this.userHomes[this.selectedHome].position['lat']);
      this.formData.append('lng', this.userHomes[this.selectedHome].position['lng']);
    }
    this.equipmentService.updateHebergement(this.formData, this.userHomes[this.selectedHome]._id).subscribe(
      res => {
        this.toastr.success(res.message);
        this.formData = new FormData();
        this.newHome = new Hebergement();
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
    this.imageSrc = "";
    this.selectedHome = i;
    $("#updateBtn").click();
  }

}
