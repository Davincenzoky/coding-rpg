import React, { useRef, useEffect, useState } from 'react';
import { Text } from 'react-native';

export default function AnimatedNumber({ value, duration = 1000, style }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  const startVal = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    startVal.current = 0;
    startTime.current = null;

    function tick(timestamp) {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return <Text style={style}>{display}</Text>;
}
