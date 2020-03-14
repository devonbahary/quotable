import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { inject, observer } from "mobx-react";

import Collection from "../Collection";
import Modal from "../Modal";
import Quote from "../Quote";
import SingleMessageView from "../SingleMessageView";
import View from "./View";
import { ADD_ICON, CLOSE_ICON } from "../../constants/icons";

import CollectionModel from "../../models/Collection";
import QuoteModel from "../../models/Quote";

import styles from "../styles/quotes.scss";


const CollectionSelectionModal = ({
    collections,
    collectionSelectionModalQuote,
    onClickCollection,
}) => {
    if (!collectionSelectionModalQuote) return null;

    const noCollectionDummy = new CollectionModel({
        id: null, // important
        title: 'no collection',
    });

    return (
        <Modal>
            <div className={styles.instruction}>
                Select a collection for the quote.
            </div>
            <ul>
                <Collection collection={noCollectionDummy} onClickCollection={onClickCollection} />
                {collections.map(c => (
                    <Collection key={c.id} collection={c} onClickCollection={onClickCollection} />
                ))}
            </ul>
        </Modal>
    );
};

const QuoteList = ({
    collectionId,
    pendingAddQuote,
    quoteIdEditing,
    quotes,
    setCollectionSelectionModalQuote,
    setPendingAddQuote,
    setQuoteIdEditing,
    store,
}) => {
    const onLeaveNewQuote = async () => {
        if (pendingAddQuote.text) await store.addQuote(pendingAddQuote, collectionId);
        setPendingAddQuote(null);
    };

    const onLeaveQuote = async quote => {
        setQuoteIdEditing(null);
        if (!quote.text) await store.removeQuote(quote);
    };

    const filteredAndSortedQuotes = quotes
        .slice() // observable array warning
        .filter(q => collectionId ? q.collectionId === collectionId : q)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const displayNoResults = !filteredAndSortedQuotes.length && !pendingAddQuote;

    const collectionTitle = store.getCollectionTitleById(collectionId);

    return (
        <>
            {!displayNoResults ? (
                <ul>
                    {pendingAddQuote && (
                        <Quote
                            isEditing
                            onLeave={onLeaveNewQuote}
                            quote={pendingAddQuote}
                            shouldRenderToolBar
                        />
                    )}
                    {filteredAndSortedQuotes
                        .map(quote=> (
                            <Quote
                                key={quote.id}
                                isEditing={quoteIdEditing === quote.id}
                                onLeave={onLeaveQuote}
                                quote={quote}
                                setQuoteIdEditing={setQuoteIdEditing}
                                setCollectionSelectionModalQuote={setCollectionSelectionModalQuote}
                                shouldRenderToolBar
                                store={store}
                            />
                        ))}
                </ul>
            ) : (
                <SingleMessageView message={collectionId ? `No quotes found for collection "${collectionTitle}"` : `No quotes found`} />
            )}
        </>
    );
};

const Quotes = observer(({ store }) => {
    const { collections, quotes } = store;

    const { id } = useParams();

    let collection;
    if (id) collection = store.collections.find(c => c.id === parseInt(id));

    const [ pendingAddQuote, setPendingAddQuote ] = useState(null);
    const [ quoteIdEditing, setQuoteIdEditing ] = useState(null);
    const [ collectionSelectionModalQuote, setCollectionSelectionModalQuote ] = useState(null);

    const addQuote = () => {
        setQuoteIdEditing(null);

        const newQuote = new QuoteModel({ text: '' });
        setPendingAddQuote(newQuote);
    };

    const onChangeCollection = async collection => {
        await collectionSelectionModalQuote.updateCollectionId(collection.id);
        setCollectionSelectionModalQuote(null);
    };

    const closeCollectionSelectionModal = () => setCollectionSelectionModalQuote(null);

    let headerButtonIcon, onHeaderButtonClick;
    if (collectionSelectionModalQuote) {
        headerButtonIcon = CLOSE_ICON;
        onHeaderButtonClick = closeCollectionSelectionModal;
    } else {
        headerButtonIcon = ADD_ICON;
        onHeaderButtonClick = addQuote;
    }

    if (!collection && id) {
        return (
            <View>
                <SingleMessageView message={`Couldn't find a collection with id ${id}`} />
            </View>
        );
    }

    return (
        <View headerButtonIcon={headerButtonIcon} onHeaderButtonClick={onHeaderButtonClick}>
            <CollectionSelectionModal
                collections={collections}
                collectionSelectionModalQuote={collectionSelectionModalQuote}
                onClickCollection={onChangeCollection}
            />
            <QuoteList
                collectionId={collection ? collection.id : null}
                pendingAddQuote={pendingAddQuote}
                quoteIdEditing={quoteIdEditing}
                quotes={quotes}
                setCollectionSelectionModalQuote={setCollectionSelectionModalQuote}
                setPendingAddQuote={setPendingAddQuote}
                setQuoteIdEditing={setQuoteIdEditing}
                store={store}
            />
        </View>
    );
});

export default inject('store')(Quotes);