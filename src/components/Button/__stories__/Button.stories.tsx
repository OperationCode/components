import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button, Props } from '../Button';

export default {
  title: 'Button',
  component: Button,
  excludeStories: ['requiredProps'],
};

export const requiredProps = {
  children: 'Test',
  'data-testid': 'test-button',
};

export const WithRequiredProps = (props?: Partial<Props>) => (
  <Button {...requiredProps} {...props} />
);

export const Primary = (props?: Partial<Props>) => (
  <Button onClick={action('clicked')} {...requiredProps} {...props} />
);

export const Disabled = (props?: Partial<Props>) => (
  <Button onClick={action('clicked')} isDisabled={true} {...requiredProps} {...props} />
);
