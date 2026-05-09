import Item from "../model/itemModel.js";

export const create = async (req, res) => {
    try {
        const itemData = new Item(req.body); 
        const savedItem = await itemData.save(); 
        res.status(200).json(savedItem); 
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." }); 
    }
}

export const fetch = async (req, res) => {
    try {
        const items = await Item.find(); 
        if (items.length === 0) {
            return res.status(404).json({ message: "No items found." }); 
        }
        res.status(200).json(items); 
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." }); 
    }
}