import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const metodo = req.method;

    switch (metodo) {
        case "GET":
            recuperarTodos(req, res);
            break;
        case "POST":
            inserir(req, res);
            break;
        case "PUT":
            atualizar(req, res);
            break
        case "DELETE":
            excluir(req, res);
            break;
        default:
            console.log("Método não suportado para esta rota")
    }
}

export async function recuperarTodos(req: NextApiRequest, res: NextApiResponse) {
    try {
        const resultado = await prisma.dispositivo.findMany();

        res.status(200).json({
            sucesso: true,
            mensagem: 'Lista recuperada com sucesso!',
            dispositivos: resultado,
        });
    } catch (e) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Não conseguimos recuperar a lista!',
            erro: e.message,
        });
    } finally {
        res.end();
    }
}

export async function  inserir(req: NextApiRequest, res: NextApiResponse) {
    const { dispositivo, localidade } = req.body;
    try{
        if(!dispositivo || !localidade){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos obrigatórios!',
                enviado: req.body
            });
        }
        const resultado = await prisma.dispositivo.create({
            data:{
                dispositivo: dispositivo,
                localidade: localidade
            }
        });
        res.status(201).json({
            sucesso: true,
            mensagem: 'Registro inserido com sucesso!',
            dispositivo: resultado
        })
    }catch (e) {
        res.status(405).json({
            sucesso: false,
            mensagem: 'Não conseguimos inserir o registro!',
            erro: e.message,
            enviado: req.body,
        });
    }finally {
        res.end();
    }
}

export async function atualizar(req: NextApiRequest, res: NextApiResponse) {
    const dispositivo = req.body;
    try {
        const resultado = await prisma.dispositivo.update({
            where: {
                id: dispositivo.id,
            },
            data: dispositivo
        });

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Registro atualizado com sucesso!',
            dispositivo: resultado,
        });
    } catch (e) {
        res.status(400).json({
            sucesso: false,
            mensagem: 'Não conseguimos atualizar o registro!',
            erro: e.message,
            req: req.body,
        });
    }finally {
        res.end();
    }
}

export async function excluir(req: NextApiRequest, res: NextApiResponse) {
    const dispositivo = req.body;
    try {
        const resultado = await prisma.dispositivo.delete({
            where: {
                id: dispositivo.id,
            },
        });
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Registro excluído com sucesso!',
            dispositivo: resultado,
        });
    } catch (e) {
        res.status(400).json({
            sucesso: false,
            mensagem: 'Não conseguimos excluir o  registro!',
            erro: e.message,
            req: req.body,
        });
    }finally {
        res.end();
    }
}
