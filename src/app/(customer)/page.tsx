
export default function CustomerHome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-green-50">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Placeholder for the logo to verify Next.js Image component works */}
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-green-600 bg-white flex items-center justify-center">
          <span className="text-green-800 font-bold text-xl">Nutri Delight<br/>Logo Placeholder</span>
        </div>
        
        <h1 className="text-4xl font-bold text-green-900 tracking-tight">
          Welcome to Nutri Delight
        </h1>
        
        <p className="text-lg text-green-700">
          Making Bhimavaram Healthy
        </p>

        <div className="pt-8">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
