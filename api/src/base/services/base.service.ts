import { CollectionEnum } from "../enums/collection.enum";
import { ApiResponse } from "../interfaces/api-response.interface";
import { DatabaseService } from "./database.service";
const { MongoClient } = require('mongodb');

export abstract class BaseService extends DatabaseService {
    constructor(collectionName: CollectionEnum) {
        super(collectionName);
    }

    /**
     * Create Api response error
     *
     * @template T
     * @param {string} message
     * @param {string} [error]
     * @return {*}  {ApiResponse<T>}
     * @memberof BaseService
     */
    error<T>(message: string, error?: any): ApiResponse<T> {
        try {
            const errorString = JSON.stringify(error) as string;
            return { status: false, message, error: errorString };
        } catch (err) {
            return { status: false, message, error };
        }
    }

    /**
     * Create Api response success
     * @param data 
     * @param message 
     * @returns 
     */
    success<T>(data: T, message = ''): ApiResponse<T> {
        return { status: true, message, data };
    }
}