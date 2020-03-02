import React, { useRef, useState } from "react";
import { inject, observer } from "mobx-react";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";

import Card from "./Card";
import View from "./View";

import styles from "./styles/collections.scss";


const Collection = observer(({ collection, isEditing, setCollectionIdEditing }) => {
    const inputRef = useRef(null);

    const beginEditCollection = () => setCollectionIdEditing(collection.id);

    const onBlur = async () =>  {
        if (!isEditing) return;
        setCollectionIdEditing(null);
        await collection.save();
    };
    const onTitleChange = e => collection.title = e.target.value;

    const { title } = collection;

    if (isEditing) inputRef.current.focus();

    const content = (
        <div className={styles.content}>
            <input
                type="text"
                onBlur={onBlur}
                onChange={onTitleChange}
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

    return <Card content={content} toolBarButtons={toolBarButtons} />
});

const Collections = observer(({ store }) => {
    const { collections } = store;

    const [ collectionIdEditing, setCollectionIdEditing ] = useState(null);

    return (
        <View>
            <ul>
                {collections
                    .slice() // observable array warning
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(collection=> (
                        <Collection
                            key={collection.id}
                            collection={collection}
                            isEditing={collectionIdEditing === collection.id}
                            setCollectionIdEditing={setCollectionIdEditing}
                        />
                    ))}
            </ul>
        </View>
    );
});

export default inject('store')(Collections);