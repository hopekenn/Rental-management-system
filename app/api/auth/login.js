import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { request } from "http"

const secret = process.env.JWT_SECRET || "supersecret"

const POST = async (req: NextRequest) => {
    try{
        const { identifier, role, password } = await req.json()
    } catch (err: any) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}


