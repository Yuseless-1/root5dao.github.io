'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Shuffle, Palette, Sparkles, Loader2 } from 'lucide-react';
import Header from './Header';

interface LayerSelection {
  background: string;
  body: string;
  head: string;
  sunglasses: string;
  hair: string;
}

const LAYER_CONFIG = {
  background: [
    { value: 'background-1', image: '/layers/background/blue.png', label: 'Blue' },
    { value: 'background-2', image: '/layers/background/castle.png', label: 'Castle' },
    { value: 'background-3', image: '/layers/background/green.png', label: 'Green' },
    { value: 'background-4', image: '/layers/background/pink.png', label: 'Pink' },
    { value: 'background-5', image: '/layers/background/red.png', label: 'Red' },
    { value: 'background-6', image: '/layers/background/sky.png', label: 'Sky' },
    { value: 'background-7', image: '/layers/background/white.png', label: 'White' },
    { value: 'background-8', image: '/layers/background/yellow.png', label: 'Yellow' },
  ],
  body: [
    { value: 'body-1', image: '/layers/body/base.png', label: 'Classic' },
    { value: 'body-2', image: '/layers/body/body 1-01.png', label: 'Alt Classic' },
    { value: 'body-3', image: '/layers/body/f_base_01.png', label: 'Female 1' },
    { value: 'body-4', image: '/layers/body/f_base_02.png', label: 'Female 2' },
    { value: 'body-5', image: '/layers/body/f_base_03.png', label: 'Female 3' },
    { value: 'body-6', image: '/layers/body/m_base_01.png', label: 'Male 1' },
    { value: 'body-7', image: '/layers/body/m_base_02.png', label: 'Male 2' },
  ],
  head: [
    { value: 'head-1', image: '/layers/head/base.png', label: 'Classic' },
    { value: 'head-2', image: '/layers/head/face.png', label: 'Face' },
    { value: 'head-3', image: '/layers/head/image.png', label: 'Alt' },
    { value: 'head-4', image: '/layers/head/f_base_01cheeks.png', label: 'Female Cheeks' },
    { value: 'head-5', image: '/layers/head/f_base_02.png', label: 'Female 2' },
    { value: 'head-6', image: '/layers/head/f_base_03.png', label: 'Female 3' },
    { value: 'head-7', image: '/layers/head/f_base_04.png', label: 'Female 4' },
  ],
  sunglasses: [
    { value: 'sunglasses-1', image: '/layers/sunglasses/nothing.png', label: 'None' },
    { value: 'sunglasses-2', image: '/layers/sunglasses/sunglasses.png', label: 'Sunglasses' },
  ],
  hair: [
    { value: 'hair-1', image: '/layers/hair/2-done.png', label: 'Style 1' },
    { value: 'hair-2', image: '/layers/hair/3-done.png', label: 'Style 2' },
    { value: 'hair-3', image: '/layers/hair/4-done.png', label: 'Style 3' },
    { value: 'hair-4', image: '/layers/hair/5-done.png', label: 'Style 4' },
    { value: 'hair-5', image: '/layers/hair/6-done.png', label: 'Style 5' },
    { value: 'hair-6', image: '/layers/hair/base.png', label: 'Base' },
    { value: 'hair-7', image: '/layers/hair/golden-done.png', label: 'Golden' },
    { value: 'hair-8', image: '/layers/hair/f_base_01.png', label: 'Female Base' },
  ],
};

