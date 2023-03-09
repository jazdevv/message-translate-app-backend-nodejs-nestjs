import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';

@Injectable()
export class RoomsService {
    constructor(@InjectRepository(Room) private repo: Repository<Room>){}
    
    async createOrGetRoom(id1:number,id2:number){
        
        const sqlquery = `SELECT * FROM room WHERE room.users -> 'usersArray' @> '[{"userid":"` +  id1+ `"},{"userid":` +  id2 + `}]'::jsonb `
        //GET ROOM ID IF EXISTS
        let roomid = await this.repo.query(sqlquery);
        
        //GENERATE NEW ROOM IF ROOM DONT EXISTS
        if(roomid.length === 0){
            roomid = this.repo.create({users:{usersArray:[{userid:id1,userhavenotis:false},{userid:id2,userhavenotis:false}]}})
            this.repo.save(roomid);
        }
        
        return roomid
    }

}
