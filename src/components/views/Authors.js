import React from "react";
import { inject, observer } from "mobx-react";

import AuthorModel from "../../models/AuthorModel";

import RelationalQuoteItem from "../RelationalQuoteItem";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


export const UNNAMED_AUTHOR = "unnamed author";

export const Author = observer(({
     item: author,
     isEditing,
     onLeave,
     shouldRenderToolBar,
     setItemIdEditing: setAuthorIdEditing,
     store,
 }) => {
    const getQuoteCountByAuthorId = store ? store.getQuoteCountByAuthorId : () => 0;

    const onNameChange = e => author.name = e.target.value;

    const removeAuthor = store ? store.removeAuthor : () => {};

    return (
        <RelationalQuoteItem
            getQuoteCountByRelationshipId={getQuoteCountByAuthorId}
            item={author}
            isEditing={isEditing}
            newItemText="new author"
            onLeave={onLeave}
            onTextChange={onNameChange}
            removeItem={removeAuthor}
            shouldRenderToolBar={shouldRenderToolBar}
            setItemIdEditing={setAuthorIdEditing}
            unnamedItemText={UNNAMED_AUTHOR}
            value={author.name}
        />
    )
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