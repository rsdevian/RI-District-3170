import Clubs from "../models/club.model.js";

async function getClubs(req, res) {
    try {
        const clubs = await Clubs.find();
        if (clubs.length === 0) {
            return res.status(404).json({ message: "No clubs found" });
        }
        return res
            .status(200)
            .json({ message: "Clubs retrieved successfully", clubs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving clubs" });
    }
}

async function addClub(req, res) {
    try {
        const { club } = req.body;

        if (!club) {
            return res.status(400).json({ message: "No club data provided" });
        }

        const existingClub = await Clubs.findOne({ club });

        if (existingClub) {
            return res.status(409).json({ message: "Club already exists" });
        }

        const newClub = await Clubs.create({ club });
        if (!newClub) {
            return res.status(500).json({ message: "Error creating club" });
        }
        return res
            .status(201)
            .json({ message: "Club created successfully", newClub });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating club" });
    }
}

export { getClubs, addClub };
