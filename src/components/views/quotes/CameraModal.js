import React, { useState } from "react";
import { inject } from "mobx-react";
import classNames from "classnames";

import LoadingIcon from "../../LoadingIcon";
import Modal from "../../Modal";
import { uploadImageForTextDetection } from "../../../api/googleCloudVision";

import styles from "../../styles/camera-modal.scss";
import QuoteModel from "../../../models/QuoteModel";


const SelectedImage = ({ isUploading, selectedImage }) => {
    const imgClassName = classNames({ [styles.uploading]: isUploading });
    return (
        <div className={styles.imgUpload}>
            <div className={styles.imgContainer}>
                <img className={imgClassName} src={URL.createObjectURL(selectedImage)} />
            </div>
            <div className={styles.uploadBtn}>
                <LoadingIcon />
            </div>
        </div>
    );
};

const PromptImage = ({ isUploadImageError, onFileUpload }) => (
    <div className={styles.imgPrompt}>
        <div className={styles.instruction}>
            {isUploadImageError ? 'Couldn\'t recognize text from the image you uploaded.' : 'Upload a quote from a picture.'}
        </div>
        <input type="file" accept="image/*" onChange={onFileUpload} />
    </div>
);

const CameraModal = ({ isOpen, setIsCameraModalOpen, store }) => {
    if (!isOpen) return null;

    const [ isUploading, setIsUploading ] = useState(false);
    const [ isUploadImageError, setIsUploadImageError ] = useState(false);
    const [ selectedImage, setSelectedImage ] = useState('');

    const onFileUpload = async event => {
        setIsUploadImageError(false);

        const fileList = event.target.files;
        let selectedImage;
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].type.match(/^image\//)) {
                selectedImage = fileList[i];
                setSelectedImage(selectedImage);
            }
        }

        if (!selectedImage) return;

        const formData = new FormData();
        formData.append('image', selectedImage);

        setIsUploading(true);
        const text = await uploadImageForTextDetection(formData);

        if (text) {
            setIsCameraModalOpen(false);
            const quote = new QuoteModel({ text });
            setIsUploading(false);
            await store.addQuote(quote);
        } else {
            setIsUploadImageError(true);
            setSelectedImage('');
        }
    };

    return (
        <Modal>
            <div className={styles.cameraModal}>
                {selectedImage ? (
                    <SelectedImage isUploading={isUploading} selectedImage={selectedImage} />
                ) : (
                    <PromptImage isUploadImageError={isUploadImageError} onFileUpload={onFileUpload} />
                )}
            </div>
        </Modal>
    );
};

export default inject('store')(CameraModal);