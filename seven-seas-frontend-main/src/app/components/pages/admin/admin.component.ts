import { Component, OnInit } from '@angular/core';
import { EquipmentType } from 'src/app/interfaces/equipments.interface';
import { Report, User } from 'src/app/interfaces/users.interface';
import { AdminService } from 'src/app/services/admin.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as data from "../../../interfaces/countries.json";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

declare var initForm, $: any;
declare var initSidebar, initPopups, loadSvg: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }
  readonly API: string = environment.apiUrl + '/';
  countries = (<any>data).default;

  usersList: User[] = [];
  equipmentTypes: EquipmentType[];
  newEquipmentType: EquipmentType;
  formData: FormData;
  imageSrc: any;
  skip = 0;
  count = 5;

  activeUsersCount = 0;
  newUsers = 0;

  showReportsPannel = false;
  selectedUser: User;
  language: string;
  reports: Report[] = [];

  ngOnInit(): void {
    this.newEquipmentType = new EquipmentType();
    initSidebar();
    initPopups();
    initForm();
    loadSvg();
    this.loadUsers();
    this.adminService.getOverview().subscribe(
      response => {
        this.activeUsersCount = response.data.activeUsers;
        this.newUsers = response.data.newUsers;
      },
      error => {
        console.log(error);
      }
    );

    this.equipmentService.getEquipmentTypes().subscribe(
      res => {
        this.equipmentTypes = res.data;
      },
      err => {
        this.toastr.error('Error while loading homes');
      }
    );
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
    });
  }

  getCountryName(countryCode: string) {
    if (!this.countries) return '';
    let country = this.countries.find(country => country.code === countryCode);
    if (!country) return '';
    return country.name;
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

  createEquipmentType() {
    if (!this.newEquipmentType.name) {
      return;
    }
    this.formData = this.formData || new FormData();
    this.formData.append("name", this.newEquipmentType["name"]);
    this.adminService.createEquipmentType(this.formData).subscribe(
      res => {
        this.equipmentTypes.unshift(res.data);
        this.toastr.success(res.message);
        this.formData = new FormData();
        this.newEquipmentType = new EquipmentType();
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

  loadUsers() {
    this.adminService.getUsers(this.count, this.skip).subscribe(
      response => {
        this.usersList = this.usersList.concat(response.data);
        this.skip += this.count;
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  showReports(user: User) {
    if (this.selectedUser == user) {
      this.showReportsPannel = false;
      this.selectedUser = null;
      return;
    }
    this.selectedUser = user;
    this.adminService.getReports(user._id).subscribe(
      response => {
        this.reports = response.data;
        this.showReportsPannel = true;
      },
      error => {
        this.toastr.error("Error while fetching reports");
      }
    );
  }

  deleteReport(report: Report) {
    Swal.fire({
      title: this.translate.instant('delete_report') + ' ' + report.content + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_report'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        this.adminService.deleteReport(report._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('delete_report'),
                icon: 'success'
              });
          },
          err => {
            Swal.fire({
              title: this.translate.instant('delete_post_error'),
              icon: 'error'
            });
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  }

  deleteCategory(i: number) {
    Swal.fire({
      title: this.translate.instant('delete_category') + ' ' + this.equipmentTypes[i].name + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_category'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        this.adminService.deleteEquipmentType(this.equipmentTypes[i]._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('delete_category'),
                icon: 'success'
              });
            this.equipmentTypes.splice(i, 1);
          },
          err => {
            Swal.fire({
              title: this.translate.instant('delete_post_error'),
              icon: 'error'
            });
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  }

  toggleUserStatus(i: number) {
    console.log(this.usersList[i]);
    this.adminService.updateUserStatus(this.usersList[i]._id, !this.usersList[i].activated).subscribe(
      response => {
        console.log(response);
        this.usersList[i].activated = response.data.activated;
        this.toastr.success("updated status");
      },
      error => {
        this.toastr.error("error");
        console.log(error);
      }
    )
  }
}
