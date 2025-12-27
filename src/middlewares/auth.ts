import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    iat: number;
    exp: number
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    const parts = authorization.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no formato do token' });
    }

    const [scheme, token] = parts as [string, string];

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: 'Token mal formatado' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const decoded = jwt.verify(token, secret);

        const { id } = decoded as TokenPayload;

        req.userId = id;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalido ou expirado'})
    }
}