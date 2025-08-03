import { model, Schema } from "mongoose";

const clubSchema = new Schema({
    club: {
        type: String,
        required: true,
        unique: true,
    },
});

const Clubs = model("Clubs", clubSchema);

export default Clubs;
