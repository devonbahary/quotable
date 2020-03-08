import React from "react";

import styles from "./styles/single-message-view.scss";

const SingleMessageView = ({ message }) => (
    <div className={styles.singleMessageView}>
        {message}
    </div>
);

export default SingleMessageView;