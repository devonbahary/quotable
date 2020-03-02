import React, { useRef, useState } from "react";
import { inject, observer } from "mobx-react";
import { faCheck, faPen, faPlusSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

import Card from "./Card";
import View from "./View";

import CollectionModel from "../models/Collection";

import styles from "./styles/collections.scss";


const Collection = observer(({
    collection,
    isEditing,
    onLeave,
    removeCollection,
    setCollectionIdEditing,
}) => {
    const inputRef = useRef(null);

    const beginEditCollection = () => setCollectionIdEditing(collection.id);

    const onBlur = async () =>  {
        if (!isEditing) return;
        await onLeave(collection);
    };

    const onDelete = () => {
        if (!confirm(`Are you sure you want to delete this collection?`)) return;
        removeCollection(collection);
    };

    const onTitleChange = e => collection.title = e.target.value;

    const { title } = collection;

    if (isEditing) setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
    }, 0);

    const content = (
        <div className={styles.content}>
            <input
                type="text"
                onBlur={onBlur}
                onChange={onTitleChange}
                placeholder={collection.id ? "unnamed collection" : "new collection"}
                readOnly={!isEditing}
                ref={ref => inputRef.current = ref}
                value={title}
            />
        </div>
    );

    const editIcon = isEditing ? faCheck : faPen;

    const toolBarButtons = [{
        icon: editIcon,
        onClick: beginEditCollection,
    }];

    if (!isEditing) toolBarButtons.push({
        icon: faTrash,
        onClick: onDelete,
    });

    return <Card content={content} toolBarButtons={toolBarButtons} />
});

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
        <View headerButtonIcon={faPlusSquare} onHeaderButtonClick={addCollection}>
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
                            isEditing={collectionIdEditing === collection.id}
                            onLeave={onLeaveCollection}
                            removeCollection={store.removeCollection}
                            setCollectionIdEditing={setCollectionIdEditing}
                        />
                    ))}
            </ul>
        </View>
    );
});

export default inject('store')(Collections);