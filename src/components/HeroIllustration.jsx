export default function HeroIllustration() {
  return (
    <div aria-hidden className="relative w-full h-56 sm:h-72 lg:h-80">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1ABC9C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <g filter="url(#f1)">
          <path d="M0 320 Q 120 180 240 240 T 480 200 T 800 120 L 800 400 L 0 400 Z" fill="url(#g1)" opacity="0.25"/>
        </g>
        <g>
          <polyline points="50,300 150,240 250,260 350,210 450,230 550,180 650,200 750,150" stroke="#1ABC9C" strokeWidth="3" fill="none" />
          <polyline points="50,320 150,280 250,300 350,250 450,270 550,220 650,240 750,200" stroke="#0A1F44" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
