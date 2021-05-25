import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/prisma";
import {hash} from 'bcryptjs';

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
        const resultado = await prisma.usuario.findMany();

        res.status(200).json({
            sucesso: true,
            mensagem: 'Lista recuperada com sucesso!',
            usuarios: resultado,
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

export async function inserir(req: NextApiRequest, res: NextApiResponse) {
    const {primeiroNome, ultimoNome, email, senha} = req.body;
    let senhaCript = '';
    hash(senha, 12, async function (err, hash) {
        senhaCript = hash;
    });

    try {
        if (!primeiroNome || !ultimoNome || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos obrigatórios!',
                enviado: req.body
            });
        }
        const resultado = await prisma.usuario.create({
            data: {
                primeiroNome: primeiroNome,
                ultimoNome: ultimoNome,
                email: email,
                senha: senhaCript
            }
        });
        res.status(201).json({
            sucesso: true,
            mensagem: 'Registro inserido com sucesso!',
            usuario: resultado
        })
    } catch (e) {
        res.status(405).json({
            sucesso: false,
            mensagem: 'Não conseguimos inserir o registro!',
            erro: e.message,
            enviado: req.body,
        });
    } finally {
        res.end();
    }
}

export async function atualizar(req: NextApiRequest, res: NextApiResponse) {
    let usuario = req.body;
    hash(usuario.senha, 12, async function (err, hash) {
        usuario.senha = hash;
    });

    try {
        const resultado = await prisma.usuario.update({
            where: {
                id: usuario.id,
            },
            data: usuario
        });
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Registro atualizado com sucesso!',
            usuario: resultado,
        });
    } catch (e) {
        res.status(400).json({
            sucesso: false,
            mensagem: 'Não conseguimos atualizar o registro!',
            erro: e.message,
            req: req.body,
        });
    } finally {
        res.end();
    }
}

export async function excluir(req: NextApiRequest, res: NextApiResponse) {
    const dispositivo = req.body;
    try {
        const resultado = await prisma.usuario.delete({
            where: {
                id: dispositivo.id,
            },
        });
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Registro excluído com sucesso!',
            usuario: resultado,
        });
    } catch (e) {
        res.status(400).json({
            sucesso: false,
            mensagem: 'Não conseguimos excluir o  registro!',
            erro: e.message,
            req: req.body,
        });
    } finally {
        res.end();
    }
}