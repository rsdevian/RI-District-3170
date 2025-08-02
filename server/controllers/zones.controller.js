import { requestLog } from "../logs/request.logger.js";
import Zones from "../models/zones.model.js";

async function getZones(req, res) {
    try {
        requestLog(req);
        const zones = await Zones.find();
        if (zones.length === 0) {
            return res.status(404).json({ message: "No zones found" });
        }
        return res.status(200).json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addZone(req, res) {
    try {
        requestLog(req);
        const { zone } = req.body;

        if (!zone) {
            return res.status(400).json({ message: "Zone is required" });
        }

        const exisitingZone = await Zones.findOne({ zone });
        if (exisitingZone) {
            return res.status(400).json({ message: "Zone already exists" });
        }

        const newZone = await Zones.create({ zone });
        return res
            .status(201)
            .json({ message: "New Zone Created Successfully", newZone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getZones, addZone };
