import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Wrench, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  RefreshCw,
  Facebook,
  Share2,
  ShieldCheck,
  Zap,
  Check,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { LicensePlate } from './components/LicensePlate';
import { generateFacebookPost, GeneratedPost } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [kenteken, setKenteken] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('Sloopauto');
  const [location, setLocation] = useState('Heel Nederland');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  
  const imageRef = useRef<HTMLDivElement>(null);

  const templates = [
    { name: 'Klassiek Groen', id: 'classic' },
    { name: 'Donker Modern', id: 'dark' },
    { name: 'Opvallend Geel', id: 'yellow' },
    { name: 'Professioneel Blauw', id: 'blue' },
    { name: 'Minimalistisch', id: 'minimal' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const post = await generateFacebookPost({
        brand: brand || 'Onbekend merk',
        model: model || 'Onbekend model',
        year: year || 'Onbekend jaar',
        condition,
        location
      });
      setGeneratedPost(post);
    } catch (error) {
      alert('Er is iets misgegaan bij het genereren van de post. Probeer het opnieuw.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPost) return;
    const text = `${generatedPost.headline}\n\n${generatedPost.body}\n\n${generatedPost.cta}\n\n${generatedPost.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async (format: 'png' | 'jpg') => {
    if (!imageRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = format === 'png' 
        ? await toPng(imageRef.current, { cacheBust: true, quality: 1, pixelRatio: 2 })
        : await toJpeg(imageRef.current, { cacheBust: true, quality: 0.95, pixelRatio: 2 });
      
      const link = document.createElement('a');
      link.download = `sloopauto-post-${brand || 'auto'}-${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
      alert('Downloaden mislukt. Probeer het opnieuw.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 md:px-10 md:py-6 border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
            <Car className="text-white w-5 h-5" />
          </div>
          <div className="text-xl font-extrabold tracking-tight">
            <span className="text-text-dark">Sloopauto</span>
            <span className="text-primary-green">verkopen.</span>
          </div>
        </div>
        <nav className="hidden lg:block">
          <ul className="flex gap-8 text-sm font-medium text-text-gray">
            <li><a href="#" className="hover:text-text-dark transition-colors">Sloopauto verkopen</a></li>
            <li><a href="#" className="hover:text-text-dark transition-colors">Auto verkopen</a></li>
            <li><a href="#" className="hover:text-text-dark transition-colors">Blog</a></li>
          </ul>
        </nav>
        <button className="bg-text-dark text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-black transition-all active:scale-95">
          Direct verkopen
        </button>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-20 grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="text-primary-green text-xs font-bold tracking-[0.2em] uppercase">
              AI Post Generator
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.1]">
              Maak de perfecte <br />
              <span className="text-primary-green">Facebook post.</span>
            </h1>
            <p className="text-text-gray text-lg max-w-md">
              Vul de details van de auto in en onze AI genereert direct een professionele advertentie voor je Facebook pagina.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-black/5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-green" />
                Kenteken (optioneel)
              </label>
              <LicensePlate value={kenteken} onChange={setKenteken} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                  <Car className="w-4 h-4 text-text-gray" />
                  Merk
                </label>
                <input 
                  type="text" 
                  placeholder="Bijv. Volkswagen"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-text-gray" />
                  Model
                </label>
                <input 
                  type="text" 
                  placeholder="Bijv. Golf"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-gray" />
                  Bouwjaar
                </label>
                <input 
                  type="text" 
                  placeholder="Bijv. 2008"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-text-gray" />
                  Locatie
                </label>
                <input 
                  type="text" 
                  placeholder="Bijv. Utrecht"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                <Wrench className="w-4 h-4 text-text-gray" />
                Staat van de auto
              </label>
              <select 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all appearance-none"
              >
                <option>Sloopauto</option>
                <option>Schadeauto</option>
                <option>Defecte motor</option>
                <option>Zonder APK</option>
                <option>Export auto</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isGenerating}
              className={cn(
                "w-full bg-primary-green text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-primary-green/20",
                isGenerating ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0ca363]"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Genereren...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Post genereren
                </>
              )}
            </button>

            <div className="flex justify-center gap-6 text-[10px] font-bold text-text-gray uppercase tracking-widest pt-2">
              <div className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-orange-500" /> Snel</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-primary-green" /> Veilig</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-500" /> RDW Erkend</div>
            </div>
          </form>
        </motion.div>

        {/* Right Column: Preview */}
        <div className="lg:sticky lg:top-32">
          <AnimatePresence mode="wait">
            {!generatedPost ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                  <Facebook className="w-10 h-10 text-gray-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-text-dark">Geen post gegenereerd</h3>
                  <p className="text-text-gray max-w-[250px]">
                    Vul de gegevens links in om een professionele Facebook post te maken.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Facebook Mockup */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-black/5 overflow-hidden">
                  <div className="p-4 border-b border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                        <Car className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Sloopauto Verkopen</div>
                        <div className="text-[10px] text-text-gray flex items-center gap-1">
                          Gesponsord · <Share2 className="w-2 h-2" />
                        </div>
                      </div>
                    </div>
                    <button className="text-text-gray">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-xl font-extrabold text-text-dark leading-tight">
                      {generatedPost.headline}
                    </h4>
                    <p className="text-text-dark text-sm leading-relaxed whitespace-pre-wrap">
                      {generatedPost.body}
                    </p>
                    <p className="text-primary-green font-bold text-sm">
                      {generatedPost.cta}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {generatedPost.hashtags.map((tag, i) => (
                        <span key={i} className="text-blue-600 text-xs hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Preview (5 Templates) */}
                  <div className="px-6 mb-2 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {templates.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(i)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 border",
                          selectedTemplate === i 
                            ? "bg-primary-green text-white border-primary-green" 
                            : "bg-gray-50 text-text-gray border-black/5 hover:border-black/20"
                        )}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>

                  <div 
                    ref={imageRef}
                    className={cn(
                      "mx-6 mb-6 rounded-2xl overflow-hidden border border-black/5 relative aspect-video flex flex-col items-center justify-center p-8 text-center transition-all duration-500",
                      selectedTemplate === 0 && "bg-[#fafbfc]",
                      selectedTemplate === 1 && "bg-[#1a1a1a]",
                      selectedTemplate === 2 && "bg-[#ffcc00]",
                      selectedTemplate === 3 && "bg-[#f0f7ff]",
                      selectedTemplate === 4 && "bg-white"
                    )}
                  >
                    {/* Template 0: The Hero (High Impact) */}
                    {selectedTemplate === 0 && (
                      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-primary-green/10 rotate-12 rounded-[4rem]" />
                        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[80%] bg-primary-green/5 -rotate-12 rounded-[3rem]" />
                        
                        <div className="relative z-10 w-full max-w-md space-y-6">
                          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-black/5">
                            <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-dark">Snelste Inkoop van NL</span>
                          </div>
                          
                          <h2 className="text-5xl font-black tracking-tighter leading-[0.9] text-text-dark">
                            {brand} {model} <br />
                            <span className="text-primary-green">DIRECT GELD.</span>
                          </h2>
                          
                          <div className="flex justify-center py-2">
                            <div className="relative">
                              <div className="absolute -inset-4 bg-primary-green/20 blur-2xl rounded-full" />
                              <LicensePlate value={kenteken || 'AB-123-CD'} readOnly className="h-14 relative z-10" />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center gap-8 pt-4">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-green" />
                              </div>
                              <span className="text-[8px] font-bold uppercase text-text-gray">Gratis Ophalen</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-primary-green" />
                              </div>
                              <span className="text-[8px] font-bold uppercase text-text-gray">RDW Vrijwaring</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Template 1: Dark Premium (Canva Style) */}
                    {selectedTemplate === 1 && (
                      <div className="w-full h-full relative flex items-center justify-between px-12 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2a2a2a_0%,#1a1a1a_100%)]" />
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-green/10 skew-x-[-15deg] translate-x-1/4" />
                        
                        <div className="relative z-10 text-left space-y-4 max-w-[60%]">
                          <div className="h-1 w-12 bg-primary-green" />
                          <h2 className="text-4xl font-black tracking-tighter leading-tight text-white">
                            WIJ KOPEN UW <br />
                            <span className="text-primary-green italic">{brand} {model}</span>
                          </h2>
                          <p className="text-white/60 text-xs font-medium max-w-xs">
                            Ontvang binnen 24 uur het hoogste bod voor uw sloop- of schadeauto.
                          </p>
                          <div className="pt-4">
                            <LicensePlate value={kenteken || 'AB-123-CD'} readOnly className="h-12 border-white/20" />
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col gap-3">
                          <div className="w-24 h-24 rounded-full bg-primary-green flex flex-col items-center justify-center text-white shadow-lg shadow-primary-green/20 rotate-12">
                            <span className="text-[10px] font-bold uppercase leading-none">Vandaag</span>
                            <span className="text-2xl font-black leading-none">CASH</span>
                          </div>
                          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white -rotate-12 self-end">
                            <span className="text-[8px] font-bold uppercase">100%</span>
                            <span className="text-xs font-black">GRATIS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Template 2: The "Sold" Banner (High Conversion) */}
                    {selectedTemplate === 2 && (
                      <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-white" />
                        <div className="absolute top-0 left-0 w-full h-24 bg-primary-green -skew-y-3 origin-left -translate-y-8" />
                        
                        <div className="relative z-10 space-y-8">
                          <div className="space-y-2">
                            <h2 className="text-6xl font-black tracking-tighter text-text-dark leading-none">
                              {brand} <span className="text-primary-green">{model}</span>
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-px w-8 bg-black/10" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-gray">Direct Verkocht</span>
                              <div className="h-px w-8 bg-black/10" />
                            </div>
                          </div>
                          
                          <div className="relative inline-block">
                            <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg rotate-12 z-20">
                              €€€
                            </div>
                            <LicensePlate value={kenteken || 'AB-123-CD'} readOnly className="h-20 scale-110 shadow-2xl" />
                          </div>
                          
                          <div className="bg-text-dark text-white px-8 py-3 rounded-2xl font-black text-lg tracking-tight">
                            Binnen 30 minuten een bod!
                          </div>
                        </div>
                        
                        <div className="absolute bottom-6 flex gap-12 opacity-30 grayscale">
                          <span className="text-xs font-black">RDW ERKENNING</span>
                          <span className="text-xs font-black">ARN GECERTIFICEERD</span>
                          <span className="text-xs font-black">STIBA LID</span>
                        </div>
                      </div>
                    )}

                    {/* Template 3: Modern Split (Canva Grid) */}
                    {selectedTemplate === 3 && (
                      <div className="w-full h-full relative grid grid-cols-2 overflow-hidden">
                        <div className="bg-primary-green flex flex-col items-center justify-center p-8 text-white relative">
                          <div className="absolute top-4 left-4">
                            <Car className="w-8 h-8 opacity-20" />
                          </div>
                          <div className="space-y-4 text-left w-full">
                            <h2 className="text-5xl font-black tracking-tighter leading-[0.8]">
                              AUTO <br /> KWIJT?
                            </h2>
                            <p className="text-sm font-bold opacity-90">
                              Wij kopen elke {brand} {model} ongeacht de staat!
                            </p>
                            <div className="pt-4">
                              <div className="bg-white text-primary-green px-4 py-2 rounded-xl font-black text-sm inline-block shadow-lg">
                                BEL DIRECT: 0800-1234
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#f0f7ff] flex flex-col items-center justify-center p-8 relative">
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rotate-45 z-10" />
                          <div className="space-y-6 relative z-20">
                            <LicensePlate value={kenteken || 'AB-123-CD'} readOnly className="h-12 shadow-xl" />
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-left">
                                <div className="w-6 h-6 rounded-lg bg-primary-green text-white flex items-center justify-center shrink-0">
                                  <Check className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-text-dark uppercase">Direct Vrijwaringsbewijs</span>
                              </div>
                              <div className="flex items-center gap-3 text-left">
                                <div className="w-6 h-6 rounded-lg bg-primary-green text-white flex items-center justify-center shrink-0">
                                  <Check className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-text-dark uppercase">Contante Betaling</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Template 4: Social Proof / Quote (Clean & Trust) */}
                    {selectedTemplate === 4 && (
                      <div className="w-full h-full relative flex flex-col items-center justify-center p-12 bg-white overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                          <div className="grid grid-cols-6 gap-4 p-4">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <Car key={i} className="w-12 h-12" />
                            ))}
                          </div>
                        </div>
                        
                        <div className="relative z-10 space-y-8 max-w-lg">
                          <div className="flex justify-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Sparkles key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          
                          <blockquote className="text-2xl font-bold italic text-text-dark tracking-tight leading-tight">
                            "Binnen een uur was mijn {brand} {model} opgehaald en het geld stond direct op mijn rekening. Top service!"
                          </blockquote>
                          
                          <div className="flex flex-col items-center gap-4 pt-4">
                            <LicensePlate value={kenteken || 'AB-123-CD'} readOnly className="h-12 scale-90 opacity-50 grayscale" />
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-text-gray">
                                JD
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-black text-text-dark">Jan de Vries</div>
                                <div className="text-[10px] text-text-gray font-bold uppercase tracking-wider">Tevreden Klant</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facebook Actions */}
                  <div className="px-6 py-3 border-t border-black/5 flex justify-between text-text-gray text-xs font-bold">
                    <div className="flex gap-4">
                      <span>Vind ik leuk</span>
                      <span>Reageren</span>
                      <span>Delen</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className={cn(
                      "py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95",
                      copied ? "bg-green-100 text-green-700" : "bg-text-dark text-white hover:bg-black"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Gekopieerd!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Tekst kopiëren
                      </>
                    )}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => downloadImage('png')}
                      disabled={isDownloading}
                      className="flex-grow bg-white border border-black/10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 text-text-dark disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </button>
                    <button 
                      onClick={() => downloadImage('jpg')}
                      disabled={isDownloading}
                      className="flex-grow bg-white border border-black/10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 text-text-dark disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      JPG
                    </button>
                    <button 
                      onClick={() => setGeneratedPost(null)}
                      className="w-14 h-14 bg-white border border-black/10 rounded-full flex items-center justify-center text-text-gray hover:text-text-dark hover:border-black/20 transition-all active:scale-95 shadow-sm shrink-0"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-green rounded flex items-center justify-center">
              <Car className="text-white w-4 h-4" />
            </div>
            <div className="text-lg font-bold tracking-tight">
              <span className="text-text-dark">Sloopauto</span>
              <span className="text-primary-green">verkopen.</span>
            </div>
          </div>
          <div className="flex gap-8 text-xs font-bold text-text-gray uppercase tracking-widest">
            <span>RDW Erkend</span>
            <span>ARN Gecertificeerd</span>
            <span>STIBA Lid</span>
          </div>
          <div className="text-text-gray text-xs">
            © 2026 Sloopauto Post Generator. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
