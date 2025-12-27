import type { Request, Response } from "express";
import Order from '../models/Order.js';

export const createOrder = async (req: Request, res: Response) => {
    try {
        // Aqui o monggose vai rodar a validação que foi criada no Model(total > 0)
        const order = await Order.create(req.body);
        return res.status(201).json(order);
    } catch (erro: any) {
        return res.status(400).json({ erro: erro.message })
    }
};

export const listOrders = async (req: Request, res: Response) => {
    try {
        const { state, page = 1, limit = 10 } = req.body;
        const filter = state ? { state } : {};
        const orders = await Order.find(filter)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
}