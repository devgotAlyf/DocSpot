import React from 'react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <section className="mt-8 sm:mx-10 md:mx-14 lg:mx-12 my-20 relative overflow-hidden bg-[#008F82] rounded-xl lg:rounded-xl shadow-2xl min-h-[450px] flex items-center">
            {/* Background Decoration */}
            <div className="absolute inset-0 abstract-pattern pointer-events-none opacity-40"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00685e] rounded-full blur-[120px] opacity-20"></div>

            <div className="relative z-10 w-full px-8 py-16 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Content Side */}
                <div className="lg:col-span-7 space-y-8 text-center md:text-left">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
                            Ready to prioritize your health?
                        </h1>
                        <p className="text-lg lg:text-xl text-teal-100 max-w-xl leading-relaxed mx-auto md:mx-0">
                            Join thousands of patients who have found their perfect healthcare partner on DocSpot.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <button 
                            onClick={() => { navigate('/login'); window.scrollTo(0, 0) }} 
                            className="bg-white text-[#008F82] font-bold py-4 px-10 rounded-full hover:bg-teal-50 transition-all scale-100 hover:scale-105 active:scale-95 shadow-lg">
                            Create your account
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 pt-6">
                        <div className="flex items-center gap-2 text-white/90">
                            <span className="w-6 h-6 flex justify-center items-center bg-teal-100/20 rounded-full text-xs">✓</span>
                            <span className="text-sm font-semibold tracking-wide">HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90">
                            <span className="w-6 h-6 flex justify-center items-center bg-teal-100/20 rounded-full text-xs">★</span>
                            <span className="text-sm font-semibold tracking-wide">5-Star Rated</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90">
                            <span className="w-6 h-6 flex justify-center items-center bg-teal-100/20 rounded-full text-xs">🎧</span>
                            <span className="text-sm font-semibold tracking-wide">24/7 Support</span>
                        </div>
                    </div>
                </div>

                {/* Stats Side (Asymmetric Layout) */}
                <div className="lg:col-span-5 relative flex justify-center lg:justify-end hidden md:flex">
                    <div className="relative w-full max-w-sm aspect-square hidden lg:block">
                        {/* Stat Card 1 */}
                        <div className="absolute top-10 -left-10 p-8 rounded-xl w-52 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 bg-white/10 backdrop-blur-xl border border-white/20">
                            <h3 className="text-white text-4xl font-bold">1M+</h3>
                            <p className="text-teal-100 text-sm font-medium uppercase tracking-widest mt-2">Patients</p>
                        </div>
                        
                        {/* Stat Card 2 */}
                        <div className="absolute bottom-16 right-0 p-8 rounded-xl w-56 shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-500 bg-white/10 backdrop-blur-xl border border-white/20">
                            <h3 className="text-white text-4xl font-bold">500+</h3>
                            <p className="text-teal-100 text-sm font-medium uppercase tracking-widest mt-2">Specialists</p>
                        </div>
                        
                        {/* Decorative Abstract Sphere */}
                        <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-white/20 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner