import React, { useState } from "react";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

import Collection from "./Collection";
import SingleMessageView from "../SingleMessageView";
import View from "../View";
import { ADD_ICON } from "../../constants";
import ROUTES from "../../../constants/routes";

import CollectionModel from "../../models/Collection";


const Collections = withRouter(observer(({ history, store }) => {
    const { collections } = store;

    const [ collectionIdEditing, setCollectionIdEditing ] = useState(null);
    const [ pendingAddCollection, setPendingAddCollection ] = useState(null);

    const addCollection = () => {
        setCollectionIdEditing(null);

        const newCollection = new CollectionModel({ title: '' });
        setPendingAddCollection(newCollection);
    };

    const onClickCollection = collectionId => history.push(`${ROUTES.QUOTES}?collectionId=${collectionId}`);

    const onLeaveNewCollection = async () => {
        if (pendingAddCollection.title) await store.addCollection(pendingAddCollection);
        setPendingAddCollection(null);
    };

    const onLeaveCollection = async collection => {
        setCollectionIdEditing(null);
        await collection.save();
    };

    const displayNoResults = !collections.length && !pendingAddCollection;

    return (
        <View headerButtonIcon={ADD_ICON} onHeaderButtonClick={addCollection}>
            {!displayNoResults ? (
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
                                onClickCollection={() => onClickCollection(collection.id)}
                                onLeave={onLeaveCollection}
                                shouldRenderToolBar
                                setCollectionIdEditing={setCollectionIdEditing}
                            />
                        ))}
                </ul>
            ) : (
                <SingleMessageView message="No collections found" />
            )}

        </View>
    );
}));

export default inject('store')(Collections);