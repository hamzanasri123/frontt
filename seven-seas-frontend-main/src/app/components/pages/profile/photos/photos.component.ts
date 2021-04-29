import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/users.interface';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  constructor() { }
  readonly API: string = environment.apiUrl + '/';

  @Input()
  user: User

  imageObject: Array<object>
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  currentIndex: number;

  ngOnInit(): void {
    this.user.pictures.reverse();
    this.imageObject = this.user.pictures.map(picture => {
      return {
        image: this.API + '/' + picture,
        thumbImage: this.API + '/' + picture,
        title: this.user.nom + ' - Pictures'
      };
    });
  }

  showPictures(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
  }

  closeFullScreenEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
    this.selectedImageIndex = -1;
  }

}
