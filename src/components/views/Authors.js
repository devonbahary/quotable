import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import AuthorModel from "../../models/AuthorModel";

import Card from "../Card";
import CRUD from "./CRUD";

import {
    ADD_ICON,
    CONFIRM_ICON,
    EDIT_ICON,
    QUOTE_L_ICON,
    SPINNER_ICON,
    TRASH_ICON,
} from "../../constants/icons";
import KEY_CODES from "../../constants/keyCodes";

import styles from "../styles/collection.scss";


const UNNAMED_AUTHOR = "unnamed author";

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

    const [ authorIdEditing, setAuthorIdEditing ] = useState(null);
    const [ pendingAddAuthor, setPendingAddAuthor ] = useState(null);

    const history = useHistory();

    const addAuthor = () => {
        setAuthorIdEditing(null);

        const newAuthor = new AuthorModel({ title: '' });
        setPendingAddAuthor(newAuthor);
    };

    // const onClickAuthor = author => history.push(`${ROUTES.AUTHORS}/${author.id}`);
    const onClickAuthor = () => {}; // TODO

    const onLeaveNewAuthor = async () => {
        if (pendingAddAuthor.name) await store.addAuthor(pendingAddAuthor);
        setPendingAddAuthor(null);
    };

    const onLeaveAuthor = async author => {
        setAuthorIdEditing(null);
        await author.save();
    };

    const headerButtons = [{
        icon: ADD_ICON,
        onClick: addAuthor,
    }];

    const sortedAuthors = authors
        .slice() // observable array warning
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <CRUD
            headerButtons={headerButtons}
            ItemComponent={Author}
            itemIdEditing={authorIdEditing}
            items={sortedAuthors}
            noItemsMessage="No authors found"
            onClickItem={onClickAuthor}
            onLeaveNewItem={onLeaveNewAuthor}
            onLeaveItem={onLeaveAuthor}
            pendingAddItem={pendingAddAuthor}
            setItemIdEditing={setAuthorIdEditing}
        />
    );
});

export default inject('store')(Authors);