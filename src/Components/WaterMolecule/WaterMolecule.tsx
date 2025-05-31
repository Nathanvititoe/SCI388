import React, { type FC, type RefObject } from 'react';
import Draggable, { type ControlPosition } from 'react-draggable';

interface WaterMoleculeProps {
  id: number;
  position: ControlPosition;
  nodeRef: RefObject<HTMLDivElement>;
  onStop: (id: number, x: number, y: number) => void;
  containerLeftOffset: number;
  container: HTMLDivElement | null;
}

const WaterMolecule: FC<WaterMoleculeProps> = ({ id, position, nodeRef, onStop, containerLeftOffset, container }) => {
  let bounds;
  if (container) {
    const containerRect = container.getBoundingClientRect();

    bounds = {
      left: 0,
      top: 0,
      right: containerRect.width,
      bottom: containerRect.height,
    };
  }
  return (
    <Draggable
      nodeRef={nodeRef as RefObject<HTMLElement>}
      defaultPosition={{ x: position.x, y: position.y }}
      onStop={(_e, data) => {
        const absX = data.x + containerLeftOffset;
        const absY = data.y;
        onStop(id, absX, absY); // Pass final position to parent
      }}
      bounds={bounds}
    >
      <div ref={nodeRef} className="molecule water-mol">
        💧
      </div>
    </Draggable>
  );
};

export default React.memo(WaterMolecule);
