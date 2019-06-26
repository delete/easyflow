import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react';

import CardDocument from '../../documents/card.doc';
import CardModal from '../CardModal/CardModal';
import CardBadges from '../CardBadges/CardBadges';
import { findCheckboxes } from '../utils';
import formatMarkdown from './formatMarkdown';
import './Card.scss';

interface CardProps {
  card: CardDocument;
  isDraggingOver: boolean;
  index: number;
}

interface State {
  isModalOpen: boolean;
}

export default observer(
  class Card extends Component<CardProps, State> {
    constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
      };
    }

    toggleCardEditor = () => {
      this.setState({ isModalOpen: !this.state.isModalOpen });
    };

    handleClick = event => {
      const { tagName, checked, id } = event.target;
      if (tagName.toLowerCase() === 'input') {
        // The id is a string that describes which number in the order of checkboxes this particular checkbox has
        this.toggleCheckbox(checked, parseInt(id, 10));
      } else if (tagName.toLowerCase() !== 'a') {
        this.toggleCardEditor(event);
      }
    };

    handleKeyDown = event => {
      // Only open card on enter since spacebar is used by react-beautiful-dnd for keyboard dragging
      if (event.keyCode === 13 && event.target.tagName.toLowerCase() !== 'a') {
        event.preventDefault();
        this.toggleCardEditor();
      }
    };

    // identify the clicked checkbox by its index and give it a new checked attribute
    toggleCheckbox = (checked, i) => {
      const { card } = this.props;

      let j = 0;
      const newText = card.data.text.replace(/\[(\s|x)\]/g, match => {
        let newString;
        if (i === j) {
          newString = checked ? '[x]' : '[ ]';
        } else {
          newString = match;
        }
        j += 1;
        return newString;
      });

      card.ref.update({ text: newText });
    };

    render() {
      const { card, index, isDraggingOver } = this.props;

      const { isModalOpen } = this.state;
      const checkboxes = findCheckboxes(card.data.text);

      return (
        <>
          <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
              <>
                {/* eslint-disable */}
                <div
                  className={`card-title ${
                    snapshot.isDragging ? 'card-title--drag' : ''
                  }`}
                  ref={ref => {
                    provided.innerRef(ref);
                    this.ref = ref;
                  }}
                  {...provided.draggableProps} // uid: PropTypes.string.isRequired,
                  {...provided.dragHandleProps}
                  onClick={event => {
                    provided.dragHandleProps.onClick(event);
                    this.handleClick(event);
                  }}
                  onKeyDown={event => {
                    provided.dragHandleProps.onKeyDown(event);
                    this.handleKeyDown(event);
                  }}
                  style={{
                    ...provided.draggableProps.style,
                    background: card.data.color,
                  }}
                >
                  <div
                    className='card-title-html'
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(card.data.text),
                    }}
                  />

                  {(card.data.assignee ||
                    card.data.date ||
                    card.data.tags ||
                    checkboxes.total > 0) &&
                    'badges' && (
                      <CardBadges
                        date={
                          card.data.date
                            ? new Date(card.data.date.seconds * 1000)
                            : ''
                        }
                        checkboxes={checkboxes}
                        card={card}
                      />
                    )}
                </div>
                {/* Remove placeholder when not dragging over to reduce snapping */}
                {isDraggingOver && provided.placeholder}
              </>
            )}
          </Draggable>
          <CardModal
            isOpen={isModalOpen}
            cardElement={this.ref}
            card={card}
            toggleCardEditor={this.toggleCardEditor}
          />
        </>
      );
    }
  }
);
