import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILinkHub extends Document {
    slug: string;
    ownerId: Types.ObjectId;
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
        themeConfig: {
            backgroundColor: { type: String, default: '#ffffff' },
            textColor: { type: String, default: '#000000' },
            buttonColor: { type: String, default: '#007bff' },
        },
        stats: {
            totalViews: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<ILinkHub>('LinkHub', LinkHubSchema);
