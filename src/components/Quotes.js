import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuoteLeft, faQuoteRight, faPen } from '@fortawesome/free-solid-svg-icons'

import TextareaAutosize from "react-textarea-autosize";
import View from "./View";

import styles from "./styles/quotes.scss";


const Quote = ({ isEditing, quote, setQuoteIdEditing }) => {
    const beginEditQuote = () => setQuoteIdEditing(quote.id);
    const closeEditQuote = () => setQuoteIdEditing(null);

    const onBlur = () => setTimeout(closeEditQuote, 0);
    const onTextChange = e => quote.setText(e.target.value);

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
                        isEditing={quoteIdEditing === quote.id}
                        quote={quote}
                        setQuoteIdEditing={setQuoteIdEditing}
                    />
                ))}
            </ul>
        </View>
    );
});

export default inject('store')(Quotes);