import { NextResponse, withDB, prisma } from '../db/dbconnect';

const handleError = (error: any) => {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
};

const postExists = async (title: string) => {
    return await prisma.post.findFirst({ where: { title } });
};

export const GET = withDB(async (request: Request) => {
    const posts = await prisma.post.findMany();
    return NextResponse.json({ posts, status: 200 }); // Changed from 'users' to 'posts' for consistency
});

export const POST = withDB(async (request: Request) => {
    try {
        const { title, content, author } = await request.json();
        if (!title || !content || !author) {
            return NextResponse.json({ message: 'All fields are required', status: 400 });
        }
        if (await postExists(title)) {
            return NextResponse.json({ message: 'Post already exists', status: 400 });
        }
        const newPost = await prisma.post.create({ data: { title, content, author } });
        return NextResponse.json({ status: 201, body: { post: newPost }, message: 'Post created successfully' });
    } catch (error) {
        return handleError(error);
    }
});
