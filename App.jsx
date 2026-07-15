import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Download, Link as LinkIcon, AlertCircle, CheckCircle, 
  RefreshCw, Play, Volume2, History, Trash2, ChevronDown, 
  Layers, Lock, Users, Star, Menu, X, ArrowRight, Shield, Zap, Info, Clock, MessageSquare
} from 'lucide-react';

const SAMPLE_LINKS = [
  { label: "YouTube Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { label: "Instagram Reel", url: "https://www.instagram.com/p/CgX942kJXy3/" },
  { label: "Spotify Track", url: "https://open.spotify.com/track/4PTG3Z6ehGkBF36qJkua6C" }
];

const YoutubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const SpotifyIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.31c-.21.34-.65.45-1 .24-2.82-1.73-6.38-2.12-10.56-1.17-.39.09-.79-.16-.88-.55-.09-.39.16-.79.55-.88 4.58-1.05 8.52-.61 11.66 1.31.33.2.44.65.23 1.05zm1.46-3.26c-.27.43-.83.57-1.26.3-3.23-1.99-8.15-2.56-11.96-1.4-1.16.35-1.43-.37-1.43-.37a1.056 1.056 0 0 1 .63-1.27c4.35-1.32 9.77-.69 13.51 1.62.43.26.57.82.3 1.25l-.79-.13zm.13-3.32c-3.88-2.3-10.28-2.51-14-1.39-.6.18-1.24-.17-1.42-.77-.18-.6.17-1.24.77-1.42 4.26-1.29 11.33-1.04 15.79 1.6.54.32.72 1.02.4 1.56-.32.54-1.02.72-1.56.42l.02.02z"/>
  </svg>
);

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [mediaDetails, setMediaDetails] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('mp4-1080p');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStepText, setDownloadStepText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [faqOpen, setFaqOpen] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', topic: 'General Inquiry' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const history = localStorage.getItem('glicks_history');
    if (history) {
      try { setDownloadHistory(JSON.parse(history)); } catch (e) {}
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const detectPlatform = (url) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return { name: 'YouTube Video', icon: 'youtube' };
    if (lower.includes('instagram.com')) return { name: 'Instagram Reels', icon: 'instagram' };
    if (lower.includes('spotify.com')) return { name: 'Spotify Music', icon: 'spotify' };
    return { name: 'Universal Link', icon: 'globe' };
  };

  const handleAnalyze = (e) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      showToast("Please enter a valid link.", "error");
      return;
    }
    const platformInfo = detectPlatform(urlInput);
    setIsProcessing(true);
    setMediaDetails(null);
    setIsCompleted(false);

    const steps = [
      "Connecting to stream servers...",
      "Bypassing geo-blocks...",
      "Extracting media file format..."
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setProcessStep(steps[step]);
        step++;
      } else {
        clearInterval(interval);
        setMediaDetails({
          title: "Extracted Premium Media File",
          platform: platformInfo?.name || 'Universal Source',
          platformType: platformInfo?.icon || 'globe',
          author: "@glicks_downloader",
          duration: "3:45",
          thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
          url: urlInput,
          formats: [
            { id: 'mp4-1080p', label: 'MP4 Video (1080p Full HD)', size: '45.2 MB', type: 'Video', quality: '1080p' },
            { id: 'mp3-320', label: 'MP3 Audio (320kbps High)', size: '8.4 MB', type: 'Audio', quality: '320kbps' }
          ]
        });
        setIsProcessing(false);
        showToast("Success! Formats loaded.", "success");
      }
    }, 800);
  };

  const startDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStepText("Downloading fragments...");

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setIsCompleted(true);
          showToast("Download Completed!", "success");
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans relative overflow-x-hidden">
      {/* Toast */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(t => (
          <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-blue-500/30 text-white flex gap-2 items-center">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div onClick={() => setActivePage('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
            <span className="text-xl font-bold tracking-tight">Glicks</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <button onClick={() => setActivePage('home')} className="hover:text-blue-400">Home</button>
            <button onClick={() => setActivePage('features')} className="hover:text-blue-400">Features</button>
            <button onClick={() => setActivePage('faq')} className="hover:text-blue-400">FAQ</button>
            <button onClick={() => setActivePage('contact')} className="hover:text-blue-400">Contact</button>
          </nav>
          <button onClick={() => showToast("App download started!", "success")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-all">Download App</button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {activePage === 'home' && (
          <div className="space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold">Download <span className="text-blue-400">Videos & Music</span> Instantly</h1>
              <p className="text-slate-400 text-sm md:text-base">Paste link from YouTube, Instagram, Spotify, and download instantly.</p>
            </div>

            {/* Input Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleAnalyze} className="p-2 bg-[#111827] border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 px-2 flex-1">
                  <LinkIcon className="text-blue-400 w-5 h-5" />
                  <input 
                    type="url" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste link here..." 
                    className="bg-transparent border-0 text-white w-full focus:outline-none"
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Analyse
                </button>
              </form>
              <div className="flex gap-2 justify-center mt-3 text-xs">
                {SAMPLE_LINKS.map((s, i) => (
                  <button key={i} type="button" onClick={() => setUrlInput(s.url)} className="text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-md border border-white/5">{s.label}</button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {isProcessing && (
              <div className="max-w-md mx-auto p-6 bg-[#111827] rounded-2xl border border-blue-500/20 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                <p className="text-sm text-blue-400">{processStep}</p>
              </div>
            )}

            {/* Media Details */}
            {mediaDetails && !isProcessing && (
              <div className="max-w-xl mx-auto p-6 bg-[#111827] rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-bold text-lg">{mediaDetails.title}</h3>
                <div className="space-y-2">
                  {mediaDetails.formats.map(f => (
                    <button 
                      key={f.id} 
                      onClick={() => setSelectedFormat(f.id)}
                      className={`w-full p-3 rounded-xl border text-left flex justify-between ${selectedFormat === f.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900/50'}`}
                    >
                      <span>{f.label}</span>
                      <span className="font-bold">{f.size}</span>
                    </button>
                  ))}
                </div>
                {!isDownloading && !isCompleted && (
                  <button onClick={startDownload} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2">Get Link</button>
                )}
                {isDownloading && (
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${downloadProgress}%` }}></div>
                    </div>
                    <p className="text-center text-xs text-slate-400">Progress: {downloadProgress}%</p>
                  </div>
                )}
                {isCompleted && (
                  <div className="text-center text-emerald-400 font-bold text-sm py-2">✓ Download Finished!</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Features Page */}
        {activePage === 'features' && (
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <h2 className="text-3xl font-extrabold">Features</h2>
            <p className="text-slate-400">Our downloader supports ultra-high resolutions, offers a pure design with absolute zero logs, and operates at extreme cloud-accelerated speeds.</p>
          </div>
        )}

        {/* FAQ Page */}
        {activePage === 'faq' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-center mb-6">FAQ</h2>
            <div className="p-4 bg-[#111827] rounded-xl border border-white/5">
              <h4 className="font-bold">Is this service free?</h4>
              <p className="text-slate-400 text-sm mt-2">Yes, Glicks is 100% free with no registration requirement.</p>
            </div>
          </div>
        )}

        {/* Contact Page */}
        {activePage === 'contact' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-center">Contact Us</h2>
            <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 p-6 bg-[#111827] rounded-xl border border-white/5">
              {contactSubmitted ? (
                <div className="text-emerald-400 font-bold text-center">Your message has been sent!</div>
              ) : (
                <>
                  <input type="text" placeholder="Name" required className="w-full p-3 bg-slate-900 border border-white/10 rounded-lg text-white" />
                  <textarea placeholder="Message" required className="w-full p-3 bg-slate-900 border border-white/10 rounded-lg text-white" rows="4"></textarea>
                  <button type="submit" className="w-full py-3 bg-blue-600 rounded-lg font-bold">Send Message</button>
                </>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© 2026 Glicks. Free Media Tools.</span>
          <div className="flex gap-4">
            <button onClick={() => setActivePage('privacy')} className="hover:text-white">Privacy Policy</button>
            <button onClick={() => setActivePage('terms')} className="hover:text-white">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
              }
