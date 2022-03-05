import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input() userId: any;
  user: any;
  isLoading = true;
  constructor(private appService: AppService) { }

  async ngOnInit(): Promise<void> {
    const response = await this.appService.getUser(this.userId);
    this.isLoading = false;
    if(response.status) {
      this.user = response.data;
    }
  }

}
