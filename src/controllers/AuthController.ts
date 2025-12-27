import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userExists = await User.find({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const user = await User.create({ email, password });
        return res.status(201).json({ id: user._id, email: user.email })
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao registrar usuároi' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || (await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback', {
            expiresIn: '1d'
        });

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: 'Erro no login' })
    }
}