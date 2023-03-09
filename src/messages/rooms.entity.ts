import { type } from 'os';
import { User } from 'src/decorators/get-user.decorator';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToMany } from 'typeorm';

@Entity()
export class Room{
    @PrimaryColumn()
    roomid: string;

    
    @Column({type:'jsonb'})
    users:{usersArray: {

        userid: number;
        userhavenotis: boolean;
    
    }[]}

    @Column({default:false})
    isGroup: boolean;

    @Column({default:null})
    lastMessageDate: Date
}