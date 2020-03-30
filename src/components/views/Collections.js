import React from "react";
import { inject, observer } from "mobx-react";

import CollectionModel from "../../models/relational-items/CollectionModel";

import RelationalQuoteItem from "../RelationalQuoteItem";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


export const UNNAMED_COLLECTION = "unnamed collection";

export const Collection = observer(({
    item: collection,
    isEditing,
    onClickItem,
    onLeave,
    shouldRenderToolBar,
    setItemIdEditing: setCollectionIdEditing,
    store,
}) => {
    const getQuoteCountByCollectionId = store ? store.getQuoteCountByCollectionId : () => 0;

    const removeCollection = store ? store.removeCollection : () => {};

    return (
        <RelationalQuoteItem
            getQuoteCountByRelationshipId={getQuoteCountByCollectionId}
            item={collection}
            isEditing={isEditing}
            newItemText="new collection"
            onClickItem={onClickItem}
            onLeave={onLeave}
            removeItem={removeCollection}
            shouldRenderToolBar={shouldRenderToolBar}
            setItemIdEditing={setCollectionIdEditing}
            unnamedItemText={UNNAMED_COLLECTION}
            value={collection.name}
        />
    );
});

const Collections = observer(({ store }) => {
    const { sortedCollections } = store;

    const addNewCollection = async collection => {
        if (collection.name) await store.addCollection(collection);
    };

    const createNewCollection = () => new CollectionModel();

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