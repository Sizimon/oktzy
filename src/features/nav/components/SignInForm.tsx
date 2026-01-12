const SignInForm = ({
    email, setEmail, password, setPassword, handleSubmit, formType, setFormType
}: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<boolean>;
    formType: 'login' | 'register';
    setFormType: (formType: 'login' | 'register') => void;
}) => {
    return (
        <form 
            onSubmit={async (e) => {
                e.preventDefault();
                const success = await handleSubmit(e);
                if (success) {
                    setEmail('');
                    setPassword('');
                }
            }} 
            className="space-y-4 flex flex-col justify-center items-center text-text w-full">
            <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-white/10 bg-slate-900/40 rounded-2xl focus:outline-none w-full"
            />
            <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-white/10 bg-slate-900/40 rounded-2xl focus:outline-none w-full"
            />
            <div className="mt-4 flex flex-col justify-center items-center w-full gap-4">
                <button
                    className="px-4 py-2 bg-violet-500 rounded-full cursor-pointer"
                    type="submit"
                >
                    Login
                </button>
                <p
                    className="text-sm cursor-pointer hover:text-violet-500"
                    onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
                >
                    {formType === 'login' ? 'No account? Register here.' : 'Already a member? Login'}
                </p>
            </div>
        </form>
    )
}

export default SignInForm;