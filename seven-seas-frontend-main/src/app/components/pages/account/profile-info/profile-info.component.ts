import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { User } from 'src/app/interfaces/users.interface';
import { environment } from 'src/environments/environment';
import * as data from "../../../../interfaces/countries.json";
import { Utils } from '../../../../services/utils';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

declare var initHexagons, $: any;

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private userService: UserService,
    private toastr: ToastrService,

  ) { }
  @Input()
  user: User
  countries = (<any>data).default || [];
  readonly API: string = environment.apiUrl;
  profilePicture: HTMLInputElement;
  formData: FormData;

  ngOnInit(): void {
    this.profilePicture = this.el.nativeElement.querySelector(
      '#profilePicture'
    );
    if (this.profilePicture) {
      this.profilePicture.setAttribute('data-src', this.API + '/' + this.user.profilePicture);
    }
    initHexagons();
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.formData = new FormData();
      this.formData.append('file', file, file.name);
      this.userService.updateProfilePicture(this.formData).subscribe(
        res => {
          this.profilePicture.setAttribute('data-src', this.API + '/' + res.data.profilePicture);
          initHexagons();
          localStorage.setItem("profilePicture", res.data.profilePicture);
        }, err => {
          console.log(err);
        }
      )
    }
  }

  openProfilePictureInput() {
    $("#profilePictureInput").click();
  }

  coverFileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData = new FormData();
      formData.append('file', file, file.name);
      this.userService.updateCover(formData).subscribe(
        res => {
          this.toastr.success("Cover updated!");
        }, err => {
          console.log(err);
        }
      )
    }
  }

  openCoverInput() {
    $("#coverPictureInput").click();
  }

}
