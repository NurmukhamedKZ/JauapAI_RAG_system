import { useState, useRef } from 'react';
import { ChevronDown, Book, GraduationCap, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { ChatFilters } from '../../services/conversationService';
import VoteModal from './VoteModal';

interface FilterBarProps {
    filters: ChatFilters;
    setFilters: (filters: ChatFilters) => void;
}

interface DropdownOption {
    value: string;
    label: string;
    isFuture?: boolean; // Mark subjects that are "coming soon"
}

interface DropdownProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    onFutureSelect?: (value: string) => void;
}

const FilterDropdown = ({ label, icon, value, options, onChange, onFutureSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(o => o.value === value)?.label || label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 hover:bg-surface border border-white/5 hover:border-emerald-glow/30 rounded-full text-sm text-text-main transition-all shadow-sm backdrop-blur-sm"
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
                    <div className="absolute bottom-full left-0 mb-2 glass-card bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    if (option.isFuture && onFutureSelect) {
                                        onFutureSelect(option.value);
                                    } else {
                                        onChange(option.value);
                                    }
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between ${value === option.value
                                    ? 'text-emerald-glow bg-emerald-glow/5'
                                    : option.isFuture
                                        ? 'text-text-dim opacity-70'
                                        : 'text-text-main'
                                    }`}
                            >
                                <span>{option.label}</span>
                                {option.isFuture && (
                                    <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/20">
                                        скоро
                                    </span>
                                )}
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
    const [showVoteModal, setShowVoteModal] = useState(false);

    const handleDisciplineChange = (value: string) => {
        // When discipline changes, reset grade and publisher
        setFilters({
            ...filters,
            discipline: value || undefined,
            grade: undefined,
            publisher: undefined
        });
    };

    const handleFutureSubjectSelect = () => {
        setShowVoteModal(true);
    };

    const handleChange = (key: keyof ChatFilters, value: string) => {
        setFilters({ ...filters, [key]: value || undefined });
    };



    const disciplineOptions: DropdownOption[] = [
        // All subjects option
        { value: '', label: t('allSubjects') },
        // Available subjects
        { value: 'Қазақстан тарихы', label: t('historyKaz') },
        { value: 'Информатика', label: t('informatics') },
        // Future subjects (coming soon)
        { value: 'География', label: t('geography'), isFuture: true },
        { value: 'Математика', label: t('mathematics'), isFuture: true },
        { value: 'Физика', label: t('physics'), isFuture: true },
    ];

    // Dynamic grade options based on discipline
    const getGradeOptions = (): DropdownOption[] => {
        const discipline = filters.discipline;

        // "All grades" option always first
        const allOption = { value: '', label: t('allGrades') };

        if (discipline === 'Қазақстан тарихы') {
            // History: grades 6-11
            return [
                allOption,
                ...['6 сынып', '7 сынып', '8 сынып', '9 сынып', '10 сынып', '11 сынып'].map(g => ({
                    value: g,
                    label: `${g} ${t('gradeLabel')}`
                }))
            ];
        } else if (discipline === 'Информатика') {
            // Informatics: grades 7-11
            return [
                allOption,
                ...['7 сынып', '8 сынып', '9 сынып', '10 сынып', '11 сынып'].map(g => ({
                    value: g,
                    label: `${g} ${t('gradeLabel')}`
                }))
            ];
        }

        // No specific discipline selected - show all grades (6-11)
        return [
            allOption,
            ...['6', '7', '8', '9', '10', '11'].map(g => ({
                value: g,
                label: `${g} ${t('gradeLabel')}`
            }))
        ];
    };

    // Dynamic publisher options based on discipline
    const getPublisherOptions = (): DropdownOption[] => {
        const discipline = filters.discipline;

        // "All publishers" option always first
        const allOption = { value: '', label: t('allPublishers') };

        if (discipline === 'Қазақстан тарихы') {
            // History: Атамұра, Мектеп only
            return [
                allOption,
                { value: 'Атамұра', label: t('atamura') },
                { value: 'Мектеп', label: t('mektep') },
            ];
        } else if (discipline === 'Информатика') {
            // Informatics: Атамұра, Мектеп, АрманПВ, Алматы кітап
            return [
                allOption,
                { value: 'Атамұра', label: t('atamura') },
                { value: 'Мектеп', label: t('mektep') },
                { value: 'АрманПВ', label: t('armanpv') },
                { value: 'Алматы кітап', label: t('almatyKitap') },
            ];
        }

        // No specific discipline selected - show all publishers
        return [
            allOption,
            { value: 'Атамұра', label: t('atamura') },
            { value: 'Мектеп', label: t('mektep') },
            { value: 'АрманПВ', label: t('armanpv') },
            { value: 'Алматы кітап', label: t('almatyKitap') },
        ];
    };

    const gradeOptions = getGradeOptions();
    const publisherOptions = getPublisherOptions();



    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                {/* Discipline */}
                <FilterDropdown
                    label={t('discipline')}
                    icon={<Book className="w-4 h-4 text-blue-400" />}
                    value={filters.discipline || ''}
                    options={disciplineOptions}
                    onChange={handleDisciplineChange}
                    onFutureSelect={handleFutureSubjectSelect}
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

            {/* Vote Modal */}
            <VoteModal
                isOpen={showVoteModal}
                onClose={() => setShowVoteModal(false)}
            />
        </>
    );
};

export default FilterBar;

