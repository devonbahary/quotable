import React from "react";

import styles from "./styles/modal.scss";

const Modal = ({ children }) => {
    return (
        <div className={styles.modal}>
            {children}
        </div>
    );
};

export default Modal;