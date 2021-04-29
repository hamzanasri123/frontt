import { Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Event } from 'src/app/interfaces/event.interface';
import { Post } from 'src/app/interfaces/posts.interface';
import { User } from 'src/app/interfaces/users.interface';
import { EventService } from 'src/app/services/event.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
declare var initContent, initSidebar, initHexagons, $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private postService: PostService,
    private toastr: ToastrService,
    private el: ElementRef,
    private eventService: EventService,
    private userService: UserService,
    private translate: TranslateService,

  ) { }

  readonly API: string = environment.apiUrl + '/';


  posts: Post[] = []
  newPost: Post;
  imageSrc: any;
  formData: FormData;
  upcomingEvents: {} = {};
  feedTab = 0;


  popularUsers: User[];
  newestUsers: User[];
  activeUsers: User[];
  language: string;
  usersActiveTab = 1;

  ngOnInit(): void {
    this.language = this.translate.currentLang;

    this.newPost = new Post();
    initContent();
    initSidebar();
    initHexagons();
    this.postService.getPosts().subscribe(
      res => {
        this.posts.push(...res.data);
      },
      err => {
        this.toastr.error(err.error.message);
      }
    );
    this.eventService.getUpcoming().subscribe(
      res => {
        res.data.forEach(
          event => {
            let day = new Date(event.startDate).toISOString().split('T')[0];
            if (!this.upcomingEvents[day]) this.upcomingEvents[day] = [];
            this.upcomingEvents[day].push(event)
          }
        );
      },
      err => {
        console.log(err);
      }
    );
    this.userService.getFeedUsers().subscribe(
      res => {
        this.popularUsers = res.data.popularUsers;
        this.activeUsers = res.data.activeUsers;
        this.newestUsers = res.data.newestUsers;
      }
    )
  }

  createPost() {
    if (!this.formData && !this.newPost.content) {
      return;
    }
    this.formData = this.formData || new FormData();
    for (const key in this.newPost) {
      if (this.newPost.hasOwnProperty(key)) {
        this.formData.append(key, this.newPost[key]);
      }
    }
    this.postService.createPost(this.formData).subscribe(
      res => {
        this.posts.unshift(res.data);
        this.discardPost();
      },
      err => { console.log(err) }
    )
  }

  discardPost() {
    this.newPost = new Post();
    this.formData = null;
    this.imageSrc = "";
  }

  openFileInput() {
    $("#postPhoto").click();
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

  changeTab(tabIndex: number) {
    if (tabIndex == this.feedTab) {
      return;
    }
    this.posts = [];
    if (tabIndex == 0) {
      this.postService.getPosts().subscribe(
        res => {
          this.posts = res.data;
        },
        err => {
          this.toastr.error(err.error.message);
        }
      );
    } else if (tabIndex == 1) {
      this.postService.getFollowingPosts().subscribe(
        res => {
          this.posts = res.data;
        },
        err => {
          this.toastr.error(err.error.message);
        }
      );
    } else {
      return;
    }
    this.feedTab = tabIndex;
  }

  changeUsersTab(tabIndex: number) {
    this.usersActiveTab = tabIndex;
  }

  deletePost(postId) {
    let pos = this.posts.findIndex(post => post._id == postId);
    if (pos < 0) return;
    this.posts.splice(pos, 1);
  }

}
