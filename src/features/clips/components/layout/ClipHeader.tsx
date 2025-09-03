import { ClipInput } from '@/features/clips/components/ui/ClipInput';
import { ClipInputProps } from '@/types/types';

export function ClipHeader({
    clipUrl,
    onInputChange,
    user
}: ClipInputProps & { user: any }) {
    return (
        <div className='flex h-1/10 justify-center items-center'>
            <ClipInput clipUrl={clipUrl} onInputChange={onInputChange} />
            {user ? (
                <p className='text-text'>{`Welcome back, ${user.username}!`}</p>
            ) : (
                <p className='text-text'>
                    Please sign in to access all features.
                </p>
            )}
        </div>
    );
}