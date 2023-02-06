import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';

@Injectable()
export class RoomsService {
    constructor(@InjectRepository(Room) private repo: Repository<Room>){}
    
    async createOrGetRoom(id1:number,id2:number){
        //`SELECT * FROM room WHERE users @> '[{"userid":3}]'::jsonb and users @> '[{"userid":1}]'::jsonb   `
        const sqlquery = `SELECT roomid FROM room WHERE users @> '[{"userid":` + id1 + `}]'::jsonb and users @> '[{"userid":` + id2 + `}]'::jsonb `
        let roomid = await this.repo.query(sqlquery);

         if(roomid.length === 0){
            let roomid = await this.repo.create({roomid:"877bjnbypkpokokp",users:[{userid:id1,userhavenotis:false},{userid:id2,userhavenotis:false}]})
            this.repo.save(roomid);
            console.log(roomid)
            console.log("---")
            
         }
       
        return roomid
    }

    
}
