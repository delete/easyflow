import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import 'firebase/firestore';

import { useKeySubmit } from 'hooks/use-key-submit';
import BoardDocument from 'modules/Board/data/board.doc';
import Dialog from 'components/shared/Dialog';
import { Input } from 'components/shared';
import { useAppToast } from 'hooks/use-app-toast';

interface AddNewListModalProps {
  board: BoardDocument;
  isOpen?: boolean;
  toggleIsOpen: () => void;
}

const AddNewListModal = ({
  board,
  toggleIsOpen,
  isOpen,
}: AddNewListModalProps) => {
  const toast = useAppToast();
  const [value, setValue] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const save = async (newValue: string) => {
    if (!newValue) return;

    const index = board.lists.docs.length;

    setIsSubmit(true);

    return board.lists
      .add({
        title: newValue,
        index,
      })
      .then(() => {
        toast({ id: index, title: `A new list was created!` });
        setIsSubmit(false);
      });
  };

  const handleSubmit = async () => {
    await save(value);
    setValue('');
    toggleIsOpen();
  };

  const handleKeyDown = useKeySubmit(handleSubmit, () => {
    setValue('');
    toggleIsOpen();
  });

  return (
    <Dialog title='New list' isOpen={isOpen} onClose={toggleIsOpen}>
      <div className='m-4 sm:m-8 mt-0 sm:mt-0'>
        <Input
          placeholder='Type a name'
          autoFocus
          type={'text'}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          isDisabled={isSubmit}
          isLoading={isSubmit}
        />
      </div>
    </Dialog>
  );
};

export default observer(AddNewListModal);
