import React from "react";
import { inject, observer } from "mobx-react";
import View from "./View";

const Quotes = observer(({ store }) => {
    const { quotes } = store;

    return (
        <View>
            <h2>Quotes</h2>
            <ul>
                {quotes.map(q => (
                    <li key={q.id}>
                        {q.text}
                    </li>
                ))}
            </ul>
        </View>
    );
});

export default inject('store')(Quotes);