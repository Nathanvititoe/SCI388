import React, { createRef, useEffect, useRef, useState, type RefObject } from 'react';
import './App.css';
import { IntroductionModal } from '../IntroductionModal/IntroductionModal';
import type { Molecule } from '../../../types/Molecule';
import { createMolecules } from '../../../Utils/createMolecules';
import WaterMolecule from '../WaterMolecule/WaterMolecule';
import { VictoryModal } from '../VictoryModal/VictoryModal';
import confetti from 'canvas-confetti';
/**
 * TODO:
 * fix celebration
 * style membrane
 */
const App: React.FC = () => {
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const waterLeft = molecules.filter((m) => m.type === 'water' && m.side === 'left').length;
  const waterRight = molecules.filter((m) => m.type === 'water' && m.side === 'right').length;
  const isEmpty = waterLeft <= 0 && waterRight <= 0;
  const homeostasis = waterLeft === waterRight && !isEmpty;
  const [containerLeftOffset, setContainerLeftOffset] = useState(0);

  const membraneRef = useRef<HTMLDivElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const moleculeRefs = useRef<Map<number, RefObject<HTMLDivElement | null>>>(new Map());
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (homeostasis && confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });
      myConfetti({
        spread: 180,
        particleCount: 150,
        origin: { y: 0.5 },
      });
    }
  }, [homeostasis]);
  // ensure molecules and their refs are created
  useEffect(() => {
    if (!molecules.length) return;

    let changed = false;
    molecules.forEach((mol) => {
      if (!moleculeRefs.current.has(mol.id)) {
        moleculeRefs.current.set(mol.id, createRef<HTMLDivElement>());
        changed = true;
      }
    });

    if (changed) setMolecules([...molecules]); // force rerender
  }, [molecules]);

  // solute counts
  const soluteLeft = molecules.filter((m) => m.type === 'solute' && m.side === 'left').length;
  const soluteRight = molecules.filter((m) => m.type === 'solute' && m.side === 'right').length;

  // handle closing the intro modal
  const handleIntroClose = () => {
    setShowIntroModal(false);
    if (gameContainerRef.current) {
      const { width, height, left } = gameContainerRef.current.getBoundingClientRect();
      setContainerLeftOffset(left);
      moleculeRefs.current.clear();
      const moleculesCreated = createMolecules(width, height);
      setMolecules(moleculesCreated);
    }
  };

  // handle dragging and sides calc
  const handleStop = (id: number, newX: number, newY: number) => {
    const membraneRect = membraneRef.current?.getBoundingClientRect();
    const containerRect = gameContainerRef.current?.getBoundingClientRect();
    if (!membraneRect || !containerRect) return;

    const mol = molecules.find((m) => m.id === id);
    if (!mol) return;

    const isLeft = newX < membraneRect.left;
    const isRight = newX > membraneRect.right;
    const newSide = isLeft ? 'left' : isRight ? 'right' : mol.side;

    setMolecules((prev) =>
      prev.map((mol) => {
        if (mol.id !== id) return mol;
        if (mol.type !== 'water') return mol;

        return {
          ...mol,
          side: newSide,
          position: { x: newX - containerRect.left, y: newY - containerRect.top },
        };
      })
    );
  };

  return (
    <div className="game" ref={gameContainerRef}>
      {showIntroModal && <IntroductionModal onClose={handleIntroClose} />}
      <div className="membrane" ref={membraneRef} />
      {molecules.map((mol) => {
        if (mol.type === 'water') {
          const nodeRef = moleculeRefs.current.get(mol.id);
          if (!nodeRef) return null;
          return (
            <WaterMolecule
              key={mol.id}
              id={mol.id}
              position={mol.position}
              nodeRef={nodeRef as RefObject<HTMLDivElement>}
              onStop={handleStop}
              containerLeftOffset={containerLeftOffset ?? 0}
              container={gameContainerRef.current}
            />
          );
        } else {
          return (
            <div key={mol.id} className="molecule solute-mol" style={{ left: mol.position.x, top: mol.position.y }}>
              🧂
            </div>
          );
        }
      })}
      <div className="info">
        <div className="counts">
          <div className="left-count">
            <div className="left-water">💧 Water: {waterLeft}</div>
            <div className="left-solute">🧂 Solute: {soluteLeft}</div>
          </div>
          <div className="right-count">
            <div className="right-water"> 💧 Water: {waterRight}</div>
            <div className="right-solute">🧂 Solute: {soluteRight}</div>
          </div>
        </div>
      </div>
      {homeostasis && (
        <>
          <canvas ref={confettiCanvasRef} className="confetti-canvas" />
          <VictoryModal onClose={handleIntroClose} />
        </>
      )}
    </div>
  );
};

export default App;
