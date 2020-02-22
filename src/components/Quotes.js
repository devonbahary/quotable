import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faQuoteRight, faPen } from '@fortawesome/free-solid-svg-icons'

import TextareaAutosize from "react-textarea-autosize";
import View from "./View";

import styles from "./styles/quotes.scss";


const Content = observer(({ isEditing, quote, toggleIsEditing }) => {
    const onTextChange = e => quote.setText(e.target.value);

    if (isEditing) return (
        <div className={styles.content}>
            <TextareaAutosize
                autoFocus
                onBlur={toggleIsEditing}
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
    const isEditing = quoteIdEditing === quote.id;

    const toggleIsEditing = () => {
        setQuoteIdEditing(isEditing ? null : quote.id);
    };

    return (
        <li className={styles.quote}>
            <Content isEditing={isEditing} quote={quote} toggleIsEditing={toggleIsEditing} />
            <div className={styles.toolBar}>
                <div className={styles.icon} onClick={toggleIsEditing}>
                    <FontAwesomeIcon icon={faPen} />
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