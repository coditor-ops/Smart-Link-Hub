
import React, { useState, useRef } from 'react';
import { Search, X, MapPin, Loader } from 'lucide-react';

export interface ITargetLocation {
    id: string;
    type: 'country' | 'state' | 'city' | 'postcode' | 'unknown';
    name: string;
    code?: string;
}

interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        town?: string;
        postcode?: string;
        country_code?: string;
    };
}

interface TargetLocationSelectorProps {
    selectedLocations: ITargetLocation[];
    onChange: (locations: ITargetLocation[]) => void;
}

const TargetLocationSelector: React.FC<TargetLocationSelectorProps> = ({ selectedLocations, onChange }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ITargetLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Debounce timer
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const searchLocations = async (searchText: string) => {
        if (!searchText.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // Using OSM Nominatim API
            // q: query
            // format: json
            // addressdetails: 1 (to get type/country code)
            // limit: 5
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&addressdetails=1&limit=5`, {
                headers: {
                    'User-Agent': 'SmartLinkHub/1.0' // Required by Nominatim
                }
            });
            const data: NominatimResult[] = await response.json();

            const formattedResults: ITargetLocation[] = data.map(item => {
                // Determine type
                let type: ITargetLocation['type'] = 'unknown';
                if (item.type === 'administrative' && item.class === 'boundary') type = 'state'; // Approximate
                if (item.address?.postcode && item.display_name.includes(item.address.postcode)) type = 'postcode';
                if (item.type === 'city' || item.type === 'town') type = 'city';
                if (item.class === 'place' && item.type === 'country') type = 'country';

                // Fallback for type based on granularity if simple mapping fails
                if (type === 'unknown') {
                    if (item.address?.country === item.display_name) type = 'country';
                    else if (item.address?.city === item.display_name) type = 'city';
                }

                // Construct name (Use the main part of display name or first comma part)
                const name = item.display_name.split(',')[0];

                return {
                    id: String(item.place_id),
                    type,
                    name: name,
                    code: item.address?.country_code?.toUpperCase() || item.address?.postcode
                };
            });

            setResults(formattedResults);
            setShowDropdown(true);
        } catch (error) {
            console.error("Location search failed", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            searchLocations(val);
        }, 500); // 500ms debounce
    };

    const addLocation = (location: ITargetLocation) => {
        // Validation: Exact Duplicate
        const exists = selectedLocations.some(l => l.name === location.name && l.type === location.type);
        if (exists) {
            alert(`"${location.name}" is already selected.`);
            return;
        }

        // Optional Smart Check (Example: Prevent generic dups)
        const nameExists = selectedLocations.some(l => l.name === location.name);
        if (nameExists) {
            // Let it pass but maybe warn? For now strict logic is satisfied by above.
        }

        onChange([...selectedLocations, location]);
        setQuery('');
        setShowDropdown(false);
    };

    const removeLocation = (id: string) => {
        onChange(selectedLocations.filter(l => l.id !== id));
    };

    return (
        <div className="w-full relative">
            {/* Selected Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedLocations.map(loc => (
                    <span key={loc.id} className="bg-cyber-green/10 text-cyber-green border border-cyber-green/30 px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
                        <MapPin size={10} />
                        {loc.name} <span className="opacity-50 text-[10px] uppercase">({loc.type})</span>
                        <button onClick={() => removeLocation(loc.id)} className="hover:text-red-500 ml-1">
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search Country, City, or Pincode..."
                    className="w-full bg-cyber-black text-cyber-text border border-cyber-green/50 rounded p-2 pl-8 font-mono text-sm focus:border-cyber-green focus:outline-none"
                    onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                />
                <div className="absolute left-2 top-2.5 text-cyber-green/50">
                    {loading ? <Loader size={14} className="animate-spin" /> : <Search size={14} />}
                </div>
            </div>

            {/* Dropdown */}
            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full bg-black border border-cyber-green/30 mt-1 rounded shadow-xl max-h-60 overflow-y-auto">
                    {results.map(res => (
                        <button
                            key={res.id}
                            onClick={() => addLocation(res)}
                            className="w-full text-left px-4 py-2 text-cyber-text hover:bg-cyber-green/10 hover:text-cyber-green font-mono text-sm border-b border-white/5 last:border-0"
                        >
                            <div className="font-bold">{res.name}</div>
                            <div className="text-xs opacity-50 capitalize">{res.type} {res.code ? `• ${res.code}` : ''}</div>
                        </button>
                    ))}
                </div>
            )}

            {showDropdown && results.length === 0 && query && !loading && (
                <div className="absolute z-50 w-full bg-black border border-cyber-green/30 mt-1 rounded p-2 text-center text-cyber-text/30 text-xs font-mono">
                    No location found
                </div>
            )}
        </div>
    );
};

export default TargetLocationSelector;
