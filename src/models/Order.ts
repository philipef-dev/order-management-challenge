import mongoose, { Schema, Document } from 'mongoose';

interface IService {
    name: string;
    value: number;
    status: 'PENDING' | 'DONE';
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    lab: string;
    patient: string;
    customer: string;
    state: 'CREATED' | 'ANALYSIS' | 'COMPLETED';
    status: 'ACTIVE' | 'DELETED';
    services: IService[];
}

const OrderSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
}, {
    timestamps: true,    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

OrderSchema.virtual('totalValue').get(function (this: IOrder) {
    return this.services.reduce((acc: number, curr: any) => acc + curr.value, 0);
});

export default mongoose.model<IOrder>('Order', OrderSchema);