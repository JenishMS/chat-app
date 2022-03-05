import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
signupForm: any= new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  isSubmitted = false;
  isLoading = false;
  message = '';
  constructor(private authService: AuthService, private router: Router, private appService: AppService) { }

  ngOnInit(): void {
    const isLoggedIn = this.authService.verifyUserLogin();
    if (isLoggedIn) {
      const token = this.authService.getDecodedToken();
      this.router.navigateByUrl('/');
    }
  }

  async onSubmit() {
    this.isSubmitted = true;
    if(this.signupForm.valid) {
      this.isLoading = true;
      const response = await this.appService.createUser(this.signupForm.value);
       this.isLoading = false;
      if(response.status) {
        this.router.navigateByUrl('/');
      } else {
        this.message = response.message;
      }
    }
  }
}
