import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room{
    @PrimaryGeneratedColumn()
    id: number;
}