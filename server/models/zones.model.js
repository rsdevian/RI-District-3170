import { model, Schema } from "mongoose";

const zoneSchema = new Schema({
    zone: {
        type: String,
        required: true,
        unique: true,
    },
});

const Zone = model("Zones", zoneSchema);

export default Zone;
