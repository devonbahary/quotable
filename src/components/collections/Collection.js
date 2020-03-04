import React, { useRef } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import Card from "../Card";
import { CONFIRM_ICON, EDIT_ICON, TRASH_ICON, UNTITLED_COLLECTION } from "../../constants";

import styles from "../styles/collection.scss";

const Collection = observer(({
    collection,
    isEditing,
    onClickCollection = () => {},
    onLeave,
    renderToolBars,
    setCollectionIdEditing,
    store,
 }) => {
    const inputRef = useRef(null);

    const beginEditCollection = () => setCollectionIdEditing(collection.id);

    const onBlur = async () =>  {
        if (!isEditing) return;
        await onLeave(collection);
    };

    const onDelete = async () => {
        if (!confirm(`Are you sure you want to delete collection "${collection.title}"?`)) return;

        const quoteCountInCollection = store.getQuoteCountByCollectionId(collection.id);
        const removeQuotesInCollection = confirm(`Do you want to delete ${quoteCountInCollection} quotes in "${collection.title}" as well?`);
        await store.removeCollection(collection, removeQuotesInCollection);
    };

    const onTitleChange = e => collection.title = e.target.value;

    const { title } = collection;

    if (isEditing) setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
    }, 0);

    const inputClassName = classNames({ [styles.muted]: collection.id === null });

    const content = (
        <div className={styles.content} onClick={() => onClickCollection(collection)}>
            <input
                className={inputClassName}
                type="text"
                onBlur={onBlur}
                onChange={onTitleChange}
                placeholder={collection.id ? UNTITLED_COLLECTION : "new collection"}
                readOnly={!isEditing}
                ref={ref => inputRef.current = ref}
                value={title}
            />
        </div>
    );

    const editIcon = isEditing ? CONFIRM_ICON : EDIT_ICON;

    const toolBarButtons = [];
    if (renderToolBars) {
        toolBarButtons.push({
            icon: editIcon,
            onClick: beginEditCollection,
        });

        if (!isEditing) toolBarButtons.push({
            icon: TRASH_ICON,
            onClick: onDelete,
        });
    }

    return <Card content={content} toolBarButtons={toolBarButtons} />
});

export default Collection;