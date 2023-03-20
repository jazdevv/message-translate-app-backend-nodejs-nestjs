import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Room } from './rooms.entity';
@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    UserSender: number

    @Column()
    roomid: number

    @Column({default:null})
    text: string;

    @Column({default:null})
    imageUrl: string 

    @Column('character varying',{array:true}) 
    type: string[];
    
    @CreateDateColumn()
    createdAt: Date
}