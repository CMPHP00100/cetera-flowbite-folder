"use client";

export default function RocketShip() {
  return (
    <>
        <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
            {/*<!-- Blue line trail being drawn -->*/}
            <path id="trail" d="M -50 100 L 0 100" stroke="#4A90E2" stroke-width="4" fill="none" stroke-linecap="round">
                <animate
                attributeName="d"
                values="M -50 100 L 0 100;
                        M -50 100 L 100 100;
                        M -50 100 L 200 100;
                        M -50 100 L 300 100;
                        M -50 100 L 400 100;
                        M -50 100 L 500 100;
                        M -50 100 L 600 100;
                        M -50 100 L 700 100;
                        M -50 100 L 800 100;
                        M -50 100 L 850 100"
                dur="4s"
                repeatCount="indefinite"/>
            </path>
            
            {/*<!-- Rocket Ship -->*/}
            <g id="rocket">
                <animateTransform
                attributeName="transform"
                type="translate"
                values="-150,0; 900,0"
                dur="4s"
                repeatCount="indefinite"/>
                
                {/*<!-- Rocket body -->*/}
                <g fill="#4A90E2">
                {/*<!-- Main body -->*/}
                <rect x="30" y="80" width="80" height="40" rx="5"/>
                
                {/*<!-- Nose cone -->*/}
                <polygon points="110,80 140,100 110,120"/>
                
                {/*<!-- Fins -->*/}
                <polygon points="30,80 20,70 30,90"/>
                <polygon points="30,110 20,130 30,120"/>
                
                {/*<!-- Engine nozzle -->*/}
                <rect x="20" y="90" width="10" height="20" rx="2"/>
                
                {/*<!-- Porthole -->*/}
                <circle cx="80" cy="100" r="8" fill="#4A90E2" opacity="0.7"/>
                <circle cx="80" cy="100" r="6" fill="#4A90E2" opacity="0.5"/>
                
                {/*<!-- Detail lines -->*/}
                <rect x="50" y="95" width="30" height="2" fill="#4A90E2" opacity="0.8"/>
                <rect x="50" y="103" width="30" height="2" fill="#4A90E2" opacity="0.8"/>
                
                {/*<!-- Wing struts -->*/}
                <rect x="35" y="85" width="15" height="2" fill="#4A90E2"/>
                <rect x="35" y="113" width="15" height="2" fill="#4A90E2"/>
                </g>
                
                {/*<!-- Rocket exhaust flames -->*/}
                <g opacity="0.8">
                {/*<!-- Main flame -->*/}
                <polygon points="20,95 5,100 20,105" fill="#FF6B35">
                    <animate
                    attributeName="points"
                    values="20,95 5,100 20,105;
                            20,95 0,100 20,105;
                            20,95 10,100 20,105;
                            20,95 5,100 20,105"
                    dur="0.2s"
                    repeatCount="indefinite"/>
                </polygon>
                
                {/*<!-- Side flames -->*/}
                <polygon points="20,92 8,98 20,98" fill="#FF8C42">
                    <animate
                    attributeName="points"
                    values="20,92 8,98 20,98;
                            20,92 3,98 20,98;
                            20,92 12,98 20,98;
                            20,92 8,98 20,98"
                    dur="0.15s"
                    repeatCount="indefinite"/>
                </polygon>
                
                <polygon points="20,108 8,102 20,102" fill="#FF8C42">
                    <animate
                    attributeName="points"
                    values="20,108 8,102 20,102;
                            20,108 3,102 20,102;
                            20,108 12,102 20,102;
                            20,108 8,102 20,102"
                    dur="0.18s"
                    repeatCount="indefinite"/>
                </polygon>
                
                {/*<!-- Inner flame core -->*/}
                <polygon points="20,97 12,100 20,103" fill="#FFD23F">
                    <animate
                    attributeName="points"
                    values="20,97 12,100 20,103;
                            20,97 8,100 20,103;
                            20,97 15,100 20,103;
                            20,97 12,100 20,103"
                    dur="0.1s"
                    repeatCount="indefinite"/>
                </polygon>
                </g>
                
                {/*<!-- Speed lines -->*/}
                <g opacity="0.6">
                <line x1="10" y1="85" x2="-10" y2="87" stroke="#4A90E2" stroke-width="2">
                    <animate
                    attributeName="opacity"
                    values="0; 1; 0"
                    dur="0.3s"
                    repeatCount="indefinite"/>
                </line>
                <line x1="15" y1="100" x2="-15" y2="102" stroke="#4A90E2" stroke-width="2">
                    <animate
                    attributeName="opacity"
                    values="0; 1; 0"
                    dur="0.4s"
                    begin="0.1s"
                    repeatCount="indefinite"/>
                </line>
                <line x1="10" y1="115" x2="-10" y2="117" stroke="#4A90E2" stroke-width="2">
                    <animate
                    attributeName="opacity"
                    values="0; 1; 0"
                    dur="0.35s"
                    begin="0.2s"
                    repeatCount="indefinite"/>
                </line>
                </g>
                
                {/*<!-- Rocket bobbing motion -->*/}
                <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,2; 0,0"
                dur="0.8s"
                repeatCount="indefinite"
                additive="sum"/>
            </g>
            
            {/*<!-- Exhaust trail particles -->*/}
            <g opacity="0.6">
                <animateTransform
                attributeName="transform"
                type="translate"
                values="-150,0; 900,0"
                dur="4s"
                repeatCount="indefinite"/>
                
                <circle cx="10" cy="100" r="3" fill="#FF6B35">
                <animate
                    attributeName="opacity"
                    values="0; 0.8; 0"
                    dur="0.6s"
                    repeatCount="indefinite"/>
                <animate
                    attributeName="r"
                    values="3; 1; 3"
                    dur="0.6s"
                    repeatCount="indefinite"/>
                </circle>
                
                <circle cx="0" cy="95" r="2" fill="#FF8C42">
                <animate
                    attributeName="opacity"
                    values="0; 0.6; 0"
                    dur="0.8s"
                    begin="0.2s"
                    repeatCount="indefinite"/>
                <animate
                    attributeName="r"
                    values="2; 0.5; 2"
                    dur="0.8s"
                    begin="0.2s"
                    repeatCount="indefinite"/>
                </circle>
                
                <circle cx="5" cy="105" r="2" fill="#FFD23F">
                <animate
                    attributeName="opacity"
                    values="0; 0.7; 0"
                    dur="0.5s"
                    begin="0.1s"
                    repeatCount="indefinite"/>
                <animate
                    attributeName="r"
                    values="2; 0.8; 2"
                    dur="0.5s"
                    begin="0.1s"
                    repeatCount="indefinite"/>
                </circle>
            </g>
            </svg>
    </>
  );
}
