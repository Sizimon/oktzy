export function BtnPrimary({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-4 py-2 text-sm lg:text-base rounded-full transition-colors w-full duration-300
                ${disabled 
                    ? 'bg-gray-400 text-gray-600 opacity-50' 
                    : 'bg-violet-500 hover:bg-violet-600 text-white cursor-pointer'
                }
            `}
        >
            {children}
        </button>
    );
}

export function BtnSecondary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button
            className="border border-violet-600 text-violet-500 hover:bg-violet-500 hover:text-white px-4 py-2 text-sm lg:text-base rounded-full transition-colors cursor-pointer w-full"
            onClick={onClick}
        >
            {children}
        </button>
    );
}