import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TextareaAutosize from "react-textarea-autosize";
import Card from "../Card";
import { COLLECTION_ICON, CONFIRM_ICON, EDIT_ICON, QUOTE_L_ICON, QUOTE_R_ICON, TRASH_ICON } from "../../constants";

import styles from "../styles/quotes.scss";

const Quote = observer(({
    isEditing,
    onClickQuote = () => {},
    onLeave,
    quote,
    shouldRenderToolBar,
    setQuoteIdEditing = () => {},
    setCollectionSelectionModalQuote,
    store,
}) => {
    const beginEditQuote = () => setQuoteIdEditing(quote.id);

    const onBlur = () => setTimeout(() => onLeave(quote), 0);

    const onCollectionSelection = () => setCollectionSelectionModalQuote(quote);

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote?')) return;
        await store.removeQuote(quote);
    };

    const onFocus = () => {
        const text = quote.text;
        quote.text = '';
        setTimeout(() => quote.text = text, 0);
    };
    const onTextChange = e => quote.setText(e.target.value);

    const editIcon = isEditing ? CONFIRM_ICON : EDIT_ICON;

    let content;
    if (isEditing) {
        content = (
            <div className={styles.content}>
                <TextareaAutosize
                    autoFocus
                    onBlur={onBlur}
                    onChange={onTextChange}
                    onFocus={onFocus}
                    value={quote.text}
                />
            </div>
        );
    } else {
        content = (
            <>
                <div className={styles.content} onClick={onClickQuote}>
                    <span className={styles.quoteLeft}>
                        <FontAwesomeIcon icon={QUOTE_L_ICON} size='xs' />
                    </span>
                    <TextareaAutosize value={quote.text} readOnly />
                    <span className={styles.quoteRight}>
                        <FontAwesomeIcon icon={QUOTE_R_ICON} size='xs' />
                    </span>
                </div>
                {quote.collectionId && (
                    <div className={styles.collectionTitle}>
                        - {store.getCollectionTitleById(quote.collectionId)}
                    </div>
                )}
            </>
        );
    }

    const toolBarButtons = [];
    if (shouldRenderToolBar) {
        toolBarButtons.push({
            icon: editIcon,
            onClick: beginEditQuote,
        });

        if (!isEditing) {
            if (quote.id) toolBarButtons.push({
                icon: COLLECTION_ICON,
                onClick: onCollectionSelection,
            });

            toolBarButtons.push({
                icon: TRASH_ICON,
                onClick: onDelete,
            });
        }
    }

    return <Card content={content} toolBarButtons={toolBarButtons} />;
});

export default Quote;