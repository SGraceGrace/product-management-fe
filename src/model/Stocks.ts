import { Quantity } from "./Quantity";

export interface Stocks {
    id:string;
    stockName:string;
    quantity: Quantity;
    sourceCompany: string;
    warehouse: string;
    product: string
}