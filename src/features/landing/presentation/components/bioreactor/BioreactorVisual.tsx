import { BioreactorMotor } from "./BioreactorMotor";
import { BioreactorCylinder } from "./BioreactorCylinder";
import { BioreactorChips } from "./BioreactorChips";

interface Props {
  rotX: number;
  rotY: number; 
}

const KEYFRAMES = `
  @keyframes waveScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes bubbleRise {
    0%   { transform: translateY(0);      opacity: 0.8; }
    80%  { opacity: 0.4; }
    100% { transform: translateY(-120px); opacity: 0; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }
  @keyframes chipFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes spinImpellerFlat {
    0%   { transform: rotateX(74deg) rotateZ(0deg); }
    100% { transform: rotateX(74deg) rotateZ(360deg); }
  }
  @keyframes floatBio {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes motorVibrate {
    0%, 100% { transform: translateX(0px)    translateY(0px); }
    25%       { transform: translateX(-0.8px) translateY(-0.5px); }
    75%       { transform: translateX(0.8px)  translateY(0.5px); }
  }
  @keyframes vortexSpin {
    0%   { transform: translate(-50%,-50%) rotate(0deg); }
    100% { transform: translate(-50%,-50%) rotate(360deg); }
  }
  @keyframes impellerPulse {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.9; }
    100% { transform: translate(-50%,-50%) scale(3);   opacity: 0; }
  }
  @keyframes dropSlide {
    0%   { top: 4%;  height: 0px;  opacity: 0; }
    6%   { opacity: 0.45; height: 10px; }
    88%  { opacity: 0.2; }
    100% { top: 90%; height: 14px; opacity: 0; }
  }
  @keyframes scanLine {
    0%   { top: -2%;  opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 0.6; }
    100% { top: 102%; opacity: 0; }
  }
`;

export const BioreactorVisual = ({ rotX, rotY }: Props) => (
  <>
    <style>{KEYFRAMES}</style>
    <div
      className="relative w-[370px] h-[620px] select-none"
      style={{
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: "transform 0.12s ease-out",
        transformStyle: "preserve-3d",
        animation: "floatBio 5s ease-in-out infinite",
      }}
    >
      <div className="absolute inset-0" style={{ scale: "1.05", transformOrigin: "50% 44%" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-48 h-48 rounded-full blur-3xl"
            style={{ background: "rgba(234,179,8,0.08)", animation: "glowPulse 4s ease-in-out infinite" }}
          />
        </div>

        <BioreactorMotor />

        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-[10px] border border-white/20"
          style={{
            top: 94,
            width: 176,
            height: 20,
            background: "linear-gradient(180deg,rgba(240,240,240,0.95),rgba(200,200,200,0.85))",
            boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
          }}
        />

        <BioreactorCylinder />

        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-[8px] border border-white/15"
          style={{
            top: 382,
            width: 180,
            height: 16,
            background: "linear-gradient(180deg,rgba(210,210,210,0.9),rgba(180,180,180,0.8))",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-[6px]"
          style={{ top: 396, width: 190, height: 10, background: "rgba(160,160,160,0.7)" }}
        />

        <BioreactorChips />
      </div>
    </div>
  </>
);
