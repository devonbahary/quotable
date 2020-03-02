import React from "react";
import { inject, observer } from "mobx-react";
import View from "./View";

import styles from "./styles/collections.scss";


const Collection = observer(({ collection }) => {
    const onBlur = collection.save;
    const onTitleChange = e => collection.setTitle(e.target.value);

    const { title } = collection;
    return (
        <div className={styles.collection}>
            <input type="text" onBlur={onBlur} onChange={onTitleChange} value={title} />
        </div>
    );
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