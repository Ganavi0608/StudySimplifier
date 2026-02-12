export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50">
      
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-teal-600">StudySimplify</h2>
          <button
            onClick={onGetStarted}
            className="text-slate-700 hover:text-teal-600 font-medium">
            Sign In
          </button>
        </div>
      </nav>

   
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Study Smarter, Not Harder
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Turn those endless PDFs and lecture notes into bite-sized summaries. 
            Built by a student, for students who actually want to understand their material.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Get it Free →
          </button>
          
        </div>

      
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
           
            <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Summaries</h3>
            <p className="text-slate-600 leading-relaxed">
              Paste your notes and get the main points in seconds. Perfect for last-minute cramming.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Insights</h3>
            <p className="text-slate-600 leading-relaxed">
              Know exactly how long to study and what to focus on. No more guessing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Stay Organized</h3>
            <p className="text-slate-600 leading-relaxed">
              All your study materials in one place. Access them anytime, anywhere.
            </p>
          </div>
        </div>
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to ace your exams?
          </h2>
          <button
            onClick={onGetStarted}
            className="bg-emerald-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Get Started Free
          </button>
        </div>
      </div>

      <footer className="bg-slate-900 text-white py-8 mt-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">@studySimplifier</p>
        </div>
      </footer>
    </div>
  );
}
