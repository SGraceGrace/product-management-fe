import { UserDto } from "./UserDTO";

export interface ProductDTO{
    id: number;
    productName: string;
    productType: string;
    description: string;
    price: number;
    userDTO: UserDto;
}