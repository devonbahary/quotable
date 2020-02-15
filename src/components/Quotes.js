import React from "react";
import { inject, observer } from "mobx-react";
import View from "./View";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons'

import styles from "./styles/quotes.scss";

const Quotes = observer(({ store }) => {
    const { quotes } = store;

    return (
        <View>
            <ul>
                {quotes.map(q => (
                    <li key={q.id} className={styles.quote}>
                        <span className={styles.quoteLeft}>
                            <FontAwesomeIcon icon={faQuoteLeft} size='xs' />
                        </span>
                        {q.text}
                        <span className={styles.quoteRight}>
                            <FontAwesomeIcon icon={faQuoteRight} size='xs' />
                        </span>
                    </li>
                ))}
            </ul>
        </View>
    );
});

export default inject('store')(Quotes);