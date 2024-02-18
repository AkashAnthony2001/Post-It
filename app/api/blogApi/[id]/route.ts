import { NextResponse, withDB, prisma } from '@/app/api/db/dbconnect';

const handleError = (error: any) => {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
};

const extractPostId = (url: string) => {
    return url?.split('/blogApi/')[1];
}

const getPostById = async (id: string) => {
    return await prisma.post.findUnique({ where: { id } });
}

export const GET = withDB(async (request: Request) => {
    const id = extractPostId(request.url);
    if (!id) {
        return NextResponse.json({ message: 'Invalid request', status: 400 });
    }
    const post = await getPostById(id);
    if (!post) {
        return NextResponse.json({ message: 'Post not found', status: 404 });
    }
    return NextResponse.json({ post, status: 200 });
});

const updatePost = async (id: string, { title, content, author }: { title: string, content: string, author: string }) => {
    return await prisma.post.update({ where: { id }, data: { title, content, author } });
};

export const PUT = withDB(async (request: Request) => {
    try {
        const id = extractPostId(request.url);
        if (!id) {
            return NextResponse.json({ message: 'Invalid request', status: 400 });
        }
        const { title, content, author } = await request.json();
        if (!title || !content || !author) {
            return NextResponse.json({ message: 'All fields are required', status: 400 });
        }
        const post = await getPostById(id);
        if (!post) {
            return NextResponse.json({ message: 'Post not found', status: 404 });
        }
        const updatedPost = await updatePost(id, { title, content, author });
        return NextResponse.json({ status: 200, body: { post: updatedPost }, message: 'Post updated successfully' });
    } catch (error) {
        return handleError(error);
    }
});

const deletePost = async (id: string) => {
    return await prisma.post.delete({ where: { id } });
};

export const DELETE = withDB(async (request: Request) => {
    try {
        const id = extractPostId(request.url);
        if (!id) {
            return NextResponse.json({ message: 'Invalid request', status: 400 });
        }
        const post = await getPostById(id);
        if (!post) {
            return NextResponse.json({ message: 'Post not found', status: 404 });
        }
        await deletePost(id);
        return NextResponse.json({ status: 200, message: 'Post deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
});
