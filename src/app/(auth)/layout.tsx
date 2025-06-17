function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
        {children}
      </section>
    </main>
  );
}

export default AuthPage;
