import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTransition, animated, useSpring, config } from 'react-spring';
import styled from 'styled-components';

import { useFirstRender } from 'hooks/use-first-render';
import Avatar from 'components/shared/Avatar';
import { User } from 'store/users';

interface AssigneeProps {
  assignees: User[];
  avatarColor: string;
}

const Assignee = ({ assignees, avatarColor }: AssigneeProps) => {
  const transitions = useTransition(assignees, item => item.id, {
    from: { transform: 'translate3d(40px, 0, 0)', opacity: 0 },
    enter: { transform: 'translate3d(0, 0px, 0)', opacity: 1 },
    leave: { transform: 'translate3d(40px, 0, 0)', opacity: 0 },
  });

  const [spring, setSpring] = useSpring(() => ({
    marginLeft: '0px',
    immediate: true,
    config: config.stiff,
  }));

  const initAnimation = () =>
    setTimeout(() => {
      setSpring({ marginLeft: '-8px' });
    }, 1000);

  useFirstRender(initAnimation);

  return (
    <StyledAssignes>
      {transitions.map(
        ({ item, key, props: tprops }, index) =>
          item && (
            <animated.div
              key={key}
              style={{
                ...tprops,
                ...(index !== 0 && { marginLeft: spring.marginLeft }),
              }}
              className='assignee mr-1'
            >
              <Avatar
                src={item.photo}
                username={item.username}
                className='border'
                size='small'
                style={{ borderColor: avatarColor }}
              />
            </animated.div>
          )
      )}
    </StyledAssignes>
  );
};

export default observer(Assignee);

const StyledAssignes = styled.div`
  display: flex;

  & .assignee {
    will-change: margin;
    transition: margin 0.3s;
  }

  &:hover .assignee:not(:first-child) {
    margin-left: 0 !important;
  }
`;
