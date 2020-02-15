import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import styles from "./styles/view.scss";

const View = ({ children }) => {
    return (
        <div>
            <header className={styles.header}>
                <div className={styles.headerIcon}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </div>
                <div>
                    Quotable
                </div>
            </header>
            <section className={styles.section}>
                {children}
            </section>
        </div>
    );
};

export default View;