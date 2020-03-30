import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";

import CollectionModel from "../../models/CollectionModel";

import Collection from "../Collection";
import CRUD from "./CRUD";

import { ADD_ICON } from "../../constants/icons";
import ROUTES from "../../../constants/routes";


const Collections = observer(({ store }) => {
    const { collections } = store;

    const [ collectionIdEditing, setCollectionIdEditing ] = useState(null);
    const [ pendingAddCollection, setPendingAddCollection ] = useState(null);

    const history = useHistory();

    const addCollection = () => {
        setCollectionIdEditing(null);

        const newCollection = new CollectionModel({ title: '' });
        setPendingAddCollection(newCollection);
    };

    const onClickCollection = collection => history.push(`${ROUTES.COLLECTIONS}/${collection.id}`);

    const onLeaveNewCollection = async () => {
        if (pendingAddCollection.title) await store.addCollection(pendingAddCollection);
        setPendingAddCollection(null);
    };

    const onLeaveCollection = async collection => {
        setCollectionIdEditing(null);
        await collection.save();
    };

    const headerButtons = [{
        icon: ADD_ICON,
        onClick: addCollection,
    }];

    const sortedCollections = collections
        .slice() // observable array warning
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <CRUD
            headerButtons={headerButtons}
            ItemComponent={Collection}
            itemIdEditing={collectionIdEditing}
            items={sortedCollections}
            noItemsMessage="No collections found"
            onClickItem={onClickCollection}
            onLeaveNewItem={onLeaveNewCollection}
            onLeaveItem={onLeaveCollection}
            pendingAddItem={pendingAddCollection}
            setItemIdEditing={setCollectionIdEditing}
        />
    );
});

export default inject('store')(Collections);