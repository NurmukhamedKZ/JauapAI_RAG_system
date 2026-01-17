import { useState, useRef } from 'react';
import { ChevronDown, Zap, Book, GraduationCap, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { ChatFilters } from '../../services/conversationService';

interface FilterBarProps {
    filters: ChatFilters;
    setFilters: (filters: ChatFilters) => void;
}

interface DropdownProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

const FilterDropdown = ({ label, icon, value, options, onChange }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(o => o.value === value)?.label || label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-200 transition-colors"
            >
                {icon}
                <span className="max-w-[120px] truncate">{value ? selectedLabel : label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 min-w-[180px] max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${value === option.value ? 'text-hero-1 bg-hero-1/10' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
    const { t } = useLanguage();

    const handleChange = (key: keyof ChatFilters, value: string) => {
        setFilters({ ...filters, [key]: value || undefined });
    };

    const modelOptions = [
        { value: 'gemini-1.5-flash', label: t('geminiFlash') },
        { value: 'gemini-1.5-pro', label: t('geminiPro') },
    ];

    const disciplineOptions = [
        { value: '', label: t('allSubjects') },
        { value: 'Қазақстан тарихы', label: t('historyKaz') },
    ];

    const gradeOptions = [
        { value: '', label: t('allGrades') },
        ...['6', '7', '8', '9', '10', '11'].map(g => ({
            value: g,
            label: `${g} ${t('gradeLabel')}`
        }))
    ];

    const publisherOptions = [
        { value: '', label: t('allPublishers') },
        { value: 'Атамұра', label: t('atamura') },
        { value: 'Мектеп', label: t('mektep') },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Model */}
            <FilterDropdown
                label={t('model')}
                icon={<Zap className="w-4 h-4 text-yellow-400" />}
                value={filters.model || 'gemini-1.5-flash'}
                options={modelOptions}
                onChange={(v) => handleChange('model', v)}
            />

            {/* Discipline */}
            <FilterDropdown
                label={t('discipline')}
                icon={<Book className="w-4 h-4 text-blue-400" />}
                value={filters.discipline || ''}
                options={disciplineOptions}
                onChange={(v) => handleChange('discipline', v)}
            />

            {/* Grade */}
            <FilterDropdown
                label={t('grade')}
                icon={<GraduationCap className="w-4 h-4 text-green-400" />}
                value={filters.grade || ''}
                options={gradeOptions}
                onChange={(v) => handleChange('grade', v)}
            />

            {/* Publisher */}
            <FilterDropdown
                label={t('publisher')}
                icon={<Building2 className="w-4 h-4 text-purple-400" />}
                value={filters.publisher || ''}
                options={publisherOptions}
                onChange={(v) => handleChange('publisher', v)}
            />
        </div>
    );
};

export default FilterBar;
