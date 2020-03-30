import RelationalItemModel from "./RelationalItemModel";
import { updateCollectionById } from "../../api/CRUD";

export default class CollectionModel extends RelationalItemModel {
    constructor(collection) {
        super(collection, updateCollectionById);
    };
};