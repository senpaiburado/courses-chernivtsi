export interface UserLoginData {
    email: string;
    password: string;
}

export interface UserSignUpData {
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    password: string;
    type: string;
}