import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Collection } from 'firestorter';

import CardDocument from 'modules/Card/data/card.doc';
import ListDocument from 'documents/list.doc';
import Input from 'components/shared/Input';
import { useKeySubmit } from 'hooks/use-key-submit';
import ClickOutside from './ClickOutside';
import { emitter } from 'libs/emitter';
import { useAppToast } from 'hooks/use-app-toast';

interface CardAdderProps {
  cards: Collection<CardDocument>;
  limit: number;
  list: ListDocument;
}

const CardAdder = ({ cards, limit, list }: CardAdderProps) => {
  const toast = useAppToast();
  const [newText, setNewText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleCardComposer = () => setIsOpen(!isOpen);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewText(event.target.value);

  const createCard = async () => {
    if (newText === '') return;

    //current size plus 1
    const amount = cards.docs.length + 1;
    const hasLimit = limit !== 0;
    const greaterThanLimit = amount > limit;

    if (hasLimit && greaterThanLimit) {
      toast({ title: 'Cards limit reached!', id: list.id });
    }

    const index = (await cards.ref.get()).size;
    const createdCard = await cards.add({
      text: newText,
      color: '#a0aec0',
      date: '',
      index,
      createdAt: Date.now(),
      listBefore: list.ref,
      title: newText,
    });

    toggleCardComposer();
    setNewText('');

    emitter.emit('ADD_CARD', {
      title: newText,
      listId: list.id,
      cardId: createdCard.id,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createCard();
  };

  const handleKeyDown = useKeySubmit(createCard, toggleCardComposer);

  return isOpen ? (
    <ClickOutside handleClickOutside={toggleCardComposer}>
      <form onSubmit={handleSubmit} className='m-2'>
        <Input
          autoFocus
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={newText}
          placeholder='Add a new card...'
          spellCheck={false}
          onBlur={toggleCardComposer}
        />
      </form>
    </ClickOutside>
  ) : (
    <button
      onClick={toggleCardComposer}
      className='add-card-button h-10 w-10 flex justify-center self-center transition-all bg-pink-500 hover:bg-pink-600 text-2xl shadow-lg rounded-lg cursor-pointer text-white opacity-0 mt-2'
    >
      +
    </button>
  );
};

export default observer(CardAdder);
