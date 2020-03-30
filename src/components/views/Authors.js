import React, { useRef } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import AuthorModel from "../../models/AuthorModel";

import Card from "../Card";

import {
    CONFIRM_ICON,
    EDIT_ICON,
    QUOTE_L_ICON,
    SPINNER_ICON,
    TRASH_ICON,
} from "../../constants/icons";
import KEY_CODES from "../../constants/keyCodes";

import styles from "../styles/collection.scss";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


export const UNNAMED_AUTHOR = "unnamed author";

export const Author = observer(({
     item: author,
     isEditing,
     onClickItem: onClickAuthor = () => {},
     onLeave,
     shouldRenderToolBar,
     setItemIdEditing: setAuthorIdEditing,
     store,
 }) => {
    const inputRef = useRef(null);

    const beginEditAuthor = () => setAuthorIdEditing(author.id);

    const onBlur = async () =>  {
        if (!isEditing) return;
        await onLeave(author);
    };

    const onDelete = async () => {
        if (!confirm(`Are you sure you want to delete author "${author.name}"?`)) return;

        const quoteCountByAuthor = store.getQuoteCountByAuthorId(author.id);

        let removeQuotesByAuthor = false;
        if (quoteCountByAuthor) {
            removeQuotesByAuthor = confirm(`Do you want to delete ${quoteCountByAuthor} quotes in "${author.name}" as well?`);
        }

        await store.removeAuthor(author, removeQuotesByAuthor);
    };

    const onKeyDown = async e => {
        if (e.keyCode === KEY_CODES.ENTER) await onBlur();
    };

    const onNameChange = e => author.name = e.target.value;

    const { name } = author;

    if (isEditing) setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
    }, 0);

    const inputClassName = classNames({ [styles.muted]: author.id === null });

    const quoteCount = store ? store.getQuoteCountByAuthorId(author.id) : 0;

    const content = (
        <div className={styles.content} onClick={() => onClickAuthor(author)}>
            <div className={styles.title}>
                <input
                    className={inputClassName}
                    type="text"
                    onBlur={onBlur}
                    onChange={onNameChange}
                    onKeyDown={onKeyDown}
                    placeholder={author.id ? UNNAMED_AUTHOR : "new author"}
                    readOnly={!isEditing}
                    ref={ref => inputRef.current = ref}
                    value={name}
                />
            </div>
            {Boolean(quoteCount) && (
                <div className={styles.details}>
                    <FontAwesomeIcon icon={QUOTE_L_ICON} size="sm" /> {quoteCount}
                </div>
            )}
        </div>
    );

    let editIcon;
    if (author.isSaving) editIcon = SPINNER_ICON;
    else if (isEditing) editIcon = CONFIRM_ICON;
    else editIcon = EDIT_ICON;

    const toolBarButtons = [];
    if (shouldRenderToolBar) {
        toolBarButtons.push({
            icon: editIcon,
            onClick: beginEditAuthor,
            shouldRotate: author.isSaving,
        });

        if (!isEditing) toolBarButtons.push({
            icon: TRASH_ICON,
            onClick: onDelete,
        });
    }

    return <Card content={content} toolBarButtons={toolBarButtons} />
});

const Authors = observer(({ store }) => {
    const { authors } = store;

    const addNewAuthor = async author => {
        if (author.name) await store.addAuthor(author);
    };

    const createNewAuthor = () => new AuthorModel();

    const sortedAuthors = authors
        .slice() // observable array warning
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <RelationalQuoteItemList
            addNewItem={addNewAuthor}
            createNewItem={createNewAuthor}
            ItemComponent={Author}
            items={sortedAuthors}
            noItemsMessage="No authors found"
        />
    );
});

export default inject('store')(Authors);