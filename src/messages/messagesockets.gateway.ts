import { UseGuards } from "@nestjs/common/decorators";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets/decorators";
import { Socket } from "dgram";
import { JwtAuthGuardWS } from "src/guards/jwt-auth-ws.guard";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { RoomsService } from "./rooms.service";

interface joinRoom {
    otheruser: string;
    logguser: User
}
@WebSocketGateway()
export class messageSocketsGateway  implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private repoRooms: RoomsService,private repoUsers: UsersService){}
    @WebSocketServer()
    server;

    handleConnection(){console.log("someone connected")}

    handleDisconnect(){}

    //join user to a conversation room with other user
    @UseGuards(JwtAuthGuardWS)
    @SubscribeMessage('joinroom')
    async joinroom(@MessageBody() data: joinRoom,@ConnectedSocket() client: any){
        //get the otheruser
        const otheruser = await this.repoUsers.findUserByName(data.otheruser)
        //get the room id
        const roomid = (await this.repoRooms.createOrGetRoom(otheruser.id,data.logguser.id))[0].roomid
        //join the req socket to the room
        client.join(roomid)
        //emit a connected room message
        this.server.to(roomid).emit("connected-room","connected room")
    }

}
    

