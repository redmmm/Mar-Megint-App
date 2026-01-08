import { cn } from '@/lib/utils';
import { ChannelTag } from '@/lib/youtube';

export type FilterValue = 'all' | ChannelTag;

interface FilterTabsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filters: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Mind' },
  { value: 'marmegint', label: 'Már megint?' },
  { value: 'marmegint_jatszunk', label: 'Már megint játszunk?' },
];

export const FilterTabs = ({ value, onChange }: FilterTabsProps) => {
  return (
    <div className="premium-glass inline-flex p-1.5 rounded-full">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            value === filter.value
              ? filter.value === 'marmegint'
                ? 'bg-primary text-primary-foreground'
                : filter.value === 'marmegint_jatszunk'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
