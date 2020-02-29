import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPen, faPlusSquare,faQuoteLeft, faQuoteRight, faTrash } from '@fortawesome/free-solid-svg-icons'

import TextareaAutosize from "react-textarea-autosize";
import View from "./View";

import QuoteModel from "../models/Quote";

import styles from "./styles/quotes.scss";


const HeaderButton = ({ addQuote }) => (
    <div className={styles.headerButton} onClick={addQuote}>
        <FontAwesomeIcon icon={faPlusSquare} size='lg' />
    </div>
);

const Quote = observer(({
    isEditing,
    onLeave,
    quote,
    removeQuote,
    setQuoteIdEditing = () => {}
}) => {
    const beginEditQuote = () => setQuoteIdEditing(quote.id);

    const onBlur = () => setTimeout(onLeave, 0);
    const onTextChange = e => quote.setText(e.target.value);

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote?')) return;
        removeQuote(quote);
    };

    const editIcon = isEditing ? faCheck : faPen;

    let content;
    if (isEditing) {
        content = (
            <div className={styles.content}>
                <TextareaAutosize
                    autoFocus
                    onBlur={onBlur}
                    onChange={onTextChange}
                    value={quote.text}
                />
            </div>
        );
    } else {
        content = (
            <div className={styles.content}>
                <span className={styles.quoteLeft}>
                    <FontAwesomeIcon icon={faQuoteLeft} size='xs' />
                </span>
                <TextareaAutosize value={quote.text} readOnly />
                <span className={styles.quoteRight}>
                    <FontAwesomeIcon icon={faQuoteRight} size='xs' />
                </span>
            </div>
        );
    }

    return (
        <li className={styles.quote}>
            {content}
            <div className={styles.toolBar}>
                <div className={styles.icon} onClick={beginEditQuote}>
                    <FontAwesomeIcon icon={editIcon} />
                </div>
                <div className={styles.icon} onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            </div>
        </li>
    );
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

    const onLeaveQuote = () => setQuoteIdEditing(null);

    const headerButton = <HeaderButton addQuote={addQuote} />;

    return (
        <View headerButton={headerButton}>
            <ul>
                {pendingAddQuote && (
                    <Quote
                        isEditing
                        onLeave={onLeaveNewQuote}
                        quote={pendingAddQuote}
                    />
                )}
                {quotes.map(quote=> (
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