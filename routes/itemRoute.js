import express from "express";

import { create, fetch ,getSingleItem,update, deleteItem} from "../controller/itemController.js";

const route = express.Router();

route.post("/create", create);
route.get("/getall", fetch);
route.get("/get/:id", getSingleItem);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteItem); 


export default route;