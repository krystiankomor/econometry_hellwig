import React, { ReactNode } from 'react';
import Navigation from './navigation/Navigation';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return (
    <div className="p-component">
      <div className="p-grid p-nogutter" style={{ height: '100vh' }}>
        <div className="p-col-fixed p-pr-3" style={{ width: '250px' }}>
          <Navigation />
        </div>
        <div
          className="p-col p-pr-3"
          style={{
            overflowY: 'scroll',
            height: '100vh',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