export default function PFPGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLayer, setActiveLayer] = useState<keyof LayerSelection>('background');
  const [selections, setSelections] = useState<LayerSelection>({
    background: 'background-1',
    body: 'body-1',
    head: 'head-1',
    sunglasses: 'sunglasses-1',
    hair: 'hair-1',
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const drawPFP = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw layers in order
    const layerOrder: (keyof LayerSelection)[] = ['background', 'body', 'head', 'sunglasses', 'hair'];
    
    // Load all images first, then draw in order
    const imagePromises = layerOrder.map((layer) => {
      return new Promise<HTMLImageElement | null>((resolve) => {
        const selectedValue = selections[layer];
        const layerConfig = LAYER_CONFIG[layer];
        const selectedOption = layerConfig.find(opt => opt.value === selectedValue);
        
        if (selectedOption) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error(`Error loading ${layer} image:`, selectedOption.image);
            resolve(null);
          };
          
          img.src = selectedOption.image;
        } else {
          resolve(null);
        }
      });
    });

    // Wait for all images to load, then draw them in order
    const images = await Promise.all(imagePromises);
    
    images.forEach((img) => {
      if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    });
  };

  useEffect(() => {
    drawPFP();
  }, [selections]);

  const handleLayerSelect = (layer: keyof LayerSelection, value: string) => {
    setSelections(prev => ({
      ...prev,
      [layer]: value,
    }));
  };

  const randomize = () => {
    const newSelections: LayerSelection = {
      background: LAYER_CONFIG.background[Math.floor(Math.random() * LAYER_CONFIG.background.length)].value,
      body: LAYER_CONFIG.body[Math.floor(Math.random() * LAYER_CONFIG.body.length)].value,
      head: LAYER_CONFIG.head[Math.floor(Math.random() * LAYER_CONFIG.head.length)].value,
      sunglasses: LAYER_CONFIG.sunglasses[Math.floor(Math.random() * LAYER_CONFIG.sunglasses.length)].value,
      hair: LAYER_CONFIG.hair[Math.floor(Math.random() * LAYER_CONFIG.hair.length)].value,
    };
    setSelections(newSelections);
  };

  const downloadPFP = () => {
    // If there's an edited image, download that instead
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = 'roots-pfp-custom.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'roots-pfp.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleAICustomization = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt to customize your PFP');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsEditing(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'pfp.png');
      formData.append('prompt', aiPrompt);

      // Call API
      const response = await fetch('/api/qwen-edit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || 'Failed to edit image';
        
        // Handle development/unavailable status differently (503)
        if (response.status === 503) {
          console.info('AI Feature Status:', errorMsg);
          alert(errorMsg);
          return;
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.success && data.editedImage) {
        setEditedImage(data.editedImage);
      } else {
        throw new Error(data.error || 'Failed to edit image');
      }
    } catch (error) {
      console.error('Error customizing PFP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to customize PFP';
      alert(errorMessage);
    } finally {
      setIsEditing(false);
    }
  };

  const resetToOriginal = () => {
    setEditedImage(null);
    setAiPrompt('');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Palette className="h-8 w-8 text-green-400" />
              <h1 className="text-4xl sm:text-5xl font-bold text-white">PFP Generator</h1>
            </div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Create your unique profile picture by combining different layers
            </p>
          </div>

          {/* Main Container */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Preview Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-4">Preview</h2>
                <div className="glass-effect rounded-xl p-6 flex justify-center items-center relative">
                  {editedImage ? (
                    <img
                      src={editedImage}
                      alt="Edited PFP"
                      className="w-full max-w-[320px] h-auto rounded-lg border-2 border-purple-400/50 shadow-lg shadow-purple-400/20"
                    />
                  ) : (
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={320}
                      className="w-full max-w-[320px] h-auto rounded-lg border-2 border-green-400/50 shadow-lg shadow-green-400/20"
                    />
                  )}
                  {editedImage && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-400/50">
                        AI Customized
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={randomize}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  disabled={isEditing}
                >
                  <Shuffle className="h-5 w-5" />
                  Randomize
                </button>
                <button
                  onClick={downloadPFP}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                  disabled={isEditing}
                >
                  <Download className="h-5 w-5" />
                  Download PFP
                </button>
                
                {/* AI Customization Section */}
                <div className="glass-effect rounded-lg p-4 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h4 className="text-sm font-semibold text-purple-400">AI Customization</h4>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Beta</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Experimental AI feature - Generate a new character based on your prompt
                  </p>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., Add sunglasses, change hair color to blue..."
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 mb-3"
                    disabled={isEditing}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAICustomization}
                      disabled={isEditing || !aiPrompt.trim()}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/50 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isEditing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Customizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Apply AI
                        </>
                      )}
                    </button>
                    {editedImage && (
                      <button
                        onClick={resetToOriginal}
                        disabled={isEditing}
                        className="px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customize Layers Section */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-6">Customize Layers</h2>
              
              {/* Layer Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-700">
                {(['background', 'body', 'head', 'sunglasses', 'hair'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeLayer === layer
                        ? 'bg-green-400/20 text-green-400 border border-green-400/50'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {layer.charAt(0).toUpperCase() + layer.slice(1)}
                  </button>
                ))}
              </div>

              {/* Layer Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {LAYER_CONFIG[activeLayer].map((option) => {
                  const isSelected = selections[activeLayer] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleLayerSelect(activeLayer, option.value)}
                      className={`glass-effect rounded-lg p-3 transition-all hover:scale-105 ${
                        isSelected
                          ? 'ring-2 ring-green-400 border-2 border-green-400/50'
                          : 'hover:ring-1 hover:ring-gray-500'
                      }`}
                    >
                      <img
                        src={option.image}
                        alt={option.label}
                        className="w-full h-20 object-cover rounded mb-2"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80x80/333/fff?text=Image';
                        }}
                      />
                      <p className="text-xs text-gray-300 text-center">{option.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

