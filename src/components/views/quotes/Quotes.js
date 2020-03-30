import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { inject, observer } from "mobx-react";

import AuthorModel from "../../../models/AuthorModel";
import CollectionModel from "../../../models/CollectionModel";
import QuoteModel from "../../../models/QuoteModel";

import { Author } from "../Authors";
import CameraModal from "./CameraModal";
import { Collection } from "../../views/Collections";
import CRUD from "../CRUD";
import Modal from "../../Modal";
import Quote from "../../Quote";
import SingleMessageView from "../../SingleMessageView";
import View from "../View";

import { ADD_ICON, CAMERA_ICON, CLOSE_ICON } from "../../../constants/icons";


import styles from "../../styles/quotes.scss";


const RelationalItemSelectionModal = ({
    authors,
    authorSelectionModalQuote,
    collections,
    collectionSelectionModalQuote,
    onChangeAuthor,
    onChangeCollection,
}) => {
    const quoteForSelection = authorSelectionModalQuote || collectionSelectionModalQuote;

    if (!quoteForSelection) return null;

    let instructionalText, noRelationalItemDummy, onClickItem, RelationalItemComponent, relationalItems;
    if (authorSelectionModalQuote) {
        instructionalText = 'Select an author for the quote';
        noRelationalItemDummy = new AuthorModel({
            id: null, // important
            name: 'no author',
        });
        onClickItem = onChangeAuthor;
        RelationalItemComponent = Author;
        relationalItems = authors;
    } else if (collectionSelectionModalQuote) {
        instructionalText = 'Select a collection for the quote';
        noRelationalItemDummy = new CollectionModel({
            id: null, // important
            title: 'no collection',
        });
        RelationalItemComponent = Collection;
        onClickItem = onChangeCollection;
        relationalItems = collections;
    }

    return (
        <Modal>
            <div className={styles.instruction}>
                {instructionalText}
            </div>
            <ul>
                <RelationalItemComponent item={noRelationalItemDummy} onClickItem={onClickItem} />
                {relationalItems.map(i => (
                    <RelationalItemComponent key={i.id} item={i} onClickItem={onClickItem} />
                ))}
            </ul>
        </Modal>
    );
};

const Quotes = observer(({ store }) => {
    const { authors, collections, quotes } = store;

    const { id: queriedCollectionId } = useParams();

    let collection;
    if (queriedCollectionId) collection = store.collections.find(c => c.id === parseInt(queriedCollectionId));
    const collectionId = collection ? collection.id : null;

    const [ pendingAddQuote, setPendingAddQuote ] = useState(null);
    const [ quoteIdEditing, setQuoteIdEditing ] = useState(null);

    const [ authorSelectionModalQuote, setAuthorSelectionModalQuote ] = useState(null);
    const [ collectionSelectionModalQuote, setCollectionSelectionModalQuote ] = useState(null);
    const [ isCameraModalOpen, setIsCameraModalOpen ] = useState(false);

    const addQuote = (text = '') => {
        setQuoteIdEditing(null);

        const newQuote = new QuoteModel({ text });
        setPendingAddQuote(newQuote);
    };

    const openCameraModal = () => setIsCameraModalOpen(true);

    const onChangeAuthor = async author => {
        setAuthorSelectionModalQuote(null);
        await authorSelectionModalQuote.updateAuthorId(author.id);
    };

    const onChangeCollection = async collection => {
        setCollectionSelectionModalQuote(null);
        await collectionSelectionModalQuote.updateCollectionId(collection.id);
    };

    const closeModal = () => {
        setCollectionSelectionModalQuote(null);
        setIsCameraModalOpen(false);
    };

    const onLeaveNewQuote = async () => {
        if (pendingAddQuote.text) await store.addQuote(pendingAddQuote, collectionId);
        setPendingAddQuote(null);
    };

    const onLeaveQuote = async quote => {
        setQuoteIdEditing(null);
        if (!quote.text) await store.removeQuote(quote);
    };

    if (!collection && queriedCollectionId) {
        return (
            <View>
                <SingleMessageView message={`Couldn't find a collection with id ${queriedCollectionId}`} />
            </View>
        );
    }

    const headerButtons = [];
    if (collectionSelectionModalQuote || isCameraModalOpen) {
        headerButtons.push({
            icon: CLOSE_ICON,
            onClick: closeModal,
        });
    } else {
        const addQuoteButtons = [{
            icon: CAMERA_ICON,
            onClick: openCameraModal,
        }, {
            icon: ADD_ICON,
            onClick: () => addQuote(),
        }];
        headerButtons.push(...addQuoteButtons);
    }

    const sortedQuotes = quotes
        .slice() // observable array warning
        .filter(q => collectionId ? q.collectionId === collectionId : q)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const noQuotesMessage = collection ? `No quotes found for collection "${collection.title}"` : 'No quotes found';

    return (
        <CRUD
            headerButtons={headerButtons}
            ItemComponent={Quote}
            itemIdEditing={quoteIdEditing}
            items={sortedQuotes}
            noItemsMessage={noQuotesMessage}
            onLeaveItem={onLeaveQuote}
            onLeaveNewItem={onLeaveNewQuote}
            pendingAddItem={pendingAddQuote}
            setAuthorSelectionModalQuote={setAuthorSelectionModalQuote}
            setCollectionSelectionModalQuote={setCollectionSelectionModalQuote}
            setItemIdEditing={setQuoteIdEditing}
        >
            <CameraModal
                addQuote={addQuote}
                isOpen={isCameraModalOpen}
                setIsCameraModalOpen={setIsCameraModalOpen}
            />
            <RelationalItemSelectionModal
                authors={authors}
                authorSelectionModalQuote={authorSelectionModalQuote}
                collections={collections}
                collectionSelectionModalQuote={collectionSelectionModalQuote}
                onChangeAuthor={onChangeAuthor}
                onChangeCollection={onChangeCollection}
            />
        </CRUD>
    );
});

export default inject('store')(Quotes);