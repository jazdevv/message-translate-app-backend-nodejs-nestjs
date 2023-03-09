import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class RoomsService {
    constructor(@InjectRepository(Room) private repo: Repository<Room>){}
    
    async createOrGetRoom(id1:number,id2:number){
        
        const sqlquery = `SELECT * FROM room WHERE room.users -> 'usersArray' @> '[{"userid":"` +  id1+ `"},{"userid":` +  id2 + `}]'::jsonb `

        let roomid = await this.repo.query(sqlquery);
        
        if(roomid.length === 0){
            const newroom = uuidv4();
            roomid = this.repo.create({roomid:newroom,users:{usersArray:[{userid:id1,userhavenotis:false},{userid:id2,userhavenotis:false}]}})
            this.repo.save(roomid);
        }
        
        return roomid
    }

    
}
