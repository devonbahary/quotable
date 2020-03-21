import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import LoadingIcon from "../../LoadingIcon";
import Modal from "../../Modal";
import { ARROW_CIRCLE_UP_ICON } from "../../../constants/icons";
import { uploadImageForTextDetection } from "../../../api";

import styles from "../../styles/camera-modal.scss";


const SelectedImage = ({ isUploading, selectedImage, onFileUploadSubmit }) => {
    const imgClassName = classNames({ [styles.uploading]: isUploading });
    return (
        <div className={styles.imgUpload}>
            <div className={styles.imgContainer}>
                <img className={imgClassName} src={URL.createObjectURL(selectedImage)} />
            </div>
            <div className={styles.uploadBtn} onClick={onFileUploadSubmit}>
                {isUploading ? <LoadingIcon /> : <FontAwesomeIcon icon={ARROW_CIRCLE_UP_ICON} size="lg" />}
            </div>
        </div>
    );
};

const PromptImage = ({ onFileUpload }) => (
    <div className={styles.imgPrompt}>
        <div className={styles.instruction}>
            Upload a quote from a picture.
        </div>
        <input type="file" accept="image/*" onChange={onFileUpload} />
    </div>
);

const CameraModal = ({ addQuote, isOpen, setIsCameraModalOpen }) => {
    if (!isOpen) return null;

    const [ selectedImage, setSelectedImage ] = useState('');
    const [ isUploading, setIsUploading ] = useState(false);

    const onFileUpload = event => {
        const fileList = event.target.files;
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].type.match(/^image\//)) {
                setSelectedImage(fileList[i]);
            }
        }
    };
    
    const onFileUploadSubmit = async () => {
        if (isUploading) return;

        const formData = new FormData();
        formData.append('image', selectedImage);

        setIsUploading(true);
        const text = await uploadImageForTextDetection(formData);
        addQuote(text.replace(/\n/g, ' '));
        setIsUploading(false);
        setIsCameraModalOpen(false);
    };

    return (
        <Modal>
            <div className={styles.cameraModal}>
                {selectedImage ? (
                    <SelectedImage
                        isUploading={isUploading}
                        onFileUploadSubmit={onFileUploadSubmit}
                        selectedImage={selectedImage}
                    />
                ) : (
                    <PromptImage onFileUpload={onFileUpload} />
                )}
            </div>
        </Modal>
    );
};

export default CameraModal;