import React from 'react';
import { testId } from '@types';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, testId {
  children: string | number | React.ReactElement;
  isDisabled?: boolean;
  // analyticsObject?: any;
  // isFullWidth?: boolean;
}

export const Button = ({
  isDisabled = false,
  // analyticsObject = {},
  // isFullWidth = false,
  ...props
}: Props) => <button disabled={isDisabled} {...props} />;
