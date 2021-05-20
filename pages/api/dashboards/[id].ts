import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const metodo = req.method;

    switch (metodo) {
        case "GET":
            recuperarEspecifico(req, res);
            break;
        default:
            console.log("Método não suportado para esta rota")
    }
}

export async function recuperarEspecifico(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    try {
        if (!id){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer um id'
            });
        }
        const resultado = await prisma.dashboard.findFirst({
            where: {
                dispositivoId: Number(id),
            },
            orderBy: {
                id: "desc"
            }
        });
        res.status(200).json({
            sucesso: true,
            mensagem: "Registro específico recuperado com sucesso!",
            dashboard: resultado,
        });
    } catch (e) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Não conseguimos recuperar o registro específico',
            erro: e.message,
        });
    } finally {
        res.end();
    }
}
