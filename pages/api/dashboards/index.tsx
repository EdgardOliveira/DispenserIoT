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
            console.log("Método não suportado para esta rota");
    }
}

export async function recuperarTodos(req: NextApiRequest, res: NextApiResponse) {
    try {
        const resultado = await prisma.dashboard.findMany({
            distinct: ['dispositivoId'],
            orderBy:{
                dataHora: 'desc'
            }
        });
        console.log(JSON.stringify(resultado));
        res.status(200).json({
            sucesso: true,
            mensagem: 'Lista recuperada com sucesso!',
            dashboards: resultado,
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
    const { wifi, voltagem, nivel, dispositivoId } = req.body;
    try{
        if(!wifi || !voltagem || !nivel || !dispositivoId){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos obrigatórios!',
                enviado: req.body
            });
        }
        const resultado = await prisma.dashboard.create({
            data:{
                dataHora: new Date(),
                wifi: wifi,
                voltagem: voltagem,
                nivel: nivel,
                dispositivoId: dispositivoId
            }
        });
        res.status(201).json({
            sucesso: true,
            mensagem: 'Registro inserido com sucesso!',
            dashboard: resultado
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
    const dashboard = req.body;
    try {
        const resultado = await prisma.dashboard.update({
            where: {
                id: dashboard.id,
            },
            data: dashboard
        });

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Registro atualizado com sucesso!',
            dashboard: resultado,
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
    const dashboard = req.body;
    try {
        const resultado = await prisma.dashboard.delete({
            where: {
                id: dashboard.id,
            },
        });
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Registro excluído com sucesso!',
            dashboard: resultado,
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
