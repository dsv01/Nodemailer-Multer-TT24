import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Request, Response } from 'express';


async function createPost(request:Request, response:Response)
{
    try
    {
        const post = await prisma.post.create(
            {data: request.body})
        response.status(201).json(post);
    }
    catch(error)
    {
        response.status(500).json({error:error})
    }
}

async function readPost(request:Request, response:Response)
{
    const {id} = request.params;
    try{
        const post = await prisma.post.findUnique({
            where: {id: Number(id)}
        })
        response.status(200).json(post);
    }
    catch(error)
        {response.status(500).json({error:error})}
}

async function updatePost(request:Request, response:Response)
{
    const {id} = request.params
    try
    {
        const post = await prisma.post.update({
            data: request.body,
            where: {id: Number(id)}
        })
        response.status(200).json(post)
    }
    catch(error)
        {response.status(500).json({error:error})}
}

async function destroyPost(request:Request, response:Response)
{
    const {id} = request.params
    try
    {
        const post = await prisma.post.delete({
            where: {id: Number(id)}
        })
        response.status(204).json(post);
    }
    catch(error)
        {response.status(500).json({error:error})}
}

export
{
    createPost,
    readPost,
    updatePost,
    destroyPost
}