import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuoteLeft, faQuoteRight, faPen } from '@fortawesome/free-solid-svg-icons'

import TextareaAutosize from "react-textarea-autosize";
import View from "./View";

import styles from "./styles/quotes.scss";


const Content = observer(({ isEditing, quote, closeEditQuote }) => {
    const onTextChange = e => quote.setText(e.target.value);
    const onBlur = () => setTimeout(closeEditQuote, 0);

    if (isEditing) return (
        <div className={styles.content}>
            <TextareaAutosize
                autoFocus
                onBlur={onBlur}
                onChange={onTextChange}
                value={quote.text}
            />
        </div>
    );

    return (
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
});

const Quote = ({ quote, quoteIdEditing, setQuoteIdEditing }) => {
    const beginEditQuote = () => setQuoteIdEditing(quote.id);
    const closeEditQuote = () => setQuoteIdEditing(null);

    const isEditing = quoteIdEditing === quote.id;
    const editIcon = isEditing ? faCheck : faPen;

    return (
        <li className={styles.quote}>
            <Content closeEditQuote={closeEditQuote} isEditing={isEditing} quote={quote} />
            <div className={styles.toolBar}>
                <div className={styles.icon} onClick={beginEditQuote}>
                    <FontAwesomeIcon icon={editIcon} />
                </div>
            </div>
        </li>
    );
};

const Quotes = observer(({ store }) => {
    const { quotes } = store;

    const [ quoteIdEditing, setQuoteIdEditing ] = useState(null);

    return (
        <View>
            <ul>
                {quotes.map(quote=> (
                    <Quote
                        key={quote.id}
                        quote={quote}
                        quoteIdEditing={quoteIdEditing}
                        setQuoteIdEditing={setQuoteIdEditing}
                    />
                ))}
            </ul>
        </View>
    );
});

export default inject('store')(Quotes);