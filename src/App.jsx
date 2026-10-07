import { useEffect, useState } from "react";
import {
  Lock,
  LockOpen,
  CheckCircle2,
  RefreshCw,
  Unlock,
  Copy,
} from "lucide-react";

function App() {
  const [palette, setPalette] = useState([]);
  const [locked, setLocked] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});
  const [copiedAll, setCopiedAll] = useState(false);

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  const generatePalette = () => {
    const newPalette = [];

    for (let i = 0; i < 5; i++) {
      if (locked[i]) {
        newPalette.push(palette[i]);
      } else {
        newPalette.push(generateRandomColor());
      }
    }

    setPalette(newPalette);
  };

  const toggleLock = (index) => {
    const newLocked = [...locked];

    newLocked[index] = !newLocked[index];

    setLocked(newLocked);
  };

  const unlockAll = () => {
    setLocked([false, false, false, false, false]);
  };

  const copyToClipboard = (color, index) => {
    if (copiedStates[index]) return;

    navigator.clipboard.writeText(color);

    setCopiedStates((prev) => ({ ...prev, [index]: true }));

    setTimeout(() => {
      setCopiedStates((prev) => {
        const newStates = { ...prev };

        delete newStates[index];

        return newStates;
      });
    }, 1200);
  };

  const copyAllColors = () => {
    const paletteString = palette.join(", ");

    navigator.clipboard.writeText(paletteString);

    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // hex: color like "#FF5733";
  // string like "rgb(255, 87, 51)"

  const hexToRgb = (hex) => {
    // hex color breakdown: #RRGGBB
    // from 00-FF

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const isColorLight = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155;
  };

  useEffect(() => {
    generatePalette();

    setLocked([false, false, false, false, false]);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();

        generatePalette();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-green-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Color Palette Generator
        </h1>
        <p className="text-gray-400">
          Press{" "}
          <kbd className="px-2 py-1 bg-gray-800 rounded text-sm">Spacebar</kbd>{" "}
          or click Generate to create new palettes
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {palette.map((color, index) => (
            <div
              key={index}
              className="relative h-64 md:h-96 rounded-lg shadow-xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color, index)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(index);
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-lg transition-all shadow-md focus:outline-none ${locked[index] ? "bg-yellow-500 hover:bg-yellow-600" : isColorLight(color) ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}`}
                title={locked[index] ? "Unlock color" : "Lock color"}
              >
                {locked[index] ? (
                  <Lock className="w-5 h-5 text-white" />
                ) : (
                  <LockOpen
                    className={`w-5 h-5 ${isColorLight(color) ? "text-white" : "text-gray-800"}`}
                  />
                )}
              </button>
              {copiedStates[index] && (
                <div
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-lg border-2 ${isColorLight(color) ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Copied
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm bg-black/20">
                <div
                  className={`font-mono text-lg mb-1 font-bold ${isColorLight(color) ? "text-gray-800" : "text-white"}`}
                >
                  {color}
                </div>
                <div
                  className={`font-mono text-sm ${isColorLight(color) ? "text-gray-700" : "text-gray-300"}`}
                >
                  {hexToRgb(color)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="px-8 py-4 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 focus:outline-none"
            onClick={generatePalette}
          >
            <RefreshCw className="w-5  h-5" />
            Generate New Palette
          </button>
          <button
            className="px-8 py-4 bg-yellow-500 cursor-pointer hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 focus:outline-none"
            onClick={unlockAll}
          >
            <Unlock className="w-5 h-5" />
            Unlock All
          </button>
          <button
            className="px-8 py-4 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 relative focus:outline-none"
            onClick={copyAllColors}
            disabled={copiedAll}
          >
            <Copy className="w-5 h-5" />
            Copy All Colors
            {copiedAll && (
              <span className="absolute -top-2 -right-2 bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg border-2 border-gray-300">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            )}
          </button>
        </div>
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-3 text-lg">
            💡 Quick Tips:
          </h3>
          <ul className="text-gray-300 space-y-2">
            <li>
              • <strong>Click any color</strong> to copy its hex code
            </li>
            <li>
              • <strong>Click the lock icon</strong> to keep a color while
              generating new ones
            </li>
            <li>
              • <strong>Press Spacebar</strong> for quick palette generation
            </li>
            <li>
              • <strong>Unlock All</strong> to unlock all locked colors at once
            </li>
            <li>
              • <strong>Copy All</strong> to get all colors at once
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;