import React from "react";
import { inject, observer } from "mobx-react";

import CollectionModel from "../../models/CollectionModel";

import RelationalQuoteItem from "../RelationalQuoteItem";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


export const UNTITLED_COLLECTION = "unnamed collection";

export const Collection = observer(({
    item: collection,
    isEditing,
    onLeave,
    shouldRenderToolBar,
    setItemIdEditing: setCollectionIdEditing,
    store,
}) => {
    const getQuoteCountByCollectionId = store ? store.getQuoteCountByCollectionId : () => 0;

    const onTitleChange = e => collection.title = e.target.value;

    const removeCollection = store ? store.removeCollection : () => {};

    return (
        <RelationalQuoteItem
            getQuoteCountByRelationshipId={getQuoteCountByCollectionId}
            item={collection}
            isEditing={isEditing}
            newItemText="new collection"
            onLeave={onLeave}
            onTextChange={onTitleChange}
            removeItem={removeCollection}
            shouldRenderToolBar={shouldRenderToolBar}
            setItemIdEditing={setCollectionIdEditing}
            unnamedItemText={UNTITLED_COLLECTION}
            value={collection.title}
        />
    );
});

const Collections = observer(({ store }) => {
    const { collections } = store;

    const addNewCollection = async collection => {
        if (collection.title) await store.addCollection(collection);
    };

    const createNewCollection = () => new CollectionModel();

    const sortedCollections = collections
        .slice() // observable array warning
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <RelationalQuoteItemList
            addNewItem={addNewCollection}
            createNewItem={createNewCollection}
            ItemComponent={Collection}
            items={sortedCollections}
            noItemsMessage="No collections found"
        />
    );
});

export default inject('store')(Collections);