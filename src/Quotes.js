import React from "react";
import { inject, observer } from "mobx-react";

const Quotes = observer(({ store }) => {
    const { quotes } = store;

    return (
        <>
            <h2>Quotes</h2>
            {quotes.map(q => q.text)}
        </>
    );
});

export default inject('store')(Quotes);