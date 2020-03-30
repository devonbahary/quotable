import React from "react";
import { inject, observer } from "mobx-react";

import SingleMessageView from "../SingleMessageView";
import View from "./View";


const CRUD = observer(({
    children,
    headerButtons,
    ItemComponent,
    itemIdEditing,
    items,
    noItemsMessage,
    onClickItem,
    onLeaveItem,
    onLeaveNewItem,
    pendingAddItem,
    setAuthorSelectionModalQuote,
    setCollectionSelectionModalQuote,
    setItemIdEditing,
    store,
}) => {
    const displayNoResults = !items.length && !pendingAddItem;

    return (
        <View headerButtons={headerButtons}>
            {children}
            {displayNoResults ? (
                <SingleMessageView message={noItemsMessage}/>
            ) : (
                <ul>
                    {pendingAddItem && (
                        <ItemComponent
                            isEditing
                            onLeave={onLeaveNewItem}
                            item={pendingAddItem}
                            shouldRenderToolBar
                        />
                    )}
                    {items.map(item => (
                        <ItemComponent
                            key={item.id}
                            isEditing={itemIdEditing === item.id}
                            onClickItem={onClickItem}
                            onLeave={onLeaveItem}
                            item={item}
                            setItemIdEditing={setItemIdEditing}
                            setCollectionSelectionModalQuote={setCollectionSelectionModalQuote}
                            setAuthorSelectionModalQuote={setAuthorSelectionModalQuote}
                            shouldRenderToolBar
                            store={store}
                        />
                    ))}
                </ul>
            )}
        </View>
    );
});

export default inject('store')(CRUD);