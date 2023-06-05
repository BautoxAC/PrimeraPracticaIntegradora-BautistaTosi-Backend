import { Schema, model } from 'mongoose';

const schema = new Schema({
    title: { type: String, required: true, max: 100, index: true },
    description: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 100, unique: true, max: 100 },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: Array, default: [] },
    status: { type: Boolean, default: true }
});

export const Productmodel = model('products', schema);