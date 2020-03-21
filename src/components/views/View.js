import classNames from "classnames";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ROUTES from "../../../constants/routes";
import { COLLECTION_ICON, HOME_ICON, MENU_ICON, QUOTE_L_ICON, USER_ICON } from "../../constants/icons";

import styles from "../styles/view.scss";


const Menu = ({ history, isOpen, routeClassName, toggleMenu }) => {
    const navigateTo = location => {
        history.push(location);
        toggleMenu();
    };

    const menuClassName = classNames(
        routeClassName,
        {
            [styles.menu]: true,
            [styles.closed]: !isOpen,
        },
    );

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
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const { pathname } = location;
    const routeClassName = classNames({
        [styles.home]: pathname === '/',
        [styles.quotes]: pathname === '/quotes',
        [styles.collections]: pathname.includes('/collections'),
        [styles.login]: pathname === '/login',
    });
    const headerIconClassName = classNames(
        routeClassName,
        {
            [styles.headerIcon]: true,
            [styles.active]: isMenuOpen,
        },
    );

    const displayHeaderButtons = Boolean(!isMenuOpen && headerButtons.length);

    return (
        <div>
            <header className={styles.header}>
                <div className={headerIconClassName} onClick={toggleMenu}>
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
                routeClassName={routeClassName}
                toggleMenu={toggleMenu}
            />
        </div>
    );
};

export default View;