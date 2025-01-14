import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Maximize2, Minimize2, Radar, Signal, Navigation, Compass } from 'lucide-react';

interface GlobeViewProps {
  targetCoords: [number, number] | null;
  attackLines: Array<{
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    color: string;
  }>;
}

export const GlobeView: React.FC<GlobeViewProps> = ({ targetCoords, attackLines }) => {
  const globeRef = useRef<any>();
  const [currentArcIndex, setCurrentArcIndex] = useState(-1);
  const [showTarget, setShowTarget] = useState(false);
  const [initialRotation, setInitialRotation] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible arcs based on current index
  const visibleArcs = attackLines.slice(0, currentArcIndex + 1);

  useEffect(() => {
    const updateGlobeSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = width * (window.innerWidth < 768 ? 0.75 : 0.625);
        setGlobeSize({ width, height });
      }
    };

    updateGlobeSize();
    window.addEventListener('resize', updateGlobeSize);
    return () => window.removeEventListener('resize', updateGlobeSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      let rotation = 0;
      const rotateInterval = setInterval(() => {
        if (!initialRotation) {
          clearInterval(rotateInterval);
          return;
        }
        rotation += 0.5;
        globeRef.current.pointOfView({
          lat: 30 * Math.sin(rotation * Math.PI / 180),
          lng: rotation % 360,
          altitude: window.innerWidth < 768 ? 3 : 2.5
        }, 0);
      }, 50);

      return () => clearInterval(rotateInterval);
    }
  }, [initialRotation]);

  useEffect(() => {
    if (targetCoords && globeRef.current) {
      const [targetLat, targetLng] = targetCoords;
      const isMobile = window.innerWidth < 768;
      const mobileMultiplier = isMobile ? 1.5 : 1;
      
      const sequence = [
        { lat: 0, lng: 0, altitude: 5 * mobileMultiplier, duration: 2000, delay: 3000 },
        { lat: 0, lng: targetLng, altitude: 4 * mobileMultiplier, duration: 2000, delay: 5000 },
        { lat: targetLat, lng: targetLng, altitude: 3 * mobileMultiplier, duration: 2000, delay: 7000 },
        { lat: targetLat, lng: targetLng, altitude: 0.8 * mobileMultiplier, duration: 3000, delay: 9000 }
      ];

      sequence.forEach(step => {
        setTimeout(() => {
          if (step === sequence[0]) setInitialRotation(false);
          globeRef.current.pointOfView(step, step.duration);
        }, step.delay);
      });

      setTimeout(() => {
        setShowTarget(true);
        setTimeout(() => setShowDetails(true), 3000);
        setTimeout(() => setCurrentArcIndex(0), 1000);
      }, sequence[sequence.length - 1].delay);
    }
  }, [targetCoords]);

  useEffect(() => {
    if (currentArcIndex >= 0 && currentArcIndex < attackLines.length) {
      const timer = setTimeout(() => {
        setCurrentArcIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentArcIndex, attackLines.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getRandomSignalStrength = () => {
    return Math.floor(Math.random() * 100);
  };

  const getTerrainType = (lat: number) => {
    if (Math.abs(lat) < 23.5) return 'Tropical';
    if (Math.abs(lat) < 35) return 'Subtropical';
    if (Math.abs(lat) < 66.5) return 'Temperate';
    return 'Polar';
  };

  const getTimeZone = (lng: number) => {
    const hours = Math.floor(lng / 15);
    const minutes = Math.floor((lng % 15) * 4);
    const sign = hours >= 0 ? '+' : '';
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#0a0a0f]' : 'h-[500px]'
      }`}>
        <Globe
          ref={globeRef}
          width={isFullscreen ? window.innerWidth : globeSize.width}
          height={isFullscreen ? window.innerHeight : globeSize.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="#0a0a0f"
          atmosphereColor="#00fff2"
          atmosphereAltitude={0.25}
          arcsData={visibleArcs}
          arcColor="color"
          arcDashLength={0.5}
          arcDashGap={0.1}
          arcDashAnimateTime={2000}
          arcStroke={1}
          pointsData={showTarget && targetCoords ? [{ lat: targetCoords[0], lng: targetCoords[1] }] : []}
          pointColor={() => '#ff0000'}
          pointAltitude={0.1}
          pointRadius={0.05}
          pointsMerge={true}
        />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full backdrop-blur-sm text-[#00fff2] hover:bg-black/70 transition-colors"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>

        <AnimatePresence>
          {showTarget && targetCoords && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 bg-black/50 p-3 rounded-lg backdrop-blur-sm"
            >
              <p className="text-[#00fff2] text-sm font-mono">
                Target Located: {targetCoords[0].toFixed(2)}°N, {targetCoords[1].toFixed(2)}°E
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDetails && targetCoords && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg overflow-hidden"
          >
            <div className="bg-[#0c0c14] p-4 rounded-lg border border-[#00fff2]/20">
              <h3 className="text-[#00fff2] font-mono mb-4 flex items-center gap-2">
                <Radar className="w-5 h-5" />
                Advanced Terrain Analysis
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#141420] p-4 rounded-lg border border-[#00fff2]/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-4 h-4 text-[#00fff2]" />
                    <span className="text-[#00fff2] text-sm">Coordinates</span>
                  </div>
                  <div className="font-mono text-sm">
                    <p>Lat: {targetCoords[0].toFixed(6)}°N</p>
                    <p>Lng: {targetCoords[1].toFixed(6)}°E</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#141420] p-4 rounded-lg border border-[#00fff2]/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-[#00fff2]" />
                    <span className="text-[#00fff2] text-sm">Region Info</span>
                  </div>
                  <div className="font-mono text-sm">
                    <p>Terrain: {getTerrainType(targetCoords[0])}</p>
                    <p>Time Zone: {getTimeZone(targetCoords[1])}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#141420] p-4 rounded-lg border border-[#00fff2]/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Signal className="w-4 h-4 text-[#00fff2]" />
                    <span className="text-[#00fff2] text-sm">Signal Analysis</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getRandomSignalStrength()}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-[#00fff2] rounded-full"
                      />
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getRandomSignalStrength()}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-[#00fff2] rounded-full"
                      />
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getRandomSignalStrength()}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-full bg-[#00fff2] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#141420] p-4 rounded-lg border border-[#00fff2]/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Radar className="w-4 h-4 text-[#00fff2]" />
                    <span className="text-[#00fff2] text-sm">Activity Monitor</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="text-gray-400"
                      >
                        {`>${'•'.repeat(Math.floor(Math.random() * 20) + 10)}`}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 p-3 bg-black/30 rounded-lg font-mono text-sm"
              >
                <p className="text-[#00fff2]">System Analysis:</p>
                <p className="text-gray-400 mt-1">
                  {`>${'•'.repeat(Math.floor(Math.random() * 50) + 30)}`}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};