import { ClipInput } from '@/features/clips/components/ui/ClipInput';
import { ClipInputProps } from '@/types/types';

export function ClipHeader({
    clipUrl,
    onInputChange,
}: ClipInputProps) {
    return (
        <div className='flex h-1/10 justify-center items-center'>
            <ClipInput clipUrl={clipUrl} onInputChange={onInputChange} />
        </div>
    );
}