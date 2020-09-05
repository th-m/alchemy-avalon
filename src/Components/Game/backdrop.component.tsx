import React, { useContext } from 'react'
import { GameContext } from '../../provider'
import '../../App.css';
import { characterSvgs } from '../../assets/imgs/new_characters_jsx';

const centerPoint = [160, 140];
const points = [[127, 82.4], [193.3, 82.4], [226.5, 139.9], [193.3, 197.4], [127, 197.4], [93.8, 139.9]];
const squarePoints = [[127, 82.4], [193.3, 82.4], [193.3, 139.9], [193.3, 197.4], [127, 197.4], [127, 139.9]];

export const BackDrop = () => {
    const ctx = useContext(GameContext);
    const character = ctx.state.character;
    const name = character?.characterName;
    return (
        <>
            <svg version="1.1" id="alchemy_background" x="0px" y="0px" viewBox="0 0 320 280">
                <g className={(ctx.state.setupStep < 4 ? '' : 'hideMe')}>
                    <g className={(ctx.state.setupStep >= 3 ? '' : 'rotateMe')}>
                        {points.map((x, i) => <line key={"l" + i} id={"l" + i} x1={centerPoint[0]} y1={centerPoint[1]} x2={x[0]} y2={x[1]} />)}
                    </g>
                    <g>
                        {points.map((x, i) => <circle key={"c" + i} id={"c" + i} r="66.5"
                            cx={(ctx.state.setupStep <= 1 ? centerPoint[0] : x[0])} cy={(ctx.state.setupStep <= 1 ? centerPoint[1] : x[1])}
                            stroke="none" fill={((i % 2 === 0) ? 'rgba(179, 255, 251, .5)' : 'rgba(255, 182, 208, .5)')} />)}
                    </g>
                </g>
                <defs>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{ stopColor: "#ea789b", stopOpacity: 0 }} />
                        <stop offset="100%" style={{ stopColor: "#2dcbe0", stopOpacity: 1 }} />
                    </radialGradient>
                    <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{ stopColor: "#ea789b", stopOpacity: 0 }} />
                        <stop offset="100%" style={{ stopColor: "#2dcbe0", stopOpacity: 0 }} />
                    </radialGradient>
                </defs>

                <g className={(ctx.state.setupStep >= 3 ? "hexShow" : 'hexHide')}>
                    <polygon className={(ctx.state.setupStep >= 4 ? "growSquare" : '')} points={points.map(x => x.join()).join(" ")}
                        fill={(ctx.state.setupStep >= 4 ? "url(#grad2)" : "url(#grad1)")} stroke={(ctx.state.setupStep >= 4 ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)")} >
                        <animate id="animation-to-check" repeatCount="1" fill="freeze" begin="indefinite" attributeName="points" dur="2000ms" to={squarePoints.map(x => x.join()).join(" ")} />
                    </polygon>
                </g>
            </svg>
            {name && characterSvgs[name]()}
        </>
    )
}