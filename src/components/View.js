import React, { useState } from "react";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBook, faHome, faQuoteLeft, faUser } from '@fortawesome/free-solid-svg-icons'
import ROUTES from "../../constants/routes";

import styles from "./styles/view.scss";


const Menu = withRouter(({ history, isOpen, toggleMenu }) => {
    const navigateTo = location => {
        history.push(location);
        toggleMenu();
    };

    const menuClassName = `${styles.menu} ${!isOpen ? styles.closed : ''}`;

    return (
        <section className={menuClassName}>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.HOME)}>
                <FontAwesomeIcon icon={faHome} size="lg" />
            </div>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.QUOTES)}>
                <FontAwesomeIcon icon={faQuoteLeft} size="lg" />
            </div>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.COLLECTIONS)}>
                <FontAwesomeIcon icon={faBook} size="lg" />
            </div>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.LOGIN)}>
                <FontAwesomeIcon icon={faUser} size="lg" />
            </div>
        </section>
    );
});

const View = ({ children }) => {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const headerIconClassName = `${styles.headerIcon} ${isMenuOpen ? styles.active : ''}`;

    return (
        <div>
            <header className={styles.header}>
                <div className={headerIconClassName} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </div>
                <div>
                    Quotable
                </div>
            </header>
            <section className={styles.section}>
                {children}
            </section>
            <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
    );
};

export default View;