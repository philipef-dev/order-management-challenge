import mongoose, { Schema, Document } from 'mongoose';

// Tipagem para os itens do serviço
interface IService {
    name: string;
    value: number;
    status: 'PENDING' | 'DONE'
}

// Interface do Pedido
export interface IOrder extends Document {
    lab: string;
    patient: string;
    customer: string;
    state: 'CREATED' | 'ANALYSIS' | 'COMLETED';
    status: 'ACTIVE' | 'DELETED';
    services: IService[];
    totalValue: number; //campo calculado ou validado
}

const OrderSchema: Schema = new Schema({
    lab: { type: String, required: true },
    patient: { type: String, required: true },
    customer: { type: String, required: true },
    state: {
        type: String,
        enum: ['CREATED', 'ANALYSIS', 'COMPLETED'],
        default: 'CREATED'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    },
    services: {
        type: [{
            name: { type: String, required: true },
            value: { type: Number, required: true },
            status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' }
        }],
        validate: {
            validator: function (v: IService[]) {
                if (!v || v.length === 0) return false;

                const total = v.reduce((acc, curr) => acc + curr.value, 0);
                return total > 0;
            },
            message: 'O pedido deve ter pelo menos um serviço e o valor total deve ser maior que zero.'
        }
    }
}, {timestamps: true})

export default mongoose.model<IOrder>('Order', OrderSchema);