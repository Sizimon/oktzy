import React from 'react';

export function Navigation({
    navOpen,
    setNavOpen,
    user,
    ref
}: {
    user: any
    navOpen: boolean
    setNavOpen: (open: boolean) => void
    ref: React.Ref<HTMLDivElement>
}) {

    return (
        <div>
            {!navOpen ? (
                <button className='absolute top-0 left-0 z-60'
                    onClick={() => setNavOpen(true)}
                >
                    {/* Hamburger icon */}
                    <p>open</p>
                </button>

            ) : (
                <nav ref={ref} className={`fixed top-0 left-0 flex flex-col justify-start items-center h-full bg-slate-800/40 backdrop-blur-md pointer-events-none z-60 ${navOpen ? 'w-1/5' : 'w-0'} p-4`}>
                    <div className="text-white border-b border-white/10 w-full p-4">
                        {user ? `Welcome, ${user.username}` : 'Not logged in'}
                    </div>
                </nav>
            )}
        </div>
    )
}