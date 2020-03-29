import React from "react";
import { inject, observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import Quote from "../Quote";
import View from "./View";

import ROUTES from "../../../constants/routes";

import styles from "../styles/home.scss";

const Home = observer(({ store }) => {
    const history = useHistory();

    const quoteLen = store.quotes.length;
    const randIndex = Math.floor(Math.random() * quoteLen);
    const randomQuote = quoteLen ? store.quotes[randIndex] : null;

    const onClickQuote = () => history.push(ROUTES.QUOTES); // TODO: send to direct quote?

    return (
        <View>
            {Boolean(randomQuote) && (
                <ul className={styles.home}>
                    <Quote onClickItem={onClickQuote} item={randomQuote} store={store} />
                </ul>
            )}
        </View>
    );
});

export default inject('store')(Home);