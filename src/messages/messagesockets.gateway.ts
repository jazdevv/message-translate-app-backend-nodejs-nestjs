import { UseGuards } from "@nestjs/common/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets/decorators";
import { Socket } from "dgram";
import { JwtAuthGuardWS } from "src/guards/jwt-auth-ws.guard";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { RoomsService } from "./rooms.service";
import { S3Service } from "src/s3/s3.service";
import { MessagesService } from "./messages.service";
interface joinRoom {
    otheruser?: number;
    logguser: User,
    roomid?: number,
}

interface sendMessage {
    roomid: number;
    logguser: User;
    message?: string;
    image?: any //https://stackoverflow.com/questions/59478402/how-do-i-send-image-to-server-via-socket-io
}

const sendMessageToSocket = (client:any,server:any,eventName:string,data:any)=>{
    client.join(client.id)
    server.to(client.id).emit(eventName,data);
    client.leave(client.id);
}

@WebSocketGateway({ cors: {
    origin: "http://localhost:3000",
    credentials: true
} })
export class messageSocketsGateway  implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private repoRooms: RoomsService,private repoMessages:MessagesService ,private repoUsers: UsersService, private S3Service: S3Service){}
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
            const isValid = await this.repoRooms.isUserInRoomID(data.logguser.id,data.roomid);
            if(isValid===false){
                sendMessageToSocket(client,this.server,'errjoinroom',{valid:false});
                throw new WsException('Invalid room');
            }else{
                roomid= data.roomid
            };
        }else if(data.otheruser){ //get the room id if the req body dont add it 
            console.log("otheruser",data.otheruser)
            roomid = await this.repoRooms.createOrGetRoom(data.otheruser,data.logguser.id)
        }
        console.log(roomid)
        console.log(client.id)
        //join the req socket to the room
        client.join(roomid);
        //send valid roomcode to client
        sendMessageToSocket(client,this.server,'resjoinroom',{roomid,valid:true})
        
        
    
        
        //emit a connected room message
        this.server.to(roomid).emit("connected-room","connected room")
    }

    //send message
    @UseGuards(JwtAuthGuardWS)
    @SubscribeMessage('roomid-messages-listener')
    async sendmessage(@MessageBody() data: sendMessage,@ConnectedSocket() client: any){
        
        if(!data.message && !data.image){
            throw new WsException('Invalid input');
        }
        
        //check if the user is valid to send messages to that roomid
        const isValid = await this.repoRooms.isUserInRoomID(data.logguser.id,data.roomid);
        if(isValid===false){
            throw new WsException('Invalid room');
        }
        
        //save message to the database
        const message = await this.repoMessages.createMessage(data.logguser,data.message,data.image,data.roomid);
    
        if(data.image){
            this.S3Service.uploadImageToS3(message.imageUrl,data.image);
        }

        //emit the message to socket room (sender and receipant socket recives the message)
        this.server.to(data.roomid).emit("roomid-messages-listener",message)
    }
}
    

