export function BtnPrimary({ children, onClick }: { children: React.ReactNode; onClick?: () => void; }) {
    return (
        <button
            onClick={onClick}
            className='bg-violet-500 hover:bg-violet-600 text-white p-2 text-sm lg:text-base rounded-full transition-colors cursor-pointer w-full'
        >
            {children}
        </button>
    );
}

export function BtnSecondary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button
            className="border border-violet-600 text-violet-500 hover:bg-violet-500 hover:text-white p-2 text-sm lg:text-base rounded-full transition-colors cursor-pointer w-full"
            onClick={onClick}
        >
            {children}
        </button>
    );
}