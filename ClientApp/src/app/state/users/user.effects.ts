import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';

import { UserService } from 'src/app/services/user.service';
import { loadCurrentUser, loadCurrentUserFailure, loadCurrentUserSuccess, loadUsers, loadUsersFailure, loadUsersSuccess, updateCurrentUser } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUser),
      switchMap(() =>
        this.userService.getCurrentUserDetails().pipe(
          map((user) => loadCurrentUserSuccess({ currentUser: user })),
          catchError((error) => of(loadCurrentUserFailure({ error })))
        )
      )
    )
  );

  updateCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCurrentUser),  
      switchMap(({ currentUser }) =>
        this.userService.updateCurrentUserDetails(currentUser)
      )
    ),
    {dispatch: false}
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getAllUsers().pipe(
          map((users) => loadUsersSuccess({ users: users })),
          catchError((error) => of(loadUsersFailure({ error })))
        )
      )
    )
  );
}