import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "../../Modal";
import { ARROW_CIRCLE_UP } from "../../../constants/icons";

import styles from "../../styles/camera-modal.scss";
import {uploadImageForTextDetection} from "../../../api";


const CameraModal = ({ isOpen }) => {
    if (!isOpen) return null;

    const [ uploadedImage, setUploadedImage ] = useState('');

    const onFileUpload = event => {
        const fileList = event.target.files;
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].type.match(/^image\//)) {
                setUploadedImage(fileList[i]);
            }
        }
    };
    
    const onFileUploadSubmit = async () => {
        const formData = new FormData();
        formData.append('image', uploadedImage);

        const text = await uploadImageForTextDetection(formData);
        alert(text);
    };

    return (
        <Modal>
            <div className={styles.cameraModal}>
                {uploadedImage ? (
                    <div className={styles.imgUpload}>
                        <div className={styles.imgContainer}>
                            <img src={URL.createObjectURL(uploadedImage)} />
                        </div>
                        <div className={styles.uploadBtn} onClick={onFileUploadSubmit}>
                            <FontAwesomeIcon icon={ARROW_CIRCLE_UP} size="lg" />
                        </div>
                    </div>
                ) : (
                    <div className={styles.imgPrompt}>
                        <div className={styles.instruction}>
                            Upload a quote from a picture.
                        </div>
                        <input type="file" accept="image/*" onChange={onFileUpload} />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CameraModal;