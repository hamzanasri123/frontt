import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Boat, Hebergement } from 'src/app/interfaces/equipments.interface';
import { Report, User } from 'src/app/interfaces/users.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

declare var initSidebar, initHexagons: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private equipmentService: EquipmentService,
    private translate: TranslateService,
    private toastr: ToastrService,

  ) { }

  readonly API: string = environment.apiUrl;

  user: User
  currentUser: User
  profilePicture: HTMLInputElement;
  isFollowing = false;

  activeTab = 0;

  hebergements: Hebergement[];
  boats: Boat[];

  coverImageObject: Array<object>
  showCoversFlag: boolean = false;
  selectedCoverImageIndex: number = -1;
  currentIndex: number;

  ngOnInit(): void {
    this.profilePicture = this.el.nativeElement.querySelector(
      '#profilePicture'
    );
    initHexagons();
    initSidebar();
    this.currentUser = this.authService.getCurrentUser();
    this.route.params.subscribe(params => {
      let id = params.id;
      if (!id) {
        let profileUrl = '/profile/' + (this.currentUser.slug || this.currentUser._id);
        this.router.navigate([profileUrl]);
      }
      this.initProfile(id);
    })
  }

  initProfile(userId: string) {
    this.userService.getUser(userId).subscribe(
      res => {
        this.user = res.data;
        console.log(this.user);
        this.user.coverPictures.reverse();
        if (this.user.coverPictures.length) {
          this.user.coverPicture = this.API + '/' + this.user.coverPictures[0];
          this.coverImageObject = this.user.coverPictures.map(picture => {
            return {
              image: this.API + '/' + picture,
              thumbImage: this.API + '/' + picture,
              title: this.user.nom + ' - Cover Pictures'
            };
          });
        }
        this.profilePicture.setAttribute('data-src', this.API + '/' + this.user.profilePicture);
        this.isFollowing = this.user.followers.includes(this.currentUser._id);
        initHexagons();
        this.equipmentService.getHebergementsByUser(this.user._id).subscribe(
          response => {
            this.hebergements = response.data;
          }
        );
        this.equipmentService.getBoatsByUser(this.user._id).subscribe(response => {
          this.boats = response.data;
        });
      },
      err => { }
    );

  }

  urlify(link) {
    if (!link) return "";
    return (link.indexOf('://') === -1) ? 'http://' + link : link;

  }

  follow() {
    this.userService.follow(this.user._id, !this.isFollowing).subscribe(
      res => {
        this.isFollowing = !this.isFollowing;
        this.user.followers = res.data.followers;
      },
      err => {
        console.log(err);
      }
    )
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  closeFullScreenEventHandler() {
    this.currentIndex = -1;
    this.showCoversFlag = false;
    this.selectedCoverImageIndex = -1;
  }

  showCoverFullScreen(index) {
    this.selectedCoverImageIndex = index;
    this.showCoversFlag = true;
  }

  async OpenReportSwal() {
    const swal: { isConfirmed: Boolean, value: string } = await Swal.fire({
      title: this.translate.instant('report') + ' ' + this.user.nom + '?',
      input: 'text',
      icon: 'question',
      inputLabel: this.translate.instant('report_reason'),
      cancelButtonText: this.translate.instant('discard'),
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return this.translate.instant('report_reason_unvalid');
        }
      }
    });
    if (swal.isConfirmed) {
      let report = new Report();
      report.author = this.currentUser;
      report.content = swal.value;
      report.receiver = this.user;
      this.userService.reportUser(report).subscribe(
        res => {
          this.toastr.success(res.content, this.translate.instant('reported') + ' ' + this.user.nom);
        },
        err => {
          this.toastr.error(err.error.message);
        }
      )
    }
  }

}
