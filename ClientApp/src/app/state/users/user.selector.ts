import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { UserState } from "./user.reducer";

export const selectUsers = (state: AppState) => state.users;
export const selectCurrentUser = createSelector(
    selectUsers,
    (userState: UserState) => userState.currentUser
)
export const selectAllUsers = createSelector(
    selectUsers,
    (userState: UserState) => userState.users
);