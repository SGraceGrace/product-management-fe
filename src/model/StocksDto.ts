import { Quantity } from "./Quantity";
import { UserDto } from "./UserDTO";

export interface StocksDto {
    id: number;
    stockName: string;
    quantity: Quantity;
    sourceCompany: number;
    warehouse: number;
    product: number;
    userDTO: UserDto;
}