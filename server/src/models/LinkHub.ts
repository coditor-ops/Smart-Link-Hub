import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILinkHub extends Document {
    slug: string;
    ownerId: Types.ObjectId;
    webhookUrl?: string;
    themeConfig: {
        backgroundColor: string;
        textColor: string;
        buttonColor: string;
        // Add more theme properties as needed
    };
    stats: {
        totalViews: number;
    };
}

const LinkHubSchema: Schema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        webhookUrl: { type: String },
        themeConfig: {
            backgroundColor: { type: String, default: '#0a0a0a' },
            textColor: { type: String, default: '#ffffff' },
            buttonColor: { type: String, default: '#007bff' },
            avatarUrl: { type: String },
            wallpaperUrl: { type: String },
            backgroundEffect: { type: String, default: 'none', enum: ['none', 'matrix', 'particles', 'rain', 'glitch', 'fog'] },
            customCss: { type: String },
        },
        stats: {
            totalViews: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<ILinkHub>('LinkHub', LinkHubSchema);
