const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex h-screen w-screen items-center justify-center bg-background">
            {children}
        </main>
    )
}

export default AuthLayout