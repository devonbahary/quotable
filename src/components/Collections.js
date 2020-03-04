import React, { useState } from "react";
import { inject, observer } from "mobx-react";

import Collection from "./Collection";
import View from "./View";
import { ADD_ICON } from "../constants";

import CollectionModel from "../models/Collection";


const Collections = observer(({ store }) => {
    const { collections } = store;

    const [ collectionIdEditing, setCollectionIdEditing ] = useState(null);
    const [ pendingAddCollection, setPendingAddCollection ] = useState(null);

    const addCollection = () => {
        setCollectionIdEditing(null);

        const newCollection = new CollectionModel({ title: '' });
        setPendingAddCollection(newCollection);
    };

    const onLeaveNewCollection = async () => {
        if (pendingAddCollection.title) await store.addCollection(pendingAddCollection);
        setPendingAddCollection(null);
    };

    const onLeaveCollection = async collection => {
        setCollectionIdEditing(null);
        await collection.save();
    };

    return (
        <View headerButtonIcon={ADD_ICON} onHeaderButtonClick={addCollection}>
            <ul>
                {pendingAddCollection && (
                    <Collection
                        collection={pendingAddCollection}
                        isEditing
                        onLeave={onLeaveNewCollection}
                        setCollectionIdEditing={setCollectionIdEditing}
                    />
                )}
                {collections
                    .slice() // observable array warning
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(collection=> (
                        <Collection
                            key={collection.id}
                            collection={collection}
                            store={store}
                            isEditing={collectionIdEditing === collection.id}
                            onLeave={onLeaveCollection}
                            renderToolBars
                            setCollectionIdEditing={setCollectionIdEditing}
                        />
                    ))}
            </ul>
        </View>
    );
});

export default inject('store')(Collections);