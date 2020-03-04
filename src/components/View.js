import classNames from "classnames";
import React, { useState } from "react";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ROUTES from "../../constants/routes";
import { COLLECTION_ICON, HOME_ICON, MENU_ICON, QUOTE_L_ICON, USER_ICON } from "../constants";

import styles from "./styles/view.scss";


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

const View = withRouter(({
    children,
    headerButtonIcon,
    onHeaderButtonClick,
    history,
    location,
}) => {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


    const { pathname } = location;
    const routeClassName = classNames({
        [styles.home]: pathname === '/',
        [styles.quotes]: pathname === '/quotes',
        [styles.collections]: pathname === '/collections',
        [styles.login]: pathname === '/login',
    });
    const headerIconClassName = classNames(
        routeClassName,
        {
            [styles.headerIcon]: true,
            [styles.active]: isMenuOpen,
        },
    );

    const displayHeaderButton = !isMenuOpen && onHeaderButtonClick;

    return (
        <div>
            <header className={styles.header}>
                <div className={headerIconClassName} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={MENU_ICON} size="lg" />
                </div>
                <div>
                    Quotable
                </div>
                {displayHeaderButton && (
                    <div className={styles.headerButton} onClick={onHeaderButtonClick}>
                        <FontAwesomeIcon icon={headerButtonIcon} size='lg' />
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
});

export default View;