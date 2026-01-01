import type { Request, Response } from "express";
import Order from '../models/Order.js';

export const createOrder = async (req: Request, res: Response) => {
    try {

        const { lab, patient, customer, services } = req.body;
        const userId = req.userId;

        const order = await Order.create({
            userId,
            lab,
            patient,
            customer,
            services
        });
        return res.status(201).json(order);
    } catch (erro: any) {
        return res.status(400).json({ erro: erro.message })
    }
};

export const listOrders = async (req: Request, res: Response) => {
    try {
        const { state, page = 1, limit = 10 } = req.query;

        const filter: any = {};
        if (state) filter.state = state;

        const orders = await Order.find(filter)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(filter);

        return res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: orders
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
}

export const advanceOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' })
        }

        const stateTransitions: Record<string, string> = {
            'CREATED': 'ANALYSIS',
            'ANALYSIS': 'COMPLETED'
        };

        const nextState = stateTransitions[order.state];

        if (!nextState) {
            return res.status(400).json({ erro: 'Este pedido já está concluído ou em estado inválido para avanço' })
        }

        order.state = nextState as 'ANALYSIS' | 'COMPLETED';
        await order.save();
        return res.status(200).json(order);

    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao avançar pedido' });
    }
};