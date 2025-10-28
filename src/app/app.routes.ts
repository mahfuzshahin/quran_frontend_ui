import { Routes } from '@angular/router';
import {CategoryComponent} from "./category/category.component";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {BasicFormComponent} from "./basic-form/basic-form.component";
import {BasicTableComponent} from "./basic-table/basic-table.component";
import {ModalUiComponent} from "./modal-ui/modal-ui.component";
import {BasicUiElementComponent} from "./basic-ui-element/basic-ui-element.component";
import {AuthGuard} from "./auth.guard";
import {MediaComponent} from "./media/media.component";
import {NewsComponent} from "./news/news.component";
import {NewsListComponent} from "./news-list/news-list.component";
import {NewsViewComponent} from "./news-view/news-view.component";
import {TagComponent} from "./tag/tag.component";
import {EditNewsComponent} from "./edit-news/edit-news.component";
import {AuthorComponent} from "./author/author.component";
import {Ayat} from "./model/ayat";
import {AyatComponent} from "./ayat/ayat.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'basic-form', component: BasicFormComponent, canActivate: [AuthGuard] },
  { path: 'basic-table', component: BasicTableComponent, canActivate: [AuthGuard] },
  { path: 'modal-ui', component: ModalUiComponent, canActivate: [AuthGuard] },
  { path: 'basic-ui-element', component: BasicUiElementComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'tag', component: TagComponent, canActivate: [AuthGuard] },
  { path: 'author', component: AuthorComponent, canActivate: [AuthGuard] },
  { path: 'media', component: MediaComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'news-list', component: NewsListComponent, canActivate: [AuthGuard] },
  { path: 'news-view/:id', component: NewsViewComponent, canActivate: [AuthGuard] },
  { path: 'edit-news/:id', component: EditNewsComponent, canActivate: [AuthGuard] },

  { path: 'ayat', component: AyatComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
