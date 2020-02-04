import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupFormComponent } from './landing-screen/signup-form/signup-form.component';
import { SigninFormComponent } from './landing-screen/signin-form/signin-form.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: SignupFormComponent },
    { path: 'signup', component: SignupFormComponent },
    { path: 'signin', component: SigninFormComponent },
    { path: 'home', component: HomeComponent },

    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
