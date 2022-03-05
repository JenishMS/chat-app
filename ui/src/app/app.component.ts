import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  constructor(private appService: AppService) {}
  ngOnInit(): void {
    this.appService.getUserDetailsFromToken();
  }
}
