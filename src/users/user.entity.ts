import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nametag: string;

    @Column({unique: true})
    email: string

    @Column()
    profileImage: string;

    @Column()
    password: string

    @Column({default: true})
    isGoogleUser: boolean
}