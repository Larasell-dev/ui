import { useState } from 'react';
import { fn } from 'storybook/test';
import preview from '../../../.storybook/preview.tsx';
import { Pagination, type PaginationProps } from './pagination.tsx';

const meta = preview.meta({
  title: 'Molecules/Pagination',
  component: Pagination,
  args: {
    page: 1,
    pageSize: 25,
    total: 240,
    onPaginationChange: fn(),
  },
  parameters: {
    layout: 'padded',
  },
});

export const FirstPage = meta.story({});

export const MiddlePage = meta.story({
  args: { page: 5 },
});

export const LastPage = meta.story({
  args: { page: 10 },
});

export const SinglePage = meta.story({
  args: { total: 12 },
});

export const Empty = meta.story({
  args: { total: 0 },
});

export const Disabled = meta.story({
  args: { page: 5, disabled: true },
});

export const CustomPageSizes = meta.story({
  args: { pageSize: 20, pageSizeOptions: [20, 40, 80] },
});

function Controlled(args: PaginationProps) {
  const [state, setState] = useState({
    page: args.page,
    pageSize: args.pageSize,
  });

  return (
    <Pagination
      {...args}
      {...state}
      onPaginationChange={(change) => {
        args.onPaginationChange(change);
        setState(change);
      }}
    />
  );
}

export const Interactive = meta.story({
  render: (args) => <Controlled {...args} />,
});
