import mongoose, { Document, Schema, Types } from 'mongoose';

export type RuleType = 'time' | 'device' | 'location';
export type RuleAction = 'show' | 'hide';

export interface IRule {
    type: RuleType;
    value: string;
    action: RuleAction;
}

export interface ILink extends Document {
    hubId: Types.ObjectId;
    originalUrl: string;
    title: string;
    priority: number;
    isActive: boolean;
    rules: IRule[];
    imageUrl?: string;
    shortHash?: string;
    analytics: {
        clicks: number;
    };
}

const RuleSchema = new Schema(
    {
        type: { type: String, enum: ['time', 'device', 'location'], required: true },
        value: { type: String, required: true },
        action: { type: String, enum: ['show', 'hide'], required: true },
    },
    { _id: false }
);

const LinkSchema: Schema = new Schema(
    {
        hubId: { type: Schema.Types.ObjectId, ref: 'LinkHub', required: true },
        originalUrl: { type: String, required: true },
        title: { type: String, required: true },
        priority: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        shortHash: { type: String, unique: true, sparse: true },
        rules: { type: [RuleSchema], default: [] },
        imageUrl: { type: String }, // URL to the uploaded image
        analytics: {
            clicks: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<ILink>('Link', LinkSchema);
