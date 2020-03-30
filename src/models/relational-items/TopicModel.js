import RelationalItemModel from "./RelationalItemModel";
import { updateTopicById } from "../../api/CRUD";

export default class TopicModel extends RelationalItemModel {
    constructor(topic) {
        super(topic, updateTopicById);
    };
};