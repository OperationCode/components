import React, { ButtonHTMLAttributes, FC, ReactChild } from 'react';
import { testID } from '@types';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, testID {
  children: ReactChild;
  isDisabled?: boolean;
}

export const Button: FC<Props> = ({ isDisabled = false, ...props }: Props) => (
  <button disabled={isDisabled} {...props} />
);
