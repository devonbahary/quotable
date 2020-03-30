import React from "react";
import { inject, observer } from "mobx-react";

import TopicModel from "../../models/relational-items/TopicModel";

import RelationalQuoteItem from "../RelationalQuoteItem";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


export const UNNAMED_TOPIC = "unnamed topic";

export const Topic = observer(({
    item: topic,
    isEditing,
    onClickItem,
    onLeave,
    shouldRenderToolBar,
    setItemIdEditing: setTopicIdEditing,
    store,
}) => {
    const getQuoteCountByTopicId = store ? store.getQuoteCountByTopicId : () => 0;

    const removeTopic = store ? store.removeTopic : () => {};

    return (
        <RelationalQuoteItem
            getQuoteCountByRelationshipId={getQuoteCountByTopicId}
            item={topic}
            isEditing={isEditing}
            newItemText="new topic"
            onClickItem={onClickItem}
            onLeave={onLeave}
            removeItem={removeTopic}
            shouldRenderToolBar={shouldRenderToolBar}
            setItemIdEditing={setTopicIdEditing}
            unnamedItemText={UNNAMED_TOPIC}
            value={topic.name}
        />
    );
});

const Topics = observer(({ store }) => {
    const { sortedTopics } = store;

    const addNewTopic = async topic => {
        if (topic.name) await store.addTopic(topic);
    };

    const createNewTopic = () => new TopicModel(); // TODO: can be consolidated by passing in model?

    return (
        <RelationalQuoteItemList
            addNewItem={addNewTopic}
            createNewItem={createNewTopic}
            ItemComponent={Topic}
            items={sortedTopics}
            noItemsMessage="No topics found"
        />
    );
});

export default inject('store')(Topics);