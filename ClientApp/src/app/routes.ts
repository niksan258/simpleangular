import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AccountDetailsComponent } from "./account-details/account-details.component";

const routeConfig: Routes = [
          { path: '', component: HomeComponent, pathMatch: 'full' },
          { path: 'fetch-data', component: FetchDataComponent },
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'account-details', component: AccountDetailsComponent}
];

export default routeConfig;