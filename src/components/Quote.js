import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TextareaAutosize from "react-textarea-autosize";
import Card from "./Card";
import {
    AUTHOR_ICON,
    COLLECTION_ICON,
    CONFIRM_ICON,
    EDIT_ICON,
    QUOTE_L_ICON,
    QUOTE_R_ICON,
    SPINNER_ICON,
    TOPIC_ICON,
    TRASH_ICON,
} from "../constants/icons";
import KEY_CODES from "../constants/keyCodes";

import styles from "./styles/quotes.scss";

const Quote = observer(({
    isEditing,
    onLeave,
    item: quote,
    shouldRenderToolBar,
    setItemIdEditing: setQuoteIdEditing = () => {},
    setAuthorSelectionModalQuote,
    setCollectionSelectionModalQuote,
    setTopicSelectionModalQuote,
    store,
}) => {
    const { isSavingText, isUpdatingAuthor, isUpdatingCollection, isUpdatingTopic } = quote;

    const beginEditQuote = () => setQuoteIdEditing(quote.id);

    const onBlur = () => setTimeout(() => onLeave(quote), 0);

    const onCollectionSelection = () => setCollectionSelectionModalQuote(quote);

    const onAuthorSelection = () => setAuthorSelectionModalQuote(quote);

    const onTopicSelection = () => setTopicSelectionModalQuote(quote);

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote?')) return;
        await store.removeQuote(quote);
    };

    const onFocus = () => {
        const text = quote.text;
        quote.text = '';
        setTimeout(() => quote.text = text, 0);
    };

    const onKeyDown = e => {
        if (e.metaKey && e.keyCode === KEY_CODES.ENTER) onBlur();
    };

    const onTextChange = e => quote.setText(e.target.value);

    let editIcon;
    if (isSavingText) editIcon = SPINNER_ICON;
    else if (isEditing) editIcon = CONFIRM_ICON;
    else editIcon = EDIT_ICON;

    const authorIcon = isUpdatingAuthor ? SPINNER_ICON : AUTHOR_ICON;
    const collectionIcon = isUpdatingCollection ? SPINNER_ICON : COLLECTION_ICON;
    const topicIcon = isUpdatingTopic ? SPINNER_ICON : TOPIC_ICON;

    let content;
    if (isEditing) {
        content = (
            <div className={styles.content}>
                <TextareaAutosize
                    autoFocus
                    onBlur={onBlur}
                    onChange={onTextChange}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    value={quote.text}
                />
                <div className={styles.secondaryProperties}>
                    {quote.text.length} / 4000
                </div>
            </div>
        );
    } else {
        content = (
            <>
                <div className={styles.content}>
                    <span className={styles.quoteLeft}>
                        <FontAwesomeIcon icon={QUOTE_L_ICON} size='xs' />
                    </span>
                    <TextareaAutosize value={quote.text} readOnly />
                    <span className={styles.quoteRight}>
                        <FontAwesomeIcon icon={QUOTE_R_ICON} size='xs' />
                    </span>
                </div>
                {(quote.authorId || quote.collectionId || quote.topicId) && (
                    <div className={styles.secondaryProperties}>
                        {quote.authorId && (
                            <div>
                                <FontAwesomeIcon icon={AUTHOR_ICON} size="xs"/> {store.getAuthorNameById(quote.authorId)}
                            </div>
                        )}
                        {quote.collectionId && (
                            <div>
                                <FontAwesomeIcon icon={COLLECTION_ICON} size="xs"/> {store.getCollectionNameById(quote.collectionId)}
                            </div>
                        )}
                        {quote.topicId && (
                            <div>
                                <FontAwesomeIcon icon={TOPIC_ICON} size="xs"/> {store.getTopicNameById(quote.topicId)}
                            </div>
                        )}
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
            shouldRotate: isSavingText,
        });

        if (!isEditing) {
            if (quote.id) {
                toolBarButtons.push({
                    icon: collectionIcon,
                    onClick: onCollectionSelection,
                    shouldRotate: isUpdatingCollection,
                });

                toolBarButtons.push({
                    icon: authorIcon,
                    onClick: onAuthorSelection,
                    shouldRotate: isUpdatingAuthor,
                });

                toolBarButtons.push({
                    icon: topicIcon,
                    onClick: onTopicSelection,
                    shouldRotate: isUpdatingTopic,
                });
            }

            toolBarButtons.push({
                icon: TRASH_ICON,
                onClick: onDelete,
            });
        }
    }

    return <Card content={content} toolBarButtons={toolBarButtons} />;
});

export default Quote;