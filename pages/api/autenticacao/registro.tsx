import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../lib/prisma";

export default async function registro(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            salvar(req, res);
            break;
        default:
            res.status(405).json({ message: 'Essa rota só oferece suporte a POST' });
    }
}

export async function salvar(req: NextApiRequest, res: NextApiResponse) {
    const { primeiroNome, ultimoNome, email, senha } = req.body;

    try {

        if (!primeiroNome || !ultimoNome || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos obrigatórios!',
                enviado: req.body
            });
        }

        hash(senha, 12, async function(err, hash) {
            const resultado = await prisma.usuario.create({
                data:{
                    primeiroNome: primeiroNome,
                    ultimoNome: ultimoNome,
                    email: email,
                    senha: hash
                }
            });

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Registro cadastrado com sucesso!',
                usuario: resultado,
            });
        });

    } catch (e) {
        res.status(405).json({
            sucesso: false,
            mensagem: 'Não conseguimos cadastrar!',
            erro: e.message,
            enviado: req.body,
        });
    }
}
