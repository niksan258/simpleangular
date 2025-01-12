export interface UserDetailsUpdateRequest {
    email: string;
    fullName: string;
    password: string | null | undefined;
}