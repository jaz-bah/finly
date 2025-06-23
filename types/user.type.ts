import mongoose from "mongoose";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    type: 'personal' | 'business',
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ICreateUserPayload {
    name: string;
    email: string;
    password: string;
}


export interface ICreateUserSuccessResponse {
    message: string;
    user: IUser
}


export interface ICreateUserErrorResponse {
    message: string;
    error: object;
}


export interface IUserSignInPayload {
    email: string;
    password: string;
}