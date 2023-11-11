import { Request, Response } from 'express';
import { getAccount, signup } from '../main';


export async function getAccountController(req: Request, res: Response) {
    try {
        const account = await getAccount(req.params.uuid);
        res.status(200).json(account);
    } catch (err: any) {
        console.log(err.message);
        res.status(500).json({ error: err.message ?? 'Erro ao buscar dados' })
    }
}

export async function signupController(req: Request, res: Response) {
    try {
        const createdAccount = await signup(req.body);
        res.status(201).json(createdAccount);
    } catch (err: any) {
        console.log(err.message);
        res.status(500).json({ error: err.message ?? 'Erro ao fazer signup' })
    }
}