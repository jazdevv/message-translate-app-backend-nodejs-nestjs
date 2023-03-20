import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Room } from './rooms.entity';
@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>User)
    UserSender: number

    @OneToOne(()=>Room)
    roomid: number

    @Column({default:null})
    text: string;

    @Column({default:null})
    imageUrl: string

    @Column('character varying',{array:true})
    type: string[];
}