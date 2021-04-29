import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/posts.interface';
import { User } from 'src/app/interfaces/users.interface';
import { PostService } from 'src/app/services/post.service';
import { environment } from 'src/environments/environment';
import * as data from "../../../../interfaces/countries.json";

declare var initContent: any;
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  constructor(
    private postService: PostService,

  ) { }
  @Input()
  user: User
  countries = (<any>data).default;
  posts: Post[];
  readonly API: string = environment.apiUrl + '/';

  ngOnInit(): void {
    initContent();
    if (this.user) {
      this.postService.getUserPosts(this.user._id).subscribe(
        postResponse => {
          this.posts = postResponse.data;
          console.log(this.posts);
        },
        postError => {
          console.log(postError);
        }
      )
    }

  }

  getCountryName(countryCode: string) {
    if (!this.countries) return '';
    let country = this.countries.find(country => country.code === countryCode);
    if (!country) return '';
    return country.name;
  }

}
