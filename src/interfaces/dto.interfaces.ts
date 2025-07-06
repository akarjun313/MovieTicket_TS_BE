

export interface UserSignupDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: number;
    role: 'user' | 'admin' | 'owner';
}