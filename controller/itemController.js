import Item from "../model/itemModel.js";

export const create = async (req, res) => {
    try {
        const itemData = new Item(req.body); 
        const {itemName ,contact} = itemData;

        if(!itemName || !contact)
        {
            return res.status(400).json({message:"Item name and contact are required"});
        }
        if (contact.length < 10) {
            return res.status(400).json({ message: "Please enter a valid phone number." });
        }
        const savedItem = await itemData.save(); 
        res.status(200).json({message:"Item shared successfully!",data:savedItem}); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
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

export const getSingleItem = async (req, res) => {
    try {
    
        const { id } = req.params; 
        const item = await Item.findById(id); 

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const update = async (req, res) => {
    try {
        const id = req.params.id; 
        const itemExist = await Item.findOne({ _id: id }); 
        if (!itemExist) {
            return res.status(404).json({ message: "Item not found." }); 
        }

        if (req.body.contact && req.body.contact.length < 10) {
            return res.status(400).json({ message: "Invalid contact number length." });
        }

        const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true }); 
        res.status(201).json({ message: "Item updated successfully!", data: updatedItem });
    } catch (error) {
        res.status(500).json({ error: error.message}); 
    }
}

export const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const itemExist = await Item.findOne({ _id: id }); 
        if (!itemExist) {
            return res.status(404).json({ message: "Item Not Found." });
        }
        await Item.findByIdAndDelete(id); 
        res.status(201).json({ message: "Item deleted Successfully." }); 
    } catch (error) {
        res.status(500).json({ error:error.message}); 
    }
}