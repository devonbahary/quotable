import RelationalItemModel from "./RelationalItemModel";
import { updateAuthorById } from "../../api/CRUD";

export default class AuthorModel extends RelationalItemModel {
    constructor(author) {
        super(author, updateAuthorById);
    };
};