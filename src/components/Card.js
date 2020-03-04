import uuid from "uuid";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./styles/card.scss";


const Card = ({ content, toolBarButtons = [] }) => (
    <li className={styles.card}>
        {content}
        {Boolean(toolBarButtons.length) && (
            <div className={styles.toolBar}>
                {toolBarButtons.map(({ icon, onClick }) => (
                    <div key={uuid()} className={styles.icon} onClick={onClick}>
                        <FontAwesomeIcon icon={icon} />
                    </div>
                ))}
            </div>
        )}
    </li>
);

export default Card;