import { Storage } from "@google-cloud/storage";

export interface IGcpStorage{
    projectId:String;
    keyFilename:String;
}

export interface StorageConstructor{
    new(projectId:string, keyFilename:string):Storage;
}