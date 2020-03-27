import classNames from "classnames";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ROUTES from "../../../constants/routes";
import { COLLECTION_ICON, HOME_ICON, MENU_ICON, QUOTE_L_ICON, USER_ICON } from "../../constants/icons";

import styles from "../styles/view.scss";


const Menu = ({ history, isOpen, toggleMenu }) => {
    const navigateTo = location => {
        history.push(location);
        toggleMenu();
    };

    const menuClassName = classNames({
        [styles.menu]: true,
        [styles.closed]: !isOpen,
    });

    return (
        <section className={menuClassName}>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.HOME)}>
                <FontAwesomeIcon icon={HOME_ICON} size="lg" />
            </div>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.QUOTES)}>
                <FontAwesomeIcon icon={QUOTE_L_ICON} size="lg" />
            </div>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.COLLECTIONS)}>
                <FontAwesomeIcon icon={COLLECTION_ICON} size="lg" />
            </div>
            <div className={styles.card} onClick={() => navigateTo(ROUTES.LOGIN)}>
                <FontAwesomeIcon icon={USER_ICON} size="lg" />
            </div>
        </section>
    );
};

const View = ({
    children,
    headerButtons = [],
}) => {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const history = useHistory();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const displayHeaderButtons = Boolean(!isMenuOpen && headerButtons.length);

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.headerIcon} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={MENU_ICON} size="lg" />
                </div>
                <div>
                    Quotable
                </div>
                {displayHeaderButtons && (
                    <div className={styles.headerButtonContainer}>
                        {headerButtons.reverse().map(({ icon, onClick }, index) => (
                            <div key={index} className={styles.headerButton} onClick={onClick}>
                                <FontAwesomeIcon icon={icon} size='lg' />
                            </div>
                        ))}
                    </div>
                )}
            </header>
            <section className={styles.section}>
                {children}
            </section>
            <Menu
                history={history}
                isOpen={isMenuOpen}
                toggleMenu={toggleMenu}
            />
        </div>
    );
};

export default View;