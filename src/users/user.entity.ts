import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;
    
    @Column({default: '',length: 100})
    status: string;

    @Column({unique: true})
    email: string;

    @Column({default:"default"})
    profileImage: string;

    @Column()
    password: string

    @Column({default: false})
    isGoogleUser: boolean
}