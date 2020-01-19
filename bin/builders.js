/* eslint-disable max-len */
/* This file contains the functions which generate the output of each file */
module.exports = {
  // Output generated for component's definition file
  buildSource: (componentName) =>
    `import React from 'react';
import { testID } from '@types';

// Change to the correct HTML Attribute type (simply React.HTMLElementAttributes if needed)
export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, testID {
  children: string | number | React.ReactElement;
}

export const ${componentName}: React.SFC<Props> = ({ ...props }: Props) => {
  return <button {...props} />;
};
`,

  buildSourceIndex: (componentName) =>
    `export { ${componentName} } from './${componentName}';
`,

  // Output generated for component's story file
  buildStory: (componentName) =>
    `import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text } from '@storybook/addon-knobs';

import ${componentName} from '../${componentName}';

storiesOf('${componentName}', module)
  .addDecorator(withKnobs)
  .add(
    'default',
    withInfo()(() => (
      <${componentName}>
        {text('children', 'string or .node')}
      </${componentName}>
    )),
  );
`,

  // Output generated for component's test file
  buildTest: (componentName) =>
    `import React from 'react';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { ${componentName} } from '../';

describe('${componentName}', () => {
  const requiredProps = {
    children: 'Test',
  };

  it('renders', () => {
    const component = render(<${componentName} {...requiredProps} />);

    expect(component.container.firstChild).not.toBeNull();
  })
});
`,
};
