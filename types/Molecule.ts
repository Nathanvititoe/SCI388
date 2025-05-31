import type { ControlPosition } from 'react-draggable';

export type Molecule = {
  id: number;
  type: 'water' | 'solute';
  side: 'left' | 'right';
  position: ControlPosition;
};
