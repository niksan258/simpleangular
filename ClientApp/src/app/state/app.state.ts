import { UserState } from "./users/user.reducer";

export interface AppState {
    users: UserState;
}