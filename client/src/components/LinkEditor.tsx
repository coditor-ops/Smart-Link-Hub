import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import api from '../services/api';
import TargetLocationSelector from './TargetLocationSelector';
import type { ITargetLocation } from './TargetLocationSelector';

interface Rule {
    type: 'time' | 'device' | 'location';
    value: string;
    action: 'show' | 'hide';
}

interface Link {
    _id?: string;
    title: string;
    originalUrl: string;
    priority: number;
    isActive: boolean;
    imageUrl?: string;
    rules: Rule[];
}

interface LinkEditorProps {
    initialLink?: Link;
    onSave: (link: Link) => void;
    onCancel: () => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ initialLink, onSave, onCancel }) => {
    const [link, setLink] = useState<Link>({
        title: '',
        originalUrl: '',
        priority: 0,
        isActive: true,
        imageUrl: '',
        rules: []
    });

    const [newRule, setNewRule] = useState<Rule>({
        type: 'time',
        value: '',
        action: 'show'
    });

    // Temporary state for complex inputs
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [deviceTypes, setDeviceTypes] = useState<string[]>(['mobile']); // Multi-select support
    const [selectedLocations, setSelectedLocations] = useState<ITargetLocation[]>([]); // Location support

    useEffect(() => {
        if (initialLink) {
            setLink(initialLink);
        }
    }, [initialLink]);

    const handleAddRule = () => {
        let ruleValue = newRule.value;

        // Process value based on type
        if (newRule.type === 'time') {
            if (!timeStart || !timeEnd) return alert('Please select start and end time');
            ruleValue = `${timeStart}-${timeEnd}`;
        } else if (newRule.type === 'device') {
            if (deviceTypes.length === 0) return alert('Please select at least one device');
            ruleValue = deviceTypes.join(',');
        } else if (newRule.type === 'location') {
            if (selectedLocations.length === 0) return alert('Please select at least one location');
            // Serialize locations: "India,Mumbai"
            // Note: server logic might need update if we want to handle city vs country strictly.
            // For now passing Names. Ideally should pass full object but rule.value is string.
            // Let's pass Name.
            ruleValue = selectedLocations.map(l => l.name).join(',');
        }

        // VALIDATION: Check for existing rules that conflict
        const isDuplicate = link.rules.some(r => r.type === newRule.type && r.value === ruleValue && r.action === newRule.action);
        if (isDuplicate) {
            return alert('This rule already exists.');
        }

        const isConflicting = link.rules.some(r => r.type === newRule.type && r.value === ruleValue && r.action !== newRule.action);
        if (isConflicting) {
            return alert(`Conflict: You already have a rule for ${newRule.type} '${ruleValue}' with action '${isConflicting ? (newRule.action === 'show' ? 'hide' : 'show') : ''}'. You cannot SHOW and HIDE the same thing.`);
        }

        // VALIDATION (Detailed): Check for partial overlap in Devices
        if (newRule.type === 'device') {
            const newDevices = (newRule.type === 'device' ? deviceTypes : []); // newRule.value is comma separated string, but we have deviceTypes array handy

            for (const existingRule of link.rules) {
                if (existingRule.type === 'device') {
                    const existingDevices = existingRule.value.split(',');
                    const overlap = newDevices.filter(d => existingDevices.includes(d));

                    if (overlap.length > 0) {
                        if (existingRule.action === newRule.action) {
                            return alert(`Redundant: Device(s) '${overlap.join(', ')}' are already covered by an existing rule.`);
                        } else {
                            return alert(`Conflict: Device(s) '${overlap.join(', ')}' are already set to ${existingRule.action}. You cannot change their visibility in a separate rule.`);
                        }
                    }
                }
            }
        }

        setLink(prev => ({
            ...prev,
            rules: [...prev.rules, { ...newRule, value: ruleValue }]
        }));

        // Reset temp inputs
        setNewRule({ type: 'time', value: '', action: 'show' });
        setTimeStart('');
        setTimeEnd('');
        setSelectedLocations([]);
    };

    const removeRule = (index: number) => {
        setLink(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        try {
            // If it has an ID, update; otherwise create (logic handled by parent or here)
            // For this component, we just pass the object back to the parent to handle the API call usually,
            // or we can call the API directly here. The Requirement said "Submit: Send JSON object to updateLinkRules endpoint".

            // Validation
            if (!link.title || !link.originalUrl) return alert('Title and URL are required');

            if (link._id) {
                await api.put(`/links/${link._id}`, link);
            } else {
                // If creating new, we might need hubId. 
                // For now, let's assume this editor is mostly for editing existing links or the parent handles creation.
                // call onSave to let parent know or refetch.
            }
            onSave(link);
        } catch (error) {
            console.error('Failed to save link', error);
            alert('Failed to save link');
        }
    };

    return (
        <div className="bg-cyber-black border border-cyber-green p-6 rounded-lg shadow-cyber max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-mono text-cyber-green">EDIT LINK_NODE</h2>
                <button onClick={onCancel} className="text-cyber-text hover:text-red-500"><X /></button>
            </div>

            {/* Basic Info */}
            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-cyber-text font-mono text-sm mb-1">TITLE</label>
                    <input
                        type="text"
                        value={link.title}
                        onChange={e => setLink({ ...link, title: e.target.value })}
                        className="w-full bg-black border border-cyber-green/50 text-cyber-text p-2 rounded focus:border-cyber-green focus:outline-none font-mono"
                    />
                </div>
                <div>
                    <label className="block text-cyber-text font-mono text-sm mb-1">DESTINATION URL</label>
                    <input
                        type="text"
                        value={link.originalUrl}
                        onChange={e => setLink({ ...link, originalUrl: e.target.value })}
                        className="w-full bg-black border border-cyber-green/50 text-cyber-text p-2 rounded focus:border-cyber-green focus:outline-none font-mono"
                    />
                </div>
                <div>
                    <label className="block text-cyber-text font-mono text-sm mb-1">LINK IMAGE (LOCKED: COMPANY ONLY)</label>
                    {/* <div className="flex items-center gap-4">
                        {link.imageUrl && (
                            <img src={link.imageUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-cyber-green/30" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                // Upload Logic Disabled by Admin Policy
                            }}
                            className="..."
                        />
                    </div> */}
                    <div className="text-xs text-cyber-text/30 italic font-mono p-2 border border-cyber-green/10 rounded">
                        Image management is restricted to Company Administrators.
                    </div>
                </div>
            </div>

            {/* Rules Builder */}
            <div className="mb-8">
                <h3 className="text-cyber-green font-mono text-lg mb-4 border-b border-cyber-green/30 pb-2">TRAFFIC_RULES</h3>

                {/* Existing Rules */}
                <div className="space-y-2 mb-4">
                    {link.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-cyber-green/10 p-2 rounded border border-cyber-green/20">
                            <span className="font-mono text-sm text-cyber-text">
                                <span className="text-cyber-green font-bold uppercase">{rule.action}</span> if {rule.type} is <span className="bg-black px-1 rounded">{rule.value}</span>
                            </span>
                            <button onClick={() => removeRule(idx)} className="text-cyber-text/50 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {link.rules.length === 0 && <p className="text-cyber-text/30 italic font-mono text-sm">No active rules.</p>}
                </div>

                {/* Add New Rule */}
                <div className="bg-black p-4 rounded border border-cyber-green/30">
                    <div className="flex gap-2 mb-2">
                        <select
                            value={newRule.action}
                            onChange={e => setNewRule({ ...newRule, action: e.target.value as any })}
                            className="bg-cyber-black text-cyber-text border border-cyber-green/50 rounded p-1 font-mono text-sm"
                        >
                            <option value="show">SHOW</option>
                            <option value="hide">HIDE</option>
                        </select>
                        <span className="text-cyber-text py-1 text-sm font-mono">IF</span>
                        <select
                            value={newRule.type}
                            onChange={e => setNewRule({ ...newRule, type: e.target.value as any })}
                            className="bg-cyber-black text-cyber-text border border-cyber-green/50 rounded p-1 font-mono text-sm"
                        >
                            <option value="time">TIME</option>
                            <option value="device">DEVICE</option>
                            <option value="location">LOCATION</option>
                        </select>
                    </div>

                    {/* Dynamic Inputs */}
                    <div className="mb-4">
                        {newRule.type === 'time' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    value={timeStart}
                                    onChange={e => setTimeStart(e.target.value)}
                                    className="bg-cyber-black text-cyber-text border border-cyber-green/50 rounded p-1"
                                />
                                <span className="text-cyber-text">-</span>
                                <input
                                    type="time"
                                    value={timeEnd}
                                    onChange={e => setTimeEnd(e.target.value)}
                                    className="bg-cyber-black text-cyber-text border border-cyber-green/50 rounded p-1"
                                />
                            </div>
                        )}

                        {newRule.type === 'device' && (
                            <div className="flex gap-2">
                                {['mobile', 'desktop', 'tablet'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => {
                                            setDeviceTypes(prev =>
                                                prev.includes(d)
                                                    ? prev.filter(t => t !== d)
                                                    : [...prev, d]
                                            );
                                        }}
                                        className={`px-3 py-1 rounded border font-mono text-sm uppercase ${deviceTypes.includes(d) ? 'bg-cyber-green text-black border-cyber-green' : 'bg-transparent text-cyber-text border-cyber-green/30'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}

                        {newRule.type === 'location' && (
                            <TargetLocationSelector
                                selectedLocations={selectedLocations}
                                onChange={setSelectedLocations}
                            />
                        )}
                    </div>

                    <button
                        onClick={handleAddRule}
                        className="w-full flex items-center justify-center gap-2 bg-cyber-green/10 hover:bg-cyber-green/20 text-cyber-green border border-cyber-green/50 py-2 rounded transition-colors font-mono text-sm"
                    >
                        <Plus size={16} /> ADD RULE
                    </button>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-cyber-green/30">
                <button onClick={onCancel} className="px-4 py-2 text-cyber-text hover:text-white font-mono text-sm">CANCEL</button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-cyber-green text-black px-6 py-2 rounded font-bold hover:shadow-cyber transition-all font-mono"
                >
                    <Save size={18} /> SAVE CHANGES
                </button>
            </div>
        </div>
    );
};

export default LinkEditor;
