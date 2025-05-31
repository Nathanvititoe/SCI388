import type { ControlPosition } from 'react-draggable';
import type { Molecule } from '../types/Molecule';

export const createMolecules = (containerWidth: number, containerHeight: number): Molecule[] => {
  const waterTotal = 12;
  const soluteTotal = 12;
  const molSize = 20;
  const containerPadding = 50;
  const membraneWidth = 40;
  const bannerHeight = 80;

  // ensure theres atleast one per side
  const waterLeftCount = 1 + Math.floor(Math.random() * (waterTotal - 1));
  const soluteLeftCount = 1 + Math.floor(Math.random() * (soluteTotal - 1));
  const waterRightCount = waterTotal - waterLeftCount;
  const soluteRightCount = soluteTotal - soluteLeftCount;

  const molecules: Molecule[] = [];
  let id = 0;

  // Usable horizontal range
  const halfWidth = containerWidth / 2;
  const leftXMin = containerPadding;
  const leftXMax = halfWidth - membraneWidth - molSize;
  const rightXMin = halfWidth + membraneWidth + molSize;
  const rightXMax = containerWidth - molSize - containerPadding;

  // Usable Vertical range
  const yMin = containerPadding;
  const yMax = containerHeight - molSize - containerPadding - bannerHeight;

  const randX = (min: number, max: number) => min + Math.random() * (max - min);
  const randY = () => yMin + Math.random() * (yMax - yMin);

  const make = (type: 'water' | 'solute', side: 'left' | 'right', position: ControlPosition): Molecule => ({
    id: id++,
    type,
    side,
    position,
  });

  // Place molecules
  for (let i = 0; i < waterLeftCount; i++) {
    molecules.push(make('water', 'left', { x: randX(leftXMin, leftXMax), y: randY() }));
  }
  for (let i = 0; i < waterRightCount; i++) {
    molecules.push(make('water', 'right', { x: randX(rightXMin, rightXMax), y: randY() }));
  }
  for (let i = 0; i < soluteLeftCount; i++) {
    molecules.push(make('solute', 'left', { x: randX(leftXMin, leftXMax), y: randY() }));
  }
  for (let i = 0; i < soluteRightCount; i++) {
    molecules.push(make('solute', 'right', { x: randX(rightXMin, rightXMax), y: randY() }));
  }

  return molecules;
};
