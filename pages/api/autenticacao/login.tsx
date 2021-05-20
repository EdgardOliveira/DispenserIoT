import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../lib/prisma";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            verificarCredenciais(req, res);
            break;
        default:
            res.status(405).json({message: 'Essa rota só oferece suporte a POST'});
    }
}

export async function verificarCredenciais(req: NextApiRequest, res: NextApiResponse) {
    const {email, senha} = req.body;
    try {
        if (!email || !senha ) {
            return await res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha os campos obrigatórios.',
                enviado: req,
            });
        }
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
            }
        });
        compare(senha, usuario.senha, async function(err, result) {
            if (!err && result) {
                const claims = { sub: usuario.id, email: usuario.email };
                const jwt = sign(claims, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Autenticado com sucesso!',
                    token: jwt
                });
            } else {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: "Credenciais inválidas",
                    enviado: req.body
                })
            }
        });
    } catch (e) {
        return res.status(405).json({
            sucesso: false,
            mensagem: "Ocorreu um erro ao tentar fazer login.",
            erro: e.message,
            req: req.body
        })
    }
}