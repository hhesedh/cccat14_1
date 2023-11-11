import { Request, Response } from 'express';
import { GetRide, requestRide } from "../ride";

export async function getRideController(req: Request, res: Response) {
    try {
        const ride = await GetRide(req.params.uuid);
        res.status(200).json(ride);
    } catch (err: any) {
        console.log(err.message);
        res.status(500).json({ error: err.message ?? 'Erro ao buscar dados' })
    }
}

export async function requestRideController(req: Request, res: Response) {
    try {
        const createdRide = await requestRide(req.body);
        res.status(201).json(createdRide);
    } catch (err: any) {
        console.log(err.message);
        res.status(500).json({ error: err.message ?? 'Erro ao fazer pedido de corrida' })
    }
}
