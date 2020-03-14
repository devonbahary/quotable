import React from "react";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import Quote from "../Quote";
import View from "./View";

import ROUTES from "../../../constants/routes";

import styles from "../styles/home.scss";

const Home = withRouter(observer(({ history, store }) => {
    const quoteLen = store.quotes.length;
    const randIndex = Math.floor(Math.random() * quoteLen);
    const randomQuote = quoteLen ? store.quotes[randIndex] : null;

    const onClickQuote = () => history.push(ROUTES.QUOTES);

    return (
        <View>
            {Boolean(randomQuote) && (
                <ul className={styles.home}>
                    <Quote onClickQuote={onClickQuote} quote={randomQuote} store={store} />
                </ul>
            )}
        </View>
    );
}));

export default inject('store')(Home);