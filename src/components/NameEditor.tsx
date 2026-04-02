import React, { useState, useRef, useEffect } from 'react';
import { Region, CustomNameData } from '../types';
import { REGIONAL_NAMES } from '../data/names';
import { X, Plus, RotateCcw, Save, ArrowLeft, ChevronDown } from 'lucide-react';

interface NameEditorProps {
  initialData?: CustomNameData;
  onSave: (data: CustomNameData | undefined) => void;
  onCancel: () => void;
}

type NameType = 'prefixes' | 'suffixes' | 'firstNames' | 'lastNames';

export const NameEditor: React.FC<NameEditorProps> = ({ initialData, onSave, onCancel }) => {
  const [data, setData] = useState<CustomNameData>(() => {
    if (initialData) {
      // Ensure backwards compatibility if firstNames/lastNames are missing
      const parsed = JSON.parse(JSON.stringify(initialData));
      Object.values(Region).forEach(region => {
        if (!parsed[region].firstNames) parsed[region].firstNames = [...REGIONAL_NAMES[region as Region].firstNames];
        if (!parsed[region].lastNames) parsed[region].lastNames = [...REGIONAL_NAMES[region as Region].lastNames];
      });
      return parsed;
    }
    
    // Initialize with defaults if no custom data exists
    const defaults: Partial<CustomNameData> = {};
    Object.values(Region).forEach(region => {
      defaults[region as Region] = {
        prefixes: [...REGIONAL_NAMES[region as Region].prefixes],
        suffixes: [...REGIONAL_NAMES[region as Region].suffixes],
        firstNames: [...REGIONAL_NAMES[region as Region].firstNames],
        lastNames: [...REGIONAL_NAMES[region as Region].lastNames]
      };
    });
    return defaults as CustomNameData;
  });

  const [activeRegion, setActiveRegion] = useState<Region>(Region.USA);
  const [activeType, setActiveType] = useState<NameType>('prefixes');
  const [inputValue, setInputValue] = useState('');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    setData(prev => {
      const regionData = prev[activeRegion];
      if (regionData[activeType].includes(trimmed)) return prev; // Prevent duplicates
      
      return {
        ...prev,
        [activeRegion]: {
          ...regionData,
          [activeType]: [...regionData[activeType], trimmed]
        }
      };
    });

    setInputValue('');
  };

  const handleRemove = (index: number) => {
    setData(prev => {
      const regionData = prev[activeRegion];
      if (regionData[activeType].length <= 5) {
        alert(`You must have at least 5 items here to prevent errors.`);
        return prev;
      }

      const newList = [...regionData[activeType]];
      newList.splice(index, 1);
      
      return {
        ...prev,
        [activeRegion]: {
          ...regionData,
          [activeType]: newList
        }
      };
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all names to their default values? This will erase all your custom additions.')) {
      onSave(undefined);
    }
  };

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="h-[100dvh] bg-whiskey-dark text-stone-200 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-whiskey-light/30 bg-whiskey-dark shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="p-2 bg-whiskey-medium border border-whiskey-light rounded-lg text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-none">Name Editor</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="p-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-colors"
            title="Reset Defaults"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-whiskey-gold text-whiskey-dark rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-whiskey-amber transition-all shadow-lg flex items-center gap-2"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 gap-4 min-h-0">
        {/* Controls Row: Region Dropdown & Type Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0 z-20">
          
          {/* Region Dropdown */}
          <div className="relative z-40" ref={dropdownRef}>
            <button
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="w-full sm:w-48 px-4 py-3 bg-whiskey-medium border border-whiskey-light rounded-lg font-black uppercase tracking-widest text-xs text-white flex items-center justify-between hover:bg-whiskey-light/20 transition-colors"
            >
              {activeRegion}
              <ChevronDown size={16} className={`transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isRegionDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-whiskey-medium border border-whiskey-light rounded-lg shadow-xl overflow-hidden z-50">
                {Object.values(Region).map(region => (
                  <button
                    key={region}
                    onClick={() => {
                      setActiveRegion(region);
                      setInputValue('');
                      setIsRegionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-bold uppercase tracking-widest text-xs transition-colors ${
                      activeRegion === region 
                        ? 'bg-whiskey-gold text-whiskey-dark' 
                        : 'text-stone-300 hover:bg-whiskey-light/20 hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type Dropdown */}
          <div className="relative flex-1 z-30" ref={typeDropdownRef}>
            <button
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className="w-full px-4 py-3 bg-whiskey-medium border border-whiskey-light rounded-lg font-black uppercase tracking-widest text-xs text-white flex items-center justify-between hover:bg-whiskey-light/20 transition-colors"
            >
              {activeType.replace('Names', ' Names')} ({data[activeRegion][activeType].length})
              <ChevronDown size={16} className={`transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-whiskey-medium border border-whiskey-light rounded-lg shadow-xl overflow-hidden z-50">
                {(['prefixes', 'suffixes', 'firstNames', 'lastNames'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveType(type);
                      setInputValue('');
                      setIsTypeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-bold uppercase tracking-widest text-xs transition-colors ${
                      activeType === type 
                        ? 'bg-whiskey-gold text-whiskey-dark' 
                        : 'text-stone-300 hover:bg-whiskey-light/20 hover:text-white'
                    }`}
                  >
                    {type.replace('Names', ' Names')} ({data[activeRegion][type].length})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 shrink-0">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={`Add new ${activeType === 'prefixes' ? 'prefix' : activeType === 'suffixes' ? 'suffix' : activeType === 'firstNames' ? 'first name' : 'last name'}...`}
            className="flex-1 bg-whiskey-medium border border-whiskey-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-whiskey-gold text-white placeholder-stone-500"
          />
          <button 
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="px-6 bg-whiskey-medium border border-whiskey-light rounded-lg text-whiskey-gold hover:bg-whiskey-dark disabled:opacity-50 disabled:hover:bg-whiskey-medium transition-all flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* List Area - Internally Scrollable */}
        <div className="flex-1 overflow-y-auto bg-whiskey-medium border border-whiskey-light rounded-xl p-3 custom-scrollbar min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {data[activeRegion][activeType].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-whiskey-dark border border-whiskey-light/50 rounded-lg pl-3 pr-1 py-1.5 group hover:border-whiskey-gold/50 transition-colors">
                <span className="text-sm text-stone-200 truncate mr-2">{item}</span>
                <button 
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-all shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
