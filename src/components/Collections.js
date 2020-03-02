import React from "react";
import { inject, observer } from "mobx-react";

import Card from "./Card";
import View from "./View";

import "./styles/collections.scss";


const Collection = observer(({ collection }) => {
    const onBlur = collection.save;
    const onTitleChange = e => collection.title = e.target.value;

    const { title } = collection;

    const content = <input type="text" onBlur={onBlur} onChange={onTitleChange} value={title} />;
    return <Card content={content} />
});

const Collections = observer(({ store }) => {
    const { collections } = store;

    return (
        <View>
            <ul>
                {collections
                    .slice() // observable array warning
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(collection=> (
                        <Collection
                            key={collection.id}
                            collection={collection}
                        />
                    ))}
            </ul>
        </View>
    );
});

export default inject('store')(Collections);