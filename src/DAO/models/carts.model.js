import { Schema, model } from 'mongoose';

const schema = new Schema({
    products: { type: Array, default: [] },
});

export const cartModel = model('carts', schema);