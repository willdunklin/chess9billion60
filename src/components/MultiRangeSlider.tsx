import React, { useCallback, useEffect, useState } from "react";
import "../css/multiRangeSlider.css";

interface SliderProps {
  min: number;
  max: number;
  startLeft: number;
  startRight: number;
  onChange: any;
}

export const MultiRangeSlider = (props: SliderProps) => {
  const { min, max, startLeft, startRight, onChange } = props;
  const [minVal, setMinVal] = useState(startLeft);
  const [maxVal, setMaxVal] = useState(startRight);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(100);
  const MIN_SPACE = 5;

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    setLeft(minPercent);
    setWidth(maxPercent - minPercent);
  }, [minVal, maxVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    setWidth(maxPercent - minPercent);
  }, [minVal, maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange(minVal, maxVal);
  }, [minVal, maxVal, onChange]);

  return (
    <div className="container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - MIN_SPACE);
          setMinVal(value);
        }}
        className="thumb thumb--left"
        style={{ zIndex: 5 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + MIN_SPACE);
          setMaxVal(value);
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div style={{width: `${width}%`, left: `${left}%`}} className="slider__range" />
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};
