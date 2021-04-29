import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/users.interface';
@Component({
  selector: 'app-profile-social',
  templateUrl: './profile-social.component.html',
  styleUrls: ['./profile-social.component.scss']
})
export class ProfileSocialComponent implements OnInit {

  constructor() { }
  @Input()
  user: User

  ngOnInit(): void {
  }

}
