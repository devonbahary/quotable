import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import TextareaAutosize from "react-textarea-autosize";
import Card from "./Card";
import View from "./View";
import { ADD_ICON, CONFIRM_ICON, EDIT_ICON, QUOTE_L_ICON, QUOTE_R_ICON, TRASH_ICON } from "../constants";

import QuoteModel from "../models/Quote";

import styles from "./styles/quotes.scss";


const Quote = observer(({
    isEditing,
    onLeave,
    quote,
    removeQuote,
    setQuoteIdEditing = () => {}
}) => {
    const beginEditQuote = () => setQuoteIdEditing(quote.id);

    const onBlur = () => setTimeout(() => onLeave(quote), 0);
    const onFocus = () => {
        const text = quote.text;
        quote.text = '';
        setTimeout(() => quote.text = text, 0);
    };
    const onTextChange = e => quote.setText(e.target.value);

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote?')) return;
        removeQuote(quote);
    };

    const editIcon = isEditing ? CONFIRM_ICON : EDIT_ICON;

    let content;
    if (isEditing) {
        content = (
            <div className={styles.content}>
                <TextareaAutosize
                    autoFocus
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onChange={onTextChange}
                    value={quote.text}
                />
            </div>
        );
    } else {
        content = (
            <div className={styles.content}>
                <span className={styles.quoteLeft}>
                    <FontAwesomeIcon icon={QUOTE_L_ICON} size='xs' />
                </span>
                <TextareaAutosize value={quote.text} readOnly />
                <span className={styles.quoteRight}>
                    <FontAwesomeIcon icon={QUOTE_R_ICON} size='xs' />
                </span>
            </div>
        );
    }

    const toolBarButtons = [{
        icon: editIcon,
        onClick: beginEditQuote,
    }];

    if (!isEditing) toolBarButtons.push({
        icon: TRASH_ICON,
        onClick: onDelete,
    });

    return <Card content={content} toolBarButtons={toolBarButtons} />;
});

const Quotes = observer(({ store }) => {
    const { quotes } = store;

    const [ pendingAddQuote, setPendingAddQuote ] = useState(null);
    const [ quoteIdEditing, setQuoteIdEditing ] = useState(null);

    const addQuote = () => {
        setQuoteIdEditing(null);

        const newQuote = new QuoteModel({ text: '' });
        setPendingAddQuote(newQuote);
    };

    const onLeaveNewQuote = async () => {
        if (pendingAddQuote.text) await store.addQuote(pendingAddQuote);
        setPendingAddQuote(null);
    };

    const onLeaveQuote = async quote => {
        setQuoteIdEditing(null);
        if (!quote.text) await store.removeQuote(quote);
    };

    return (
        <View headerButtonIcon={ADD_ICON} onHeaderButtonClick={addQuote}>
            <ul>
                {pendingAddQuote && (
                    <Quote
                        isEditing
                        onLeave={onLeaveNewQuote}
                        quote={pendingAddQuote}
                    />
                )}
                {quotes
                    .slice() // observable array warning
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(quote=> (
                        <Quote
                            key={quote.id}
                            isEditing={quoteIdEditing === quote.id}
                            onLeave={onLeaveQuote}
                            quote={quote}
                            removeQuote={store.removeQuote}
                            setQuoteIdEditing={setQuoteIdEditing}
                        />
                    ))}
            </ul>
        </View>
    );
});

export default inject('store')(Quotes);