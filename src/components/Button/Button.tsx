import React from 'react';
import { testID } from '@types';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, testID {
  children: string | number | React.ReactElement;
  isDisabled?: boolean;
  // analyticsObject?: any;
  // isFullWidth?: boolean;
}

export const Button: React.FunctionComponent<Props> = ({
  isDisabled = false,
  // analyticsObject = {},
  // isFullWidth = false,
  ...props
}: Props) => <button disabled={isDisabled} {...props} />;
