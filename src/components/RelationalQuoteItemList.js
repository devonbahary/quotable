import React, { useState } from "react";
import CRUD from "./views/CRUD";
import { ADD_ICON } from "../constants/icons";

const RelationalQuoteItemList = ({
    addNewItem,
    createNewItem,
    ItemComponent,
    items,
    noItemsMessage,
}) => {
    const [ itemIdEditing, setItemIdEditing ] = useState(null);
    const [ pendingAddItem, setPendingAddItem ] = useState(null);

    const addItem = () => {
        setItemIdEditing(null);

        const newItem = createNewItem();
        setPendingAddItem(newItem);
    };

    const onLeaveNewItem = () => {
        addNewItem(pendingAddItem);
        setPendingAddItem(null);
    };

    const onLeaveItem = async item => {
        setItemIdEditing(null);
        await item.save();
    };

    const headerButtons = [{
        icon: ADD_ICON,
        onClick: addItem,
    }];

    return (
        <CRUD
            headerButtons={headerButtons}
            ItemComponent={ItemComponent}
            itemIdEditing={itemIdEditing}
            items={items}
            noItemsMessage={noItemsMessage}
            onLeaveNewItem={onLeaveNewItem}
            onLeaveItem={onLeaveItem}
            pendingAddItem={pendingAddItem}
            setItemIdEditing={setItemIdEditing}
        />
    );
};

export default RelationalQuoteItemList;