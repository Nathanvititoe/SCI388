import React, { createRef, useEffect, useRef, useState, type RefObject } from 'react';
import './App.css';
import { IntroductionModal } from '../IntroductionModal/IntroductionModal';
import type { Molecule } from '../../../types/Molecule';
import { createMolecules } from '../../../Utils/createMolecules';
import WaterMolecule from '../WaterMolecule/WaterMolecule';
import { VictoryModal } from '../VictoryModal/VictoryModal';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [containerLeftOffset, setContainerLeftOffset] = useState(0);
  const [dotCount, setDotCount] = useState<number>(125);
  const rightMembraneBorderRef = useRef<HTMLDivElement | null>(null);
  const leftMembraneBorderRef = useRef<HTMLDivElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const moleculeRefs = useRef<Map<number, RefObject<HTMLDivElement | null>>>(new Map());
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // water counts
  const waterLeft = molecules.filter((m) => m.type === 'water' && m.side === 'left').length;
  const waterRight = molecules.filter((m) => m.type === 'water' && m.side === 'right').length;

  // solute counts
  const soluteLeft = molecules.filter((m) => m.type === 'solute' && m.side === 'left').length;
  const soluteRight = molecules.filter((m) => m.type === 'solute' && m.side === 'right').length;

  // win condition
  const isEmpty = waterLeft <= 0 && waterRight <= 0;
  const equilibrium  = waterLeft === soluteLeft && waterRight === soluteRight && !isEmpty;

  // victory celebration
  useEffect(() => {
    if (equilibrium  && confettiCanvasRef.current) {
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
  }, [equilibrium ]);
  
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

  // handle closing the intro modal
  const handleIntroClose = () => {
    setShowIntroModal(false);
    if (gameContainerRef.current) {
      const { width, height, left } = gameContainerRef.current.getBoundingClientRect();
      const dotSpacing = 10;
      setContainerLeftOffset(left);
      setDotCount(Math.floor(height / dotSpacing));
      moleculeRefs.current.clear();
      const moleculesCreated = createMolecules(width, height);
      setMolecules(moleculesCreated);
    }
  };

  // handle dragging and sides calc
  const handleStop = (id: number, newX: number, newY: number) => {
    const rightMembraneBorderRect = rightMembraneBorderRef.current?.getBoundingClientRect();
    const leftMembraneBorderRect = leftMembraneBorderRef.current?.getBoundingClientRect();

    const containerRect = gameContainerRef.current?.getBoundingClientRect();
    if (!rightMembraneBorderRect || !leftMembraneBorderRect || !containerRect) return;

    const mol = molecules.find((m) => m.id === id);
    if (!mol) return;

    const isLeft = newX < leftMembraneBorderRect.left;
    const isRight = newX > rightMembraneBorderRect.right;
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
      <div className="membrane-container">
        <div className="membrane-line left" ref={leftMembraneBorderRef} />
        <div className="membrane-dots">
          {Array.from({ length: dotCount }).map((_, i) => (
            <div key={i} className="membrane-dot" />
          ))}
        </div>
        <div className="membrane-line right" ref={rightMembraneBorderRef} />
      </div>
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
      {equilibrium  && (
        <>
          <canvas ref={confettiCanvasRef} className="confetti-canvas" />
          <VictoryModal onClose={handleIntroClose} />
        </>
      )}
    </div>
  );
};

export default App;
