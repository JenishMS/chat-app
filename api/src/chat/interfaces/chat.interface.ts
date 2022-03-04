export interface IChat {
    _id: string;
    from: string;
    to: string;
    message: string;
    createdAt: Date;
}