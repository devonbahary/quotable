import { orderBy, toLower } from "lodash";
import React from "react";
import { inject, observer } from "mobx-react";

import AuthorModel from "../../models/relational-items/AuthorModel";

import RelationalQuoteItem from "../RelationalQuoteItem";
import RelationalQuoteItemList from "../RelationalQuoteItemList";


export const UNNAMED_AUTHOR = "unnamed author";

export const Author = observer(({
    item: author,
    isEditing,
    onClickItem,
    onLeave,
    shouldRenderToolBar,
    setItemIdEditing: setAuthorIdEditing,
    store,
 }) => {
    const getQuoteCountByAuthorId = store ? store.getQuoteCountByAuthorId : () => 0;

    const removeAuthor = store ? store.removeAuthor : () => {};

    return (
        <RelationalQuoteItem
            getQuoteCountByRelationshipId={getQuoteCountByAuthorId}
            item={author}
            isEditing={isEditing}
            newItemText="new author"
            onClickItem={onClickItem}
            onLeave={onLeave}
            removeItem={removeAuthor}
            shouldRenderToolBar={shouldRenderToolBar}
            setItemIdEditing={setAuthorIdEditing}
            unnamedItemText={UNNAMED_AUTHOR}
            value={author.name}
        />
    )
});

const Authors = observer(({ store }) => {
    const { sortedAuthors } = store;

    const addNewAuthor = async author => {
        if (author.name) await store.addAuthor(author);
    };

    const createNewAuthor = () => new AuthorModel();

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