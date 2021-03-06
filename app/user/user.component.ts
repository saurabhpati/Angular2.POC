import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from './user.auth.service';
import { TOKEN_TOASTR, IToastr } from "../events/index";
import { IUser } from "./user.model";

@Component({
    templateUrl: 'app/user/user.component.html',
    styleUrls: ['app/user/user.component.css']
})

export class UserProfileComponent implements OnInit {

    private profileForm: FormGroup;
    private firstName: FormControl;
    private lastName: FormControl;

    constructor(
        private authService: UserAuthService,
        private router: Router,
        @Inject(TOKEN_TOASTR) private toastrService: IToastr) {

    }

    ngOnInit(): void {
        this.firstName = new FormControl(this.authService.currentUser.firstName, [Validators.required, Validators.pattern('[a-zA-Z].*'), Validators.minLength(2)]);
        this.lastName = new FormControl(this.authService.currentUser.lastName, [Validators.required, Validators.pattern('[a-zA-Z].*'), Validators.minLength(2)]);
        this.profileForm = new FormGroup({
            firstName: this.firstName,
            lastName: this.lastName
        });
    }

    saveProfile(formValues): void {
        this.authService.updateUser(formValues.firstName, formValues.lastName).subscribe((user: IUser)=> {
            if (user) {
                this.toastrService.success('Profile updated successfully!');
                this.router.navigate(['/events']);    
            } else {
                this.toastrService.error('Profile updation failed');
            }
        });
    }

    cancel(): void {
        this.toastrService.info('Profile update was cancelled');
        this.router.navigate(['/events']);
    }

    logout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['user/login']);
        });
    }

    // Returns true, if form control is valid or untouched, false, otherwise
    validateFormControl(formControl: FormControl): boolean {
        return formControl.valid || formControl.untouched;
    }
}