import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as Button from '../__stories__/Button.stories';

describe('Button', () => {
  const testID = Button.requiredProps['data-testid'];

  it('renders', () => {
    const component = render(<Button.WithRequiredProps />);

    expect(component.queryByTestId(testID) as HTMLElement).toBeDefined();
  });

  it('fires passed method when clicked', () => {
    const clickMock = jest.fn();

    const component = render(<Button.Primary onClick={clickMock} />);

    const TheButton = component.queryByTestId(testID) as HTMLElement;

    expect(clickMock).not.toHaveBeenCalled();

    userEvent.click(TheButton);

    expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
