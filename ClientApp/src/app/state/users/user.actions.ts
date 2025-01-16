import { createAction, props } from "@ngrx/store";
import { UserDetailsResponse } from "src/app/dtos/user-details-response";
import { UserDetailsUpdateRequest } from "src/app/dtos/user-details-update-request";

export const updateCurrentUser = createAction(
    "[User] Update current user",
    props<{ currentUser: UserDetailsUpdateRequest }>()
);

export const loadCurrentUser = createAction("[User] Load current user")

export const loadCurrentUserSuccess = createAction(
    "[User API] Current user loaded successfully",
    props<{currentUser: UserDetailsResponse}>()
)

export const loadCurrentUserFailure = createAction(
    "[User API] Current user load failure",
    props<{error: string}>()
)

export const loadUsers = createAction("[User] Load users")
export const loadUsersSuccess = createAction(
    "[User API] Users load success",
    props<{users: UserDetailsResponse[]}>()
)

export const loadUsersFailure = createAction(
    "[User API] Users load failure",
    props<{error: string}>()
)