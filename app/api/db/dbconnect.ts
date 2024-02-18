import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//DB Connection
const connectDB = async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        console.log(error);
        throw new Error("Error connecting to database");
    }
}

//DB Connection Handler
const withDB = (handler: Function) => async (request: Request) => {
    try {
        await connectDB();
        const response = await handler(request);
        await prisma.$disconnect();
        return response;
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
};

export { connectDB, prisma, NextResponse, withDB };