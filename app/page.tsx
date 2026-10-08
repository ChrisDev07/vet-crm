import RegistroForm from '@/components/forms/RegistroForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            CRM MVZ
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Recepción Veterinaria - Gestión de Oportunidades
          </p>
        </div>
        
        {/* Renderizamos el formulario que acabamos de crear */}
        <RegistroForm />
      </div>
    </main>
  );
}
