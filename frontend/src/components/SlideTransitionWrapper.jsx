import React, { useState, useEffect, } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const SlideTransitionWrapper = ({ keyProp, children }) => {
  const [inProp, setInProp] = useState(false);
  const [style, setStyle] = useState({
    opacity: 0,
    transition: 'none' // Start with no transition to avoid initial animation
  });

  useEffect(() => {
    let timeoutId;
    // Reset to initial state without animation when keyProp is false
    if (!keyProp) {
      setStyle({
        opacity: 0,
        transition: 'none'
      });
      setInProp(false); // Ensure no transition state is active
      return; // Skip setting timeout
    }
    // Trigger transitions when keyProp is true
    if (keyProp) {
      // First, apply the transition to move element out (if it's currently visible)
      setStyle(prev => ({
        ...prev,
        opacity: 0,
        transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out'
      }));

      // Then set up the transition to move element in
      timeoutId = setTimeout(() => {
        setInProp(true); // Trigger CSSTransition inProp to true
        setStyle({
          opacity: 1,
          transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out'
        });
      }, 300); // Wait for the out transition to complete
    }

    return () => clearTimeout(timeoutId);
  }, [keyProp]); // Only re-run the effect if keyProp changes
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={keyProp ? 'key_true' : 'key_false'} // Use dynamic keys to force re-render
        in={inProp}
        timeout={300}
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
      >
        <div style={style}>
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default SlideTransitionWrapper;
