import { observer } from 'mobx-react-lite';
import { MdDoneAll } from 'react-icons/md';
import cn from 'classnames';

import Badge from '../shared/Badge';

interface BadgeTaskProgressProps {
  total: number;
  checked: number;
  className?: string;
}

const BadgeTaskProgress = ({
  total,
  checked,
  className,
}: BadgeTaskProgressProps) => {
  if (total === 0) {
    return null;
  }

  const bgColor =
    checked === total ? 'bg-green-500' : 'bg-gray-500  opacity-75';

  return (
    <Badge className={cn('max-w-full', bgColor, className)}>
      <MdDoneAll className='badge-icon' />
      &nbsp;
      {checked}/{total}
    </Badge>
  );
};

export default observer(BadgeTaskProgress);
