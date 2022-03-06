import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm: any= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  isSubmitted = false;
  isLoading = false;
  message = '';
  constructor(private authService: AuthService, private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    const isLoggedIn = this.authService.verifyUserLogin();
    if (isLoggedIn) {
      const token = this.authService.getDecodedToken();
      this.appService.userDetails = token;
      this.router.navigateByUrl('/');
    }
  }

  async onSubmit() {
    this.isSubmitted = true;
    if(this.signinForm.valid) {
      this.isLoading = true;
      const response = await this.appService.signinUser(this.signinForm.value);
       this.isLoading = false;
      if(response.status) {
        this.authService.setToken(response.data.token);
        const token = this.authService.getDecodedToken();
      this.appService.userDetails = token;
        this.router.navigateByUrl('/');
      } else {
        this.message = response.message;
      }
    }
  }

}
