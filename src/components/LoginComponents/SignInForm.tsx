const SignInForm = ({
    email, setEmail, password, setPassword, handleSubmit, formType, setFormType
}: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    formType: 'login' | 'register';
    setFormType: (formType: 'login' | 'register') => void;
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center text-text bg-slate-800/60 border-[1px] border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-2/6">
            <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="my-4 p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none"
            />
            <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="my-4 p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none"
            />
            <button
                className="p-2 bg-green-500 rounded cursor-pointer"
                type="submit"
            >
                Login
            </button>
            <button
                className="mt-4 p-2 bg-blue-500 rounded cursor-pointer"
                type="button"
                onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
            >
                {formType === 'login' ? 'No account? Register here.' : 'Already a member? Login'}
            </button>
        </form>
    )
}

export default SignInForm;