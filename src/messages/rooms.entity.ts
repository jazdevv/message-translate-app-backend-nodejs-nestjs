import { type } from 'os';
import { User } from 'src/decorators/get-user.decorator';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne } from 'typeorm';
interface UsersInterface {

    userid: number
    userhavenotis: boolean;

}
@Entity()
export class Room{
    @PrimaryColumn()
    roomid: string;

    
    @Column({type:'jsonb'})
    users: {

        userid: number;
        userhavenotis: boolean;
    
    }[]

}