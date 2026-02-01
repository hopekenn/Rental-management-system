import { ServerResponse } from "http";
import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io"
import {createAdapter} from "socket.io/redis-adapter"
import { createClient} from "redis"

let socket: Server | null = null

export async function GET(req: NextRequest) {
    if(socket) 
        return NextResponse.json({message: "Socket io server already initialized"})
}