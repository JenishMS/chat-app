import { MongoClient } from "mongodb";
import { CollectionEnum } from "../enums/collection.enum";

export abstract class DatabaseService {
    protected collection: any;
    private client: any;
    constructor(collectionName: CollectionEnum) {
        this.client = new MongoClient(process.env.MONGO_URI as string);
        this.client.connect();
        const db = this.client.db(process.env.MONGO_DB);
        this.collection = db.collection(collectionName);
    }

    /**
     * Insert data to collection
     * @param data 
     * @returns 
     */
    async create<T>(data: any): Promise<T> {
        return await this.collection.insertOne(data) as T;
    }

    /**
     * Get all data from collection
     * @returns 
     */
    async getAll() {
        return await this.collection.find({}).toArray();
    }

    async getById(id: string) {
        return await this.collection.findOne({ _id: id });
    }

}