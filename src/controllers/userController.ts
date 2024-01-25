import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Request, Response } from 'express';

import {transport, readRenderHtml} from "../config/mailer";
import handlebars from "handlebars";
import path from "path";


async function createUser(request:Request, response:Response)
{
    try
    {
        const user = await prisma.user.create(
            {data: request.body})

        //Inicio do envio de mensagem padrão ao criar usuario na aplicação
        const pathTemplate = path.resolve(__dirname, "..", "..", 
            "templates","messageTemplate.html");
        readRenderHtml(pathTemplate, (htmlTemplate:any) =>{
            //Pegando o template para mensagens de boas vindas
            const template = handlebars.compile(htmlTemplate)

            //Contruindo objeto que preenche os campos do template
            const replacements = {
                name:request.body.name,
                message:"Bem vindo"
            }

            //Construindo o html da mensagem personalizada com as informações do usuario
            const htmlToSend = template(replacements);

            //Construindo a mensagem
            const message = {
                from:process.env.MAIL_SENDER,
                to: request.body.email,
                subject:"Bem vindo",
                html:htmlToSend,
            }

            //Enviando mensagem
            transport.sendMail(message, (error) => {throw error})
        })
        response.status(201).json(user);
    }
    catch(error)
    {
        response.status(500).json({error:error})
    }
}

async function readUser(request:Request, response:Response)
{
    const {id} = request.params;
    try{
        const user = await prisma.user.findUnique({
            where: {id: Number(id)}
        })
        response.status(200).json(user);
    }
    catch(error)
        {response.status(500).json({error:error})}
}

async function updateUser(request:Request, response:Response)
{
    const {id} = request.params
    try
    {
        const user = await prisma.user.update({
            data: request.body,
            where: {id: Number(id)}
        })
        response.status(200).json(user)
    }
    catch(error)
        {response.status(500).json({error:error})}
}

async function destroyUser(request:Request, response:Response)
{
    const {id} = request.params
    try
    {
        const user = await prisma.user.delete({
            where: {id: Number(id)}
        })
        response.status(204).json(user);
    }
    catch(error)
        {response.status(500).json({error:error})}
}

async function madePost(request:Request, response:Response)
{
    const {idUser, idPost} = request.body
    try
    {
        const post = await prisma.post.findUnique({
            where:{id:Number(idPost)}
        })

        if(post && post.authorId == Number(idUser))
            return response.status(404).json({ error: 'Post já associado'})

        const updateUser = await prisma.user.update({
            where:{id:Number(idUser)},
            data:{posts:{connect:{id:Number(idPost)}}}
        })
        response.status(200).json(updateUser)
    }
    catch(error)
    {
        return response.status(500).json({error:error})
    }
}

async function fileOk(request:Request, response:Response)
{
    const {id} = request.params;
    try
    {
        const user = await prisma.user.findUnique({
            where: {id: Number(id)}
        })

        if(!request.params || !user)
            throw Error

        response.status(200).json(user)
    }
    catch(error)
    {
        response.status(500).json({error:error})
    }
}

export 
{
    createUser, 
    readUser, 
    updateUser, 
    destroyUser, 
    madePost,
    fileOk
}