import React from "react";
import { inject, observer } from "mobx-react";

import LoadingIcon from "../LoadingIcon";
import SingleMessageView from "../SingleMessageView";
import View from "./View";

import styles from "../styles/crud.scss";

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
    setTopicSelectionModalQuote,
    setItemIdEditing,
    store,
}) => {
    const { isLoadingUserResources } = store;
    const displayNoResults = !items.length && !pendingAddItem;

    return (
        <View headerButtons={headerButtons}>
            {children}
            {isLoadingUserResources ? (
                <div className={styles.loadingState}>
                    <LoadingIcon />
                </div>
            ) : displayNoResults ? (
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
                            setAuthorSelectionModalQuote={setAuthorSelectionModalQuote}
                            setCollectionSelectionModalQuote={setCollectionSelectionModalQuote}
                            setTopicSelectionModalQuote={setTopicSelectionModalQuote}
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