import React from "react";
import { inject, observer } from "mobx-react";

import CollectionModel from "../../models/CollectionModel";

import Collection from "../Collection";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


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