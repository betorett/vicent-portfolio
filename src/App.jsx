import React, { useState, useEffect, useRef } from 'react';
import { User, BookOpen, Cpu, Code, Mail, GraduationCap, Moon, Sun, FileText, Database, Linkedin, ExternalLink } from 'lucide-react';

// --- COMPONENTE DE FONDO INTERACTIVO (GRAFOS) ---
const NetworkBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let w, h;
    let particles = [];
    
    // Configuración
    const particleCount = 60; 
    const connectionDistance = 140;
    const mouseDistance = 180; 

    // Estado del ratón
    const mouse = { x: null, y: null };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    // Clase Partícula
    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5; 
        this.vy = (Math.random() - 0.5) * 0.5; 
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? 'rgba(148, 163, 184, 0.5)' : 'rgba(71, 85, 105, 0.5)'; 
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = darkMode ? `rgba(148, 163, 184, ${1 - distance/connectionDistance})` : `rgba(71, 85, 105, ${1 - distance/connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        if (mouse.x != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                ctx.beginPath();
                ctx.strokeStyle = darkMode ? `rgba(56, 189, 248, ${1 - distance/mouseDistance})` : `rgba(37, 99, 235, ${1 - distance/mouseDistance})`; 
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

// --- COMPONENTE PRINCIPAL ---
const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  const userData = {
    name: "Vicent Betoret",
    title: "Estudiante de Ingeniería Mecánica",
    tagline: "Nacido en Torreblanca (Castellón). Apasionado por el aprendizaje continuo.",
    about: "Nací en Torreblanca (Castellón) en 2006. Actualmente soy estudiante de segundo curso de Ingeniería Mecánica en la Universitat Politècnica de València (UPV). Me considero una persona curiosa, organizada y centrada en mis objetivos académicos y profesionales.",
    location: "Valencia / Torreblanca, España",
    email: "vicentbetoret06@gmail.com",
    // URL CORRECTA DE LINKEDIN AÑADIDA:
    linkedin: "https://www.linkedin.com/in/vicent-betoret-17aa89385/", 
    skills: [
      { name: "Diseño CAD", level: 80 },
      { name: "Ofimática", level: 90 },
      { name: "Notion", level: 95 },
    ],
    interests: [
      { icon: <Cpu size={20} />, label: "Tecnología" },
      { icon: <BookOpen size={20} />, label: "Lectura" },
      { icon: <Database size={20} />, label: "Productividad (Notion)" },
    ]
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* FONDO INTERACTIVO */}
      <NetworkBackground darkMode={darkMode} />

      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <User className="text-blue-500" />
            <span>VICENT <span className="text-blue-500">BETORET</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
          
        {/* Hero Section */}
        <header className="relative pt-20 pb-24 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 z-10">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Vicent <br />
                <span className="text-blue-500">Betoret</span>
                </h1>
                <h2 className={`text-2xl md:text-3xl font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {userData.title}
                </h2>
                <p className={`text-lg max-w-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {userData.tagline}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                      href={`mailto:${userData.email}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                  >
                      <Mail size={18} /> Contactar
                  </a>
                  {/* Botón LinkedIn */}
                  <a 
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 border ${darkMode ? 'border-slate-600 hover:bg-slate-800 hover:border-blue-400' : 'border-slate-300 hover:bg-slate-100 hover:border-blue-400'}`}
                  >
                      <Linkedin size={18} className="text-blue-500"/> LinkedIn
                  </a>
                </div>
            </div>
            
            {/* Photo Placeholder Area */}
            <div className="relative z-10 flex justify-center">
                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 relative overflow-hidden shadow-2xl ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-white bg-white'}`}>
                
                <img 
                    src="/foto.jpg" 
                    alt="Vicent Betoret" 
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'}} 
                />
                {/* Fallback */}
                <div className="hidden absolute inset-0 flex-col items-center justify-center text-slate-500 bg-slate-200 dark:bg-slate-800">
                    <User size={64} className="mb-4 opacity-50" />
                    <span className="text-sm font-mono">Foto de Vicent</span>
                </div>

                </div>
            </div>
            </div>
        </header>

        {/* Main Content Grid */}
        <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">

            {/* About Section */}
            <section className={`grid md:grid-cols-3 gap-12 p-8 rounded-3xl border backdrop-blur-sm ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-white'}`}>
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                Sobre Mí
                </h2>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {userData.about}
                </p>
            </div>
            
            {/* Intereses */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold">Intereses</h3>
                <div className="grid grid-cols-1 gap-4">
                {userData.interests.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-lg flex items-center gap-4 transition ${darkMode ? 'bg-slate-800/80' : 'bg-white/80 shadow-sm'}`}>
                    <div className="text-blue-500">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Education & Skills */}
            <section className="grid md:grid-cols-2 gap-16">
            {/* Timeline */}
            <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <GraduationCap className="text-blue-500" />
                Formación
                </h2>
                <div className="relative border-l-2 border-slate-700 ml-3 space-y-10">
                
                <div className="relative pl-8">
                    <span className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-slate-900"></span>
                    <span className="text-sm text-blue-400 font-mono">2024 - Presente</span>
                    <h3 className="text-xl font-bold mt-1">Grado en Ingeniería Mecánica</h3>
                    <p className="text-slate-500">Universitat Politècnica de València (UPV)</p>
                    <p className="mt-1 text-sm opacity-80">2º Curso.</p>
                </div>

                <div className="relative pl-8">
                    <span className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-slate-600"></span>
                    <span className="text-sm font-mono opacity-60">Anterior</span>
                    <h3 className="text-xl font-bold mt-1">Bachillerato</h3>
                    <p className="text-slate-500">IES Maestrat (Sant Mateu)</p>
                </div>

                <div className="relative pl-8">
                    <span className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-green-500"></span>
                    <h3 className="text-xl font-bold mt-1">Idiomas</h3>
                    <p className="text-slate-500">Inglés: Nivel B2 (Certificado Cambridge)</p>
                </div>

                </div>
            </div>

            {/* Skills Bars */}
            <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Code className="text-blue-500" />
                Competencias
                </h2>
                <div className="space-y-6">
                {userData.skills.map((skill, index) => (
                    <div key={index}>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs font-mono opacity-60">{skill.level > 85 ? 'Alto' : 'Medio'}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 relative"
                        style={{ width: `${skill.level}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Formulario Notion */}
            <section className={`p-8 rounded-2xl border overflow-hidden backdrop-blur-md ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200 shadow-lg'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Buzón a Notion</h3>
                        <p className="text-sm opacity-60">Envíame una nota o idea. Se guardará directamente en mi base de datos.</p>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg overflow-hidden">
                <iframe 
                    src="https://por-vicent.notion.site/ebd/1893236b043280b28d5ee332dbca8055" 
                    width="100%" 
                    height="600" 
                    frameBorder="0" 
                    allowFullScreen 
                    title="Formulario Notion"
                />
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 mt-12 border-t text-center ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className="text-xl font-bold tracking-tighter">VICENT <span className="text-blue-500">BETORET</span></h3>
                <div className="flex justify-center gap-6 mt-4 items-center">
                    <a href={`mailto:${userData.email}`} className="hover:text-blue-500 transition flex items-center gap-2">
                        <Mail size={16} /> Email
                    </a>
                    <span className="opacity-20">|</span>
                    <a 
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="hover:text-blue-500 transition flex items-center gap-2"
                    >
                        <Linkedin size={16} /> LinkedIn
                    </a>
                </div>
                <p className="text-sm opacity-40 mt-6">© {new Date().getFullYear()} Vicent Betoret. Construido con React.</p>
            </footer>

        </main>
      </div>
    </div>
  );
};

export default Portfolio;