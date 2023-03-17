import {S3, CreateBucketCommand } from "@aws-sdk/client-s3";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
const AWS = require("aws-sdk");
@Injectable()
export class S3Service {
    #s3;
    #bucketname;
    constructor(private configService: ConfigService){
        AWS.config.update({
            accessKeyId: this.configService.get('AWS_ACCES_KEY'),
            secretAccessKey: this.configService.get('AWS_SECRET_KEY')  
        });

        this.#bucketname  = 'messaging-app-images';
        this.#s3 = new AWS.S3();
    }

    async uploadImageToS3 (Key: string,Image: any) {
        
        const bucketParams = {
            Bucket: this.#bucketname,
            Key,
            Body: Image,
            ACL:'public-read'
        }

        this.#s3.putObject(bucketParams, function (err, pres) {
            if (err) {
              console.log("Error uploading data: ", err);
            } else {
              console.log("Successfully uploaded data to myBucket/myKey");
            }})
        return 
        
    }
}
