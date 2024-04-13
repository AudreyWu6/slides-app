import React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const SlideTransitionWrapper = ({ children, keyProp }) => (
  <SwitchTransition mode="out-in">
    <CSSTransition
      key={keyProp}
      addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
      classNames="fade"
    >
      {children}
    </CSSTransition>
  </SwitchTransition>
);

export default SlideTransitionWrapper;
