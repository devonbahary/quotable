import React, { useRef } from "react";
import { inject } from "mobx-react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Card from "./Card";

import { CONFIRM_ICON, EDIT_ICON, QUOTE_L_ICON, SPINNER_ICON, TRASH_ICON } from "../constants/icons";
import KEY_CODES from "../constants/keyCodes";

import styles from "./styles/relational-item.scss";

const RelationalQuoteItem = ({
    getQuoteCountByRelationshipId,
    item,
    isEditing,
    newItemText,
    onClickItem = () => {},
    onLeave,
    removeItem,
    shouldRenderToolBar,
    setItemIdEditing,
    unnamedItemText,
    value,
}) => {
    const quoteCountByRelationship = getQuoteCountByRelationshipId(item.id);

    const inputRef = useRef(null);

    const beginEditItem = () => setItemIdEditing(item.id);

    const onBlur = async () =>  {
        if (!isEditing) return;
        await onLeave(item);
    };

    const onChange = e => item.name = e.target.value;

    const onClick = () => onClickItem(item);

    const onDelete = async () => {
        if (!confirm(`Are you sure you want to delete author "${item.name}"?`)) return;

        let removeRelatedQuotes = false;
        if (quoteCountByRelationship) {
            removeRelatedQuotes = confirm(`Do you want to delete ${quoteCountByRelationship} quotes in "${item.name}" as well?`);
        }

        await removeItem(item, removeRelatedQuotes);
    };

    const onKeyDown = async e => {
        if (e.keyCode === KEY_CODES.ENTER) await onBlur();
    };

    if (isEditing) setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
    }, 0);

    const inputClassName = classNames({ [styles.muted]: item.id === null });

    const content = (
        <div className={styles.content}>
            <div className={styles.body} onClick={onClick}>
                <input
                    className={inputClassName}
                    type="text"
                    onBlur={onBlur}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={item.id ? unnamedItemText : newItemText}
                    readOnly={!isEditing}
                    ref={ref => inputRef.current = ref}
                    value={value}
                />
            </div>
            {Boolean(quoteCountByRelationship) && (
                <div className={styles.details}>
                    <FontAwesomeIcon icon={QUOTE_L_ICON} size="sm" /> {quoteCountByRelationship}
                </div>
            )}
        </div>
    );

    let editIcon;
    if (item.isSaving) editIcon = SPINNER_ICON;
    else if (isEditing) editIcon = CONFIRM_ICON;
    else editIcon = EDIT_ICON;

    const toolBarButtons = [];
    if (shouldRenderToolBar) {
        toolBarButtons.push({
            icon: editIcon,
            onClick: beginEditItem,
            shouldRotate: item.isSaving,
        });

        if (!isEditing) toolBarButtons.push({
            icon: TRASH_ICON,
            onClick: onDelete,
        });
    }

    return (
        <Card content={content} toolBarButtons={toolBarButtons} />
    );
};

export default inject('store')(RelationalQuoteItem);