const SignUpForm = ({
    email, setEmail, username, setUsername, password, setPassword, confirmPassword, setConfirmPassword, handleSubmit, formType, setFormType
}: {
    email: string;
    setEmail: (email: string) => void;
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    formType: 'login' | 'register';
    setFormType: (formType: 'login' | 'register') => void;
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-center items-center text-text bg-slate-800/60 border-[1px] border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-2/6">
            <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none w-full"
            />
            <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none w-full"
            />
            <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none w-full"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none w-full"
            />
            <button
                className="px-4 py-2 bg-violet-500 rounded-xl cursor-pointer"
                type="submit"
            >
                Register
            </button>
            <p
                className="text-sm cursor-pointer hover:text-violet-600"
                onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
            >
                {formType === 'login' ? 'No account? Register here.' : 'Already a member? Login'}
            </p>
        </form>
    )
}

export default SignUpForm;