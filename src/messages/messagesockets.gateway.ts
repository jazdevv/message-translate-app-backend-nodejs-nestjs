import { UseGuards } from "@nestjs/common/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets/decorators";
import { Socket } from "dgram";
import { JwtAuthGuardWS } from "src/guards/jwt-auth-ws.guard";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { RoomsService } from "./rooms.service";

interface joinRoom {
    otheruser?: number;
    logguser: User,
    roomid?: number,
}

interface sendMessage {
    otheruser: string;
    logguser: User;
    message: String;
    image?: String //https://stackoverflow.com/questions/59478402/how-do-i-send-image-to-server-via-socket-io
}
@WebSocketGateway({ cors: {
    origin: "http://localhost:3000",
    credentials: true
} })
export class messageSocketsGateway  implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private repoRooms: RoomsService,private repoUsers: UsersService){}
    @WebSocketServer()
    server;
    
    handleConnection(){console.log("someone connected")}

    handleDisconnect(){console.log("someone disconnected")}

    //join user to a conversation room with other user
    @UseGuards(JwtAuthGuardWS)
    @SubscribeMessage('joinroom')
    async joinroom(@MessageBody() data: joinRoom,@ConnectedSocket() client: any){
        
        if(!data.roomid&&!data.otheruser){
            throw new WsException('missing params')
        }
        //roomid of the converstion
        let roomid: Number;

        //choose first option if the req have roomid and otheruser
        if(data.roomid){
            //if the req body have room id verify that the user is part of it
            const isValid = await this.repoRooms.isUserInRoomID(data.logguser.id,data.roomid)
            if(isValid===false){
                throw new WsException('Invalid room')
            }else{
                roomid= data.roomid
            }
        }else if(data.otheruser){ //get the room id if the req body dont add it 
            console.log("otheruser",data.otheruser)
            roomid = await this.repoRooms.createOrGetRoom(data.otheruser,data.logguser.id)
        }
        console.log(roomid)
        //join the req socket to the room
        client.join(roomid)
        
        //emit a connected room message
        this.server.to(roomid).emit("connected-room","connected room")
    }

    //send message
    @UseGuards(JwtAuthGuardWS)
    @SubscribeMessage('chat-message')
    async sendmessage(@MessageBody() data: sendMessage,@ConnectedSocket() client: any){
        //get the otheruser
        const otheruser = await this.repoUsers.findUserByName(data.otheruser)

        //get the room id
        const roomid = (await this.repoRooms.createOrGetRoom(otheruser.id,data.logguser.id))[0].roomid
        
        //check if message got images, ithen send to aws s3

        //save message to the database

        //send notification to the other user
        //this.server.to(otheruser._id).emit("user-notification",)

        //join the req socket to the room if he is not joined
        client.join(roomid)

        //emit the message to socket room (sender and receipant socket recives the message)
        this.server.to(roomid).emit("chat-message",data.message)
    }
}
    

