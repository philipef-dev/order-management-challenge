import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Order Status Transition', () => {
    let token: string;

    beforeAll(async () => {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://philipefdev:philipedevbd1@users.vcwh6.mongodb.net/?appName=Users';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: "philipeferreira@test.com",
                password: "lipe456"
            });

        token = loginResponse.body.token;
    });

    it('should advance order status from CREATED to ANALYSIS', async () => {
        const createResponse = await request(app)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                lab: "Lab Teste",
                patient: "Paciente Teste",
                customer: "Cliente Teste",
                services: [{ name: "Serviço Teste", value: 100 }]
            });

        const newOrderId = createResponse.body.id || createResponse.body._id;

        const response = await request(app)
            .patch(`/orders/${newOrderId}/advance`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.state).toBe('ANALYSIS');
    });

    it('should return 400 when trying to advance a COMPLETED order', async () => {
        const completedOrderId = "6956ca326f760ba935c05183";

        const response = await request(app)
            .patch(`/orders/${completedOrderId}/advance`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    });
});