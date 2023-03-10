import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';

@Injectable()
export class RoomsService {
    constructor(@InjectRepository(Room) private repo: Repository<Room>, private readonly repoUsers:UsersService){}
    
    async createOrGetRoom(id1:number,id2:number){
        const sqlquery = `SELECT * FROM room WHERE room.users -> 'usersArray' @> '[{"userid":` +  id1+ `},{"userid":` +  id2 + `}]'::jsonb `
        //GET ROOM ID IF EXISTS
        let room = await this.repo.query(sqlquery);
        
        //GENERATE NEW ROOM IF ROOM DONT EXISTS
        if(room.length === 0){
            const newRoom = this.repo.create({users:{usersArray:[{userid:id1,userhavenotis:false},{userid:id2,userhavenotis:false}]}})
            room = await this.repo.save(newRoom);
            return room.roomid
        }
        
        return room[0].roomid
    }

    async getUserRooms(logguserid:number){
        //-------------NEED IMPORTANT OPTIMIZATION---------------
        //CREATE THE SQL QUERY
        const sqlquery = `SELECT * FROM room WHERE room.users -> 'usersArray' @> '[{"userid":` +  logguserid + `}]'::jsonb`
        //GET THE ROOMS
        let rooms = await this.repo.query(sqlquery);
        let filtredRooms = [];
        for(let room of rooms){
            let otheruser: User;
            for (let user of room.users.usersArray){
                if(user.userid!=logguserid){
                    otheruser = await this.repoUsers.findUserProfile(user.userid) 
                }
            }

            filtredRooms.push({...room,otheruser})
        }
        
        
        return filtredRooms
    }

}
