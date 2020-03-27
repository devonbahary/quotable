import uuid from "uuid";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import styles from "./styles/card.scss";


const Card = ({ content, toolBarButtons = [] }) => (
    <li className={styles.card}>
        {content}
        {Boolean(toolBarButtons.length) && (
            <div className={styles.toolBar}>
                {toolBarButtons.map(({ icon, onClick, shouldRotate }) => {
                    const className = classNames(styles.icon, { [styles.rotate]: shouldRotate });
                    return (
                        <div key={uuid()} className={className} onClick={onClick}>
                            <FontAwesomeIcon icon={icon} />
                        </div>
                    );
                })}
            </div>
        )}
    </li>
);

export default Card;