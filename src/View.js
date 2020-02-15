import React from "react";

import styles from "./styles/view.scss";

const View = ({ children }) => {
    return (
        <div>
            <header className={styles.header}>
                <h2>Quotable</h2>
            </header>
            <section className={styles.section}>
                {children}
            </section>
        </div>
    );
};

export default View;