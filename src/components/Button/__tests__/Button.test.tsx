import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../';

describe('Button', () => {
  const testId = 'Test Button';

  const testProps = {
    children: <>Hello There</>,
    'data-testid': testId,
  };

  it('fires passed method when clicked', () => {
    const clickMock = jest.fn();

    const { queryByTestId } = render(<Button {...testProps} onClick={clickMock} />);
    const TheButton = queryByTestId(testId) as HTMLElement;

    expect(clickMock).not.toHaveBeenCalled();

    userEvent.click(TheButton);

    expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
