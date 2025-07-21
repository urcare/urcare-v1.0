import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { HEALTH_GOALS, MEDICAL_CONDITIONS } from './constants';

interface HealthSelectionStepsProps {
  selectionType: 'goals' | 'conditions';
  onDataChange: (data: any) => void;
}

export const HealthSelectionSteps: React.FC<HealthSelectionStepsProps> = ({
  selectionType,
  onDataChange
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [noSelection, setNoSelection] = useState(false);

  const isGoals = selectionType === 'goals';
  const dataSource = isGoals ? HEALTH_GOALS : MEDICAL_CONDITIONS;
  const title = isGoals ? 'Health Goals' : 'Medical Conditions';
  const description = isGoals 
    ? 'What are your main health and wellness goals?' 
    : 'Please select any current medical conditions';
  const noSelectionText = isGoals 
    ? "I don't have specific goals right now" 
    : "I don't have any medical conditions";
  const customPlaceholder = isGoals 
    ? 'Add custom goal...' 
    : 'Add other condition...';

  const handleItemToggle = (item: string | { id: string; label: string }) => {
    const itemId = typeof item === 'string' ? item : item.id;
    const itemLabel = typeof item === 'string' ? item : item.label;
    
    let newSelected;
    if (selectedItems.includes(itemId)) {
      newSelected = selectedItems.filter(id => id !== itemId);
    } else {
      newSelected = [...selectedItems, itemId];
      setNoSelection(false);
    }
    setSelectedItems(newSelected);
    
    const dataKey = isGoals ? 'healthGoals' : 'conditions';
    const noDataKey = isGoals ? 'noGoals' : 'noConditions';
    onDataChange({ [dataKey]: newSelected, [noDataKey]: false });
  };

  const handleAddCustomItem = () => {
    if (customInput.trim() && !selectedItems.includes(customInput.trim())) {
      const newSelected = [...selectedItems, customInput.trim()];
      setSelectedItems(newSelected);
      setCustomInput('');
      
      const dataKey = isGoals ? 'healthGoals' : 'conditions';
      const noDataKey = isGoals ? 'noGoals' : 'noConditions';
      onDataChange({ [dataKey]: newSelected, [noDataKey]: false });
    }
  };

  const handleRemoveItem = (item: string) => {
    const newSelected = selectedItems.filter(id => id !== item);
    setSelectedItems(newSelected);
    
    const dataKey = isGoals ? 'healthGoals' : 'conditions';
    const noDataKey = isGoals ? 'noGoals' : 'noConditions';
    onDataChange({ [dataKey]: newSelected, [noDataKey]: noSelection });
  };

  const handleNoSelection = (checked: boolean) => {
    setNoSelection(checked);
    if (checked) {
      setSelectedItems([]);
      const dataKey = isGoals ? 'healthGoals' : 'conditions';
      const noDataKey = isGoals ? 'noGoals' : 'noConditions';
      onDataChange({ [dataKey]: [], [noDataKey]: true });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomItem();
    }
  };

  // Group medical conditions by category if needed
  const groupedData = isGoals 
    ? dataSource
    : MEDICAL_CONDITIONS.reduce((acc, condition) => {
        const category = condition.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(condition);
        return acc;
      }, {} as Record<string, typeof MEDICAL_CONDITIONS>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selected:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => {
              const displayLabel = isGoals 
                ? item 
                : MEDICAL_CONDITIONS.find(c => c.id === item)?.label || item;
              
              return (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{displayLabel}</span>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="hover:bg-teal-200 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selection Grid */}
      {isGoals ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HEALTH_GOALS.map((goal) => (
            <Button
              key={goal}
              variant={selectedItems.includes(goal) ? "default" : "outline"}
              onClick={() => handleItemToggle(goal)}
              className={`justify-start text-left h-auto py-3 px-4 ${
                selectedItems.includes(goal)
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'hover:bg-teal-50 hover:border-teal-300'
              }`}
            >
              {goal}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedData).map(([category, conditions]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conditions.map((condition) => (
                  <div
                    key={condition.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedItems.includes(condition.id)
                        ? 'bg-teal-50 border-teal-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleItemToggle(condition)}
                  >
                                         <Checkbox
                       checked={selectedItems.includes(condition.id)}
                       onCheckedChange={() => handleItemToggle(condition)}
                    />
                    <condition.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {condition.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={customPlaceholder}
            className="flex-1"
          />
          <Button
            onClick={handleAddCustomItem}
            disabled={!customInput.trim()}
            size="icon"
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* No Selection Option */}
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                 <Checkbox
           checked={noSelection}
           onCheckedChange={handleNoSelection}
        />
        <span className="text-sm text-gray-700">{noSelectionText}</span>
      </div>
    </div>
  );
}; 