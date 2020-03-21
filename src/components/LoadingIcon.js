import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SPINNER_ICON } from "../constants/icons";

import styles from "./styles/loading-icon.scss";

const LoadingIcon = () => (
    <div className={styles.loadingIcon}>
        <FontAwesomeIcon icon={SPINNER_ICON} size="lg" />
    </div>
);

export default LoadingIcon;