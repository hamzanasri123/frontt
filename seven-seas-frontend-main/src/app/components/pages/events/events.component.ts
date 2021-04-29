import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event.interface';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { User } from 'src/app/interfaces/users.interface';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';
import {CalendarEvent,} from 'angular-calendar';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var initSidebar, initPopups: any;
declare var initForm, $: any;
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal

  ) { }
  currentUser: User;
  newEvent: Event;
  monthEvents: Event[] = [];
  todayEvents: Event[] = [];
  upcomingEvents: Event[] = [];
  calendarEvents: CalendarEvent[] = [];
  dates: Date[] = [new Date()];
  today: Date;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  formData: FormData;
  imageSrc: any;
  selectedEvent: Event;
  readonly API: string = environment.apiUrl + '/';
  events:Event[];
  selectedEvents=-1;

  ngOnInit(): void {
    this.today = new Date();
    initSidebar();
    initPopups();
    initForm();
    this.newEvent = new Event();
    this.showCalendarEvents(this.today);
    this.eventService.getUpcoming().subscribe(
      res => {
        this.upcomingEvents = res.data;
      },
      err => {
        this.toastr.error(err.error.message);
      }
    );
  }

  showCalendarEvents(date: Date) {
    this.eventService.getEventByMonth(date.getMonth()).subscribe(
      res => {
        this.monthEvents = res.data;
        this.calendarEvents = this.monthEvents.map(
          event => {
            if (!event.endDate) {
              event.endDate = event.startDate;
            }
            return {
              start: new Date(event.startDate),
              end: new Date(event.endDate),
              title: event.name

            } as CalendarEvent
          }
        );
        this.todayEvents = this.monthEvents.filter(
          event => moment().isSame(new Date(event.startDate), 'day')
        );
      },
      err => {
        this.toastr.error(err.error.message);
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

  createEvent() {
    if (!this.newEvent.name) {
      return;
    }
    this.formData = this.formData || new FormData();
    this.newEvent.startDate = this.dates[0];
    this.newEvent.endDate = this.dates[1] || this.dates[0];
    for (const key in this.newEvent) {
      if (this.newEvent.hasOwnProperty(key)) {
        this.formData.append(key, this.newEvent[key]);
      }
    }
    if (this.newEvent.position) {
      this.formData.append('lat', this.newEvent.position['lat']);
      this.formData.append('lng', this.newEvent.position['lng']);
    }
    this.eventService.createEvent(this.formData).subscribe(
      res => {
        this.toastr.success(res.message);
        this.showCalendarEvents(this.viewDate);
        this.formData = new FormData();
        $(".popup-close-button.popup-event-creation-trigger").click();
        this.newEvent = new Event();
        this.eventService.getUpcoming().subscribe(
          res => {
            this.upcomingEvents = res.data;
          },
          err => {
            this.toastr.error(err.error.message);
          }
        );
      },
      err => {
        console.log(err);
        this.toastr.error(err.error.message);
      }
    )
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    let dayClicked = moment(date);
    if ((moment(this.viewDate).isSame(dayClicked, 'day') && this.activeDayIsOpen === true) || this.calendarEvents.length == 0) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.viewDate = date;
    this.todayEvents = this.monthEvents.filter(
      event => moment(this.viewDate).isSame(new Date(event.startDate), 'day')
    );
  }

  showEvent(event: Event) {
    console.log('a');
    this.selectedEvent = event;
    $("#eventInformationTrigger").click();
  }

  incrementMonth(delta: number): void {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + delta,
      this.viewDate.getDate());
    this.showCalendarEvents(this.viewDate);

  }
  onDeleteEvent(i) {
    Swal.fire({
      title: this.translate.instant('delete_equipment') + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_equipment'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        console.log(this.upcomingEvents[i]._id);
        
        this.eventService.deleteEvent(this.upcomingEvents[i]._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('deleted_equipment'),
                icon: 'success'
              });
            this.upcomingEvents.splice(i, 1);
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
  onUpdateEvent() {
    this.formData = this.formData || new FormData();
   for (const key in this.events[this.selectedEvents]) {
     if (this.events[this.selectedEvents].hasOwnProperty(key)) {
      this.formData.append(key, this.events[this.selectedEvents][key]);
    }
    }
    this.eventService.updateEvent(this.formData, this.events[this.selectedEvents]._id).subscribe(
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
  openVerticallyCentered(content,i) {
    this.modalService.open(content, { centered: true });
    this.selectedEvents = i;
  }
}
