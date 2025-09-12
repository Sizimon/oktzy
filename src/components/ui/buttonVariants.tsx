export function BtnPrimary({ children, onClick }: { children: React.ReactNode; onClick?: () => void; }) {
    return (
        <button
            onClick={onClick}
            className='bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full transition-colors cursor-pointer'
        >
            {children}
        </button>
    );
}

export function BtnSecondary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button
            className="border border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white px-4 py-2 rounded-full transition-colors cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    );
}