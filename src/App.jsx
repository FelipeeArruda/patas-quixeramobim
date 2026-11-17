import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  PlusCircle, 
  Dog, 
  Cat,
  Phone, 
  AlertTriangle, 
  Search, 
  Calendar, 
  Syringe, 
  User, 
  LogOut, 
  Lock, 
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  X,
  Filter,
  Megaphone,
  Check
} from 'lucide-react';

// Zonas Georreferenciadas do Mapa de Calor (Simulação Interativa de Alta Qualidade)
const INITIAL_HEAT_ZONES = [
  { id: 1, bairro: 'Centro', top: '48%', left: '46%', size: '130px', color: 'rgba(239, 68, 68, 0.65)', nivel: 'Crítico (Alta Concentração)', ocorrencias: 18 },
  { id: 2, bairro: 'Edmilson Correia de Vasconcelos', top: '58%', left: '56%', size: '150px', color: 'rgba(239, 68, 68, 0.65)', nivel: 'Crítico (Alta Concentração)', ocorrencias: 22 },
  { id: 3, bairro: 'Rodoviária', top: '35%', left: '38%', size: '110px', color: 'rgba(245, 158, 11, 0.6)', nivel: 'Média Concentração', ocorrencias: 11 },
  { id: 4, bairro: 'Sabonete', top: '38%', left: '30%', size: '100px', color: 'rgba(245, 158, 11, 0.6)', nivel: 'Média Concentração', ocorrencias: 9 },
  { id: 5, bairro: 'Pompéia', top: '70%', left: '28%', size: '90px', color: 'rgba(59, 130, 246, 0.55)', nivel: 'Baixa / Monitoramento', ocorrencias: 4 },
  { id: 6, bairro: 'Entorno da Barragem', top: '28%', left: '55%', size: '120px', color: 'rgba(239, 68, 68, 0.6)', nivel: 'Crítico (Descarte Recorrente)', ocorrencias: 15 }
];

export default function App() {
  // Estado de Autenticação (Simula Login Google)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('patas_quixeramobim_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('mapa');

  // Modais de Cadastro (Usuários Logados)
  const [showModalAdocao, setShowModalAdocao] = useState(false);
  const [showModalPerdido, setShowModalPerdido] = useState(false);
  const [showModalMural, setShowModalMural] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  // Notificação Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Data Sources (Catálogos Dinâmicos)
  const [animaisAdocao, setAnimaisAdocao] = useState([
    {
      id: 1,
      nome: 'Thor',
      especie: 'Cão',
      raca: 'Vira-lata (SRD)',
      cor: 'Caramelo',
      porte: 'Médio',
      idade: '1 ano',
      bairro: 'Centro',
      saude: 'Vacinado, Castrado e Vermifugado',
      tutor: 'Maria Socorro',
      contato: '5588999999999',
      foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 2,
      nome: 'Mimi',
      especie: 'Gato',
      raca: 'Siamês Mestiço',
      cor: 'Branco e Creme',
      porte: 'Pequeno',
      idade: '6 meses',
      bairro: 'Edmilson Correia',
      saude: 'Vermifugada e Castrada',
      tutor: 'ONG Patas Amigas QXB',
      contato: '5588988887777',
      foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 3,
      nome: 'Rex',
      especie: 'Cão',
      raca: 'Pastor Alemão Mestiço',
      cor: 'Preto e Castanho',
      porte: 'Grande',
      idade: '2 anos',
      bairro: 'Sabonete',
      saude: 'Castrado. Em tratamento de pele controlado',
      tutor: 'Marcos Silva',
      contato: '5588977776666',
      foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500'
    }
  ]);

  const [animaisPerdidos, setAnimaisPerdidos] = useState([
    {
      id: 1,
      nomeAnimal: 'Bob',
      especie: 'Cão',
      raca: 'Poodle',
      cor: 'Branco',
      porte: 'Pequeno',
      bairroSumico: 'Bairro Jaime Lopes',
      dataSumico: '05/11/2026',
      descricao: 'Usa coleira azul. Faltam alguns dentes frontais.',
      dono: 'Fernanda Oliveira',
      contatoDono: '5588988889999',
      foto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500'
    }
  ]);

  const [pedidosMural, setPedidosMural] = useState([
    {
      id: 1,
      usuarioNome: 'Ana Paula Nobre',
      usuarioEmail: 'anapaula@gmail.com',
      especieDesejada: 'Gato',
      porteDesejado: 'Pequeno',
      racaPreferencial: 'Fêmea Filhote ou Castrada',
      bairroMoradia: 'Centro',
      descricao: 'Procuro uma gatinha fêmea dócil para fazer companhia para minha mãe idosa. Temos quintal fechado.',
      contato: '5588994433221',
      dataPostagem: '07/11/2026'
    }
  ]);

  // Filtros
  const [filtroEspecie, setFiltroEspecie] = useState('Todos');
  const [filtroPorte, setFiltroPorte] = useState('Todos');
  const [filtroBusca, setFiltroBusca] = useState('');

  // Form States
  const [formAdocao, setFormAdocao] = useState({
    nome: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', idade: '', bairro: 'Centro', saude: '', contato: '', foto: ''
  });

  const [formPerdido, setFormPerdido] = useState({
    nomeAnimal: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', bairroSumico: 'Centro', dataSumico: '', descricao: '', contatoDono: '', foto: ''
  });

  const [formMural, setFormMural] = useState({
    especieDesejada: 'Cão', porteDesejado: 'Médio', racaPreferencial: '', bairroMoradia: 'Centro', descricao: '', contato: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoginGoogle = () => {
    const fakeGoogleUser = {
      uid: 'google-uid-' + Date.now(),
      displayName: 'Marcos Felipe',
      email: 'felipe.aluno@unicatolica.edu.br',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      role: 'Protetor Verificado'
    };
    setUser(fakeGoogleUser);
    try {
      localStorage.setItem('patas_quixeramobim_user', JSON.stringify(fakeGoogleUser));
    } catch (e) {}
    showToast('🚀 Autenticado via Google com sucesso!');
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('patas_quixeramobim_user');
    } catch (e) {}
    showToast('Sessão encerrada.');
  };

  const handleSubmitAdocao = (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formAdocao,
      id: Date.now(),
      tutor: user.displayName,
      foto: formAdocao.foto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500'
    };
    setAnimaisAdocao([novo, ...animaisAdocao]);
    setShowModalAdocao(false);
    setFormAdocao({ nome: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', idade: '', bairro: 'Centro', saude: '', contato: '', foto: '' });
    showToast('✅ Animal cadastrado no catálogo de adoção!');
    setActiveTab('adocao');
  };

  const handleSubmitPerdido = (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formPerdido,
      id: Date.now(),
      dono: user.displayName,
      foto: formPerdido.foto || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500'
    };
    setAnimaisPerdidos([novo, ...animaisPerdidos]);
    setShowModalPerdido(false);
    setFormPerdido({ nomeAnimal: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', bairroSumico: 'Centro', dataSumico: '', descricao: '', contatoDono: '', foto: '' });
    showToast('🚨 Alerta de animal perdido postado!');
    setActiveTab('perdidos');
  };

  const handleSubmitMural = (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formMural,
      id: Date.now(),
      usuarioNome: user.displayName,
      usuarioEmail: user.email,
      dataPostagem: new Date().toLocaleDateString('pt-BR')
    };
    setPedidosMural([novo, ...pedidosMural]);
    setShowModalMural(false);
    setFormMural({ especieDesejada: 'Cão', porteDesejado: 'Médio', racaPreferencial: '', bairroMoradia: 'Centro', descricao: '', contato: '' });
    showToast('📢 Seu pedido foi publicado no Mural!');
    setActiveTab('eventos');
  };

  const animaisFiltrados = animaisAdocao.filter(a => {
    const matchEspecie = filtroEspecie === 'Todos' || a.especie === filtroEspecie;
    const matchPorte = filtroPorte === 'Todos' || a.porte === filtroPorte;
    const matchSearch = a.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
                        a.raca.toLowerCase().includes(filtroBusca.toLowerCase()) ||
                        a.cor.toLowerCase().includes(filtroBusca.toLowerCase()) ||
                        a.bairro.toLowerCase().includes(filtroBusca.toLowerCase());
    return matchEspecie && matchPorte && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-emerald-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-700 p-2.5 rounded-2xl border border-emerald-600 shadow-inner">
              <Dog className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight flex items-center gap-2">
                Patas de Quixeramobim
                <span className="bg-emerald-900 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-700 uppercase tracking-widest">TCC SI</span>
              </h1>
              <p className="text-xs text-emerald-200">Plataforma de Mapeamento Térmico e Adoção Responsável (Quixeramobim-CE)</p>
            </div>
          </div>

          {/* Autenticação Google */}
          <div>
            {user ? (
              <div className="flex items-center gap-3 bg-emerald-900/80 p-1.5 pr-3 rounded-full border border-emerald-700">
                <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">{user.displayName}</p>
                  <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Sair"
                  className="p-1.5 bg-emerald-800 hover:bg-red-600 text-emerald-200 hover:text-white rounded-full transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginGoogle}
                className="bg-white hover:bg-emerald-50 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 border border-slate-200"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Entrar com Google
              </button>
            )}
          </div>
        </div>

        {/* NAVEGAÇÃO POR ABAS */}
        <div className="bg-emerald-900/90 border-t border-emerald-700/60">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-1">
            <button 
              onClick={() => setActiveTab('mapa')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'mapa' ? 'bg-emerald-600 text-white' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <MapPin className="w-4 h-4 text-emerald-300" /> 🔥 Mapa Térmico
            </button>
            <button 
              onClick={() => setActiveTab('adocao')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'adocao' ? 'bg-emerald-600 text-white' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Heart className="w-4 h-4 text-pink-300" /> 🐶 Adoção Responsável
            </button>
            <button 
              onClick={() => setActiveTab('perdidos')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'perdidos' ? 'bg-emerald-600 text-white' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" /> 🔍 Achados e Perdidos
            </button>
            <button 
              onClick={() => setActiveTab('eventos')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'eventos' ? 'bg-emerald-600 text-white' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Megaphone className="w-4 h-4 text-cyan-300" /> 📢 Mural & Vacinação
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* STATUS DE PERMISSÕES */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${user ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {user ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {user ? `Sessão Autenticada (${user.displayName})` : 'Modo Visitante (Visualização)'}
              </h3>
              <p className="text-xs text-slate-500">
                {user 
                  ? 'Você possui permissões ativas: Pode cadastrar animais para adoção, postar alertas e interagir no mural.' 
                  : 'Faça login com sua conta do Google para liberar o cadastro de animais, postagens e interações.'}
              </p>
            </div>
          </div>

          {user ? (
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowModalAdocao(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <PlusCircle className="w-4 h-4" /> Cadastrar Adoção
              </button>
              <button 
                onClick={() => setShowModalMural(true)}
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <MessageSquare className="w-4 h-4" /> Quero Adotar (Postar)
              </button>
              <button 
                onClick={() => setShowModalPerdido(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <AlertTriangle className="w-4 h-4" /> Alerta de Perdido
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLoginGoogle}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Entrar para Interagir
            </button>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* ABA 1: MAPA TÉRMICO INTERATIVO DE QUIXERAMOBIM */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'mapa' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  Mapeamento Georreferenciado de Abandono Urbano
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualização gráfica por manchas térmicas de calor representando áreas críticas em Quixeramobim-CE.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Crítico</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Moderado</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Baixo</div>
              </div>
            </div>

            {/* Simulação Visual de Mapa com SVG e Manchas Térmicas de Calor */}
            <div className="h-[520px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-300 bg-slate-800 relative">
              {/* SVG Fundo do Mapa Urbano */}
              <svg className="w-full h-full opacity-40 stroke-slate-500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Linhas simulando a malha viária de Quixeramobim */}
                <path d="M 0 260 Q 300 240 700 280 T 1200 260" fill="none" stroke="#64748b" strokeWidth="8" />
                <path d="M 450 0 Q 480 300 460 600" fill="none" stroke="#64748b" strokeWidth="6" />
                <path d="M 200 100 Q 500 200 800 450" fill="none" stroke="#475569" strokeWidth="4" />
              </svg>

              {/* Rótulo Central de Quixeramobim */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-emerald-400">Município de Quixeramobim - CE</p>
                <p className="text-[11px] text-slate-300">Coordenadas: 5.1979° S, 39.2925° W</p>
                <p className="text-[10px] text-slate-400 mt-1">Clique nos pontos de calor para ver dados do bairro</p>
              </div>

              {/* Camadas Térmicas (Heat Circles) */}
              {INITIAL_HEAT_ZONES.map(z => (
                <div 
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    top: z.top,
                    left: z.left,
                    width: z.size,
                    height: z.size,
                    backgroundColor: z.color,
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(16px)'
                  }}
                  className="absolute rounded-full cursor-pointer hover:scale-125 transition duration-300 animate-pulse"
                />
              ))}

              {/* Marcadores de Referência dos Bairros */}
              {INITIAL_HEAT_ZONES.map(z => (
                <div 
                  key={'pin-' + z.id}
                  onClick={() => setSelectedZone(z)}
                  style={{ top: z.top, left: z.left, transform: 'translate(-50%, -50%)' }}
                  className="absolute cursor-pointer flex flex-col items-center group z-20"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-700 mt-1 whitespace-nowrap">
                    {z.bairro} ({z.ocorrencias})
                  </span>
                </div>
              ))}
            </div>

            {/* Painel do Bairro Selecionado */}
            {selectedZone && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-emerald-400">Bairro: {selectedZone.bairro}</h4>
                  <p className="text-xs text-slate-300">Nível de Abandono: <strong>{selectedZone.nivel}</strong> | Ocorrências: <strong>{selectedZone.ocorrencias} relatos</strong></p>
                </div>
                <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1 rounded-lg">
                  Fechar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ABA 2: CATÁLOGO DE ADOÇÃO RESPONSÁVEL */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'adocao' && (
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-700" />
                  Filtrar Animais Disponíveis
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  {animaisFiltrados.length} Animais Encontrados
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Buscar por raça, cor, bairro..."
                    value={filtroBusca}
                    onChange={e => setFiltroBusca(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select 
                  value={filtroEspecie} 
                  onChange={e => setFiltroEspecie(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Todos">Todas as Espécies</option>
                  <option value="Cão">Cães</option>
                  <option value="Gato">Gatos</option>
                </select>

                <select 
                  value={filtroPorte} 
                  onChange={e => setFiltroPorte(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Todos">Todos os Portes</option>
                  <option value="Pequeno">Pequeno Porte</option>
                  <option value="Médio">Médio Porte</option>
                  <option value="Grande">Grande Porte</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animaisFiltrados.map(a => (
                <div key={a.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="relative">
                      <img src={a.foto} alt={a.nome} className="w-full h-52 object-cover" />
                      <span className="absolute top-3 right-3 bg-emerald-800 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        {a.especie}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-900">{a.nome}</h3>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border">
                          {a.porte}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600"><strong>Raça:</strong> {a.raca}</p>
                      <p className="text-xs text-slate-600"><strong>Cor:</strong> {a.cor} | <strong>Idade:</strong> {a.idade}</p>
                      <p className="text-xs text-slate-600"><strong>Bairro:</strong> {a.bairro} (Quixeramobim)</p>
                      <p className="text-xs text-slate-600"><strong>Tutor:</strong> {a.tutor}</p>
                      
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-2">
                        <strong>Saúde / Vacinas:</strong> {a.saude}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a 
                      href={`https://wa.me/${a.contato}?text=Olá!%20Vi%20o%20anúncio%20do(a)%20${a.nome}%20no%20sistema%20Patas%20de%20Quixeramobim%20e%20gostaria%20de%20adotar.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
                    >
                      <Phone className="w-4 h-4" /> Falar no WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ABA 3: ACHADOS E PERDIDOS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'perdidos' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Mural de Animais Desaparecidos
                </h2>
                <p className="text-xs text-slate-500">Ajude os tutores de Quixeramobim a localizarem seus pets fugidos.</p>
              </div>

              {user ? (
                <button 
                  onClick={() => setShowModalPerdido(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow"
                >
                  <PlusCircle className="w-4 h-4" /> Reportar Animal Perdido
                </button>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold">
                  Faça login para postar um animal sumido
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animaisPerdidos.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-red-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative">
                      <img src={p.foto} alt={p.nomeAnimal} className="w-full h-52 object-cover" />
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow tracking-wider">
                        PROCURA-SE
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">{p.nomeAnimal}</h3>
                      <p className="text-xs text-slate-600"><strong>Espécie / Raça:</strong> {p.especie} ({p.raca})</p>
                      <p className="text-xs text-slate-600"><strong>Cor / Porte:</strong> {p.cor} | {p.porte}</p>
                      <p className="text-xs text-slate-600"><strong>Visto em:</strong> {p.bairroSumico}</p>
                      <p className="text-xs text-slate-600"><strong>Data do Sumiço:</strong> {p.dataSumico}</p>
                      <p className="text-xs text-slate-600"><strong>Tutor:</strong> {p.dono}</p>
                      <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-xs text-red-900">
                        <strong>Relato:</strong> {p.descricao}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a 
                      href={`https://wa.me/${p.contatoDono}?text=Olá!%20Tenho%20informações%20sobre%20o%20animal%20perdido%20${p.nomeAnimal}.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
                    >
                      <Phone className="w-4 h-4" /> Enviar Notícia pelo WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ABA 4: MURAL DA COMUNIDADE & EVENTOS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'eventos' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 border-b pb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base">Feiras de Adoção em Quixeramobim</h3>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1">
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded">CONFIRMADO</span>
                  <h4 className="font-bold text-sm text-emerald-950">1ª Feira Municipal de Adoção Responsável</h4>
                  <p className="text-xs text-emerald-800"><strong>Data:</strong> 20 de Novembro de 2026 (08:00 às 12:00)</p>
                  <p className="text-xs text-emerald-800"><strong>Local:</strong> Praça da Matriz - Quixeramobim</p>
                  <p className="text-xs text-slate-600 mt-2">Presença de protetores independentes e ONGs locais com animais vacinados.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-800 border-b pb-2">
                  <Syringe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base">Vacinação Gratuita na Cidade</h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-1">
                  <span className="bg-blue-200 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded">CAMPANHA PÚBLICA</span>
                  <h4 className="font-bold text-sm text-blue-950">Campanha Antirrábica Gratuita</h4>
                  <p className="text-xs text-blue-800"><strong>Período:</strong> 12 a 15 de Novembro de 2026</p>
                  <p className="text-xs text-blue-800"><strong>Pontos:</strong> Postos de Saúde (Sabonete, Centro e Edmilson Correia)</p>
                  <p className="text-xs text-slate-600 mt-2">Traga seu pet com guia ou caixa de transporte. Gratuito para toda a população.</p>
                </div>
              </div>

            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-700" />
                    Mural da Comunidade: "Quero Adotar"
                  </h3>
                  <p className="text-xs text-slate-500">Moradores que estão buscando um animal com características específicas.</p>
                </div>

                {user ? (
                  <button 
                    onClick={() => setShowModalMural(true)}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                  >
                    <PlusCircle className="w-4 h-4" /> Postar Intenção de Adoção
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Faça login para postar no mural</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pedidosMural.map(m => (
                  <div key={m.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-xs">
                          {m.usuarioNome.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{m.usuarioNome}</h4>
                          <span className="text-[10px] text-slate-400">Postado em {m.dataPostagem} • {m.bairroMoradia}</span>
                        </div>
                      </div>
                      <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Procuro: {m.especieDesejada}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      "{m.descricao}"
                    </p>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500"><strong>Porte:</strong> {m.porteDesejado} | {m.racaPreferencial}</span>
                      <a 
                        href={`https://wa.me/${m.contato}?text=Olá%20${m.usuarioNome}!%20Vi%20seu%20pedido%20no%20mural%20do%20Patas%20de%20Quixeramobim.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Responder
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* RODAPÉ ACADÊMICO */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 px-4 text-xs border-t border-slate-800">
        <p className="font-semibold text-slate-300">TCC II - Bacharelado em Sistemas de Informação</p>
        <p className="mt-0.5">UniCatólica - Centro Universitário Católica do Quixadá | Estudo de Caso: Quixeramobim-CE</p>
      </footer>

      {/* MODAL 1: CADASTRAR ADOÇÃO */}
      {showModalAdocao && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Cadastrar Animal para Adoção</h3>
              <button onClick={() => setShowModalAdocao(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdocao} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Nome do Animal</label>
                  <input type="text" required value={formAdocao.nome} onChange={e => setFormAdocao({...formAdocao, nome: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Espécie</label>
                  <select value={formAdocao.especie} onChange={e => setFormAdocao({...formAdocao, especie: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Raça</label>
                  <input type="text" placeholder="Ex: Vira-lata" required value={formAdocao.raca} onChange={e => setFormAdocao({...formAdocao, raca: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Cor</label>
                  <input type="text" placeholder="Ex: Caramelo" required value={formAdocao.cor} onChange={e => setFormAdocao({...formAdocao, cor: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Porte</label>
                  <select value={formAdocao.porte} onChange={e => setFormAdocao({...formAdocao, porte: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Idade Aprox.</label>
                  <input type="text" placeholder="Ex: 1 ano" required value={formAdocao.idade} onChange={e => setFormAdocao({...formAdocao, idade: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Bairro em Quixeramobim</label>
                  <input type="text" required value={formAdocao.bairro} onChange={e => setFormAdocao({...formAdocao, bairro: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Estado de Saúde / Vacinação</label>
                <input type="text" placeholder="Ex: Vacinado, Castrado..." required value={formAdocao.saude} onChange={e => setFormAdocao({...formAdocao, saude: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">WhatsApp para Contato (Com DDD)</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formAdocao.contato} onChange={e => setFormAdocao({...formAdocao, contato: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">URL da Foto (Opcional)</label>
                <input type="text" placeholder="https://..." value={formAdocao.foto} onChange={e => setFormAdocao({...formAdocao, foto: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2">
                Publicar no Catálogo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ANIMAL PERDIDO */}
      {showModalPerdido && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Publicar Alerta de Animal Perdido</h3>
              <button onClick={() => setShowModalPerdido(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPerdido} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Nome do Animal</label>
                  <input type="text" required value={formPerdido.nomeAnimal} onChange={e => setFormPerdido({...formPerdido, nomeAnimal: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Espécie</label>
                  <select value={formPerdido.especie} onChange={e => setFormPerdido({...formPerdido, especie: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Raça</label>
                  <input type="text" required value={formPerdido.raca} onChange={e => setFormPerdido({...formPerdido, raca: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Cor</label>
                  <input type="text" required value={formPerdido.cor} onChange={e => setFormPerdido({...formPerdido, cor: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Porte</label>
                  <select value={formPerdido.porte} onChange={e => setFormPerdido({...formPerdido, porte: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Bairro do Desaparecimento</label>
                  <input type="text" required value={formPerdido.bairroSumico} onChange={e => setFormPerdido({...formPerdido, bairroSumico: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Data do Sumiço</label>
                  <input type="text" placeholder="DD/MM/AAAA" required value={formPerdido.dataSumico} onChange={e => setFormPerdido({...formPerdido, dataSumico: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Descrição / Características Marcantes</label>
                <textarea required value={formPerdido.descricao} onChange={e => setFormPerdido({...formPerdido, descricao: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={2}></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">WhatsApp do Tutor</label>
                <input type="text" required value={formPerdido.contatoDono} onChange={e => setFormPerdido({...formPerdido, contatoDono: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2">
                Publicar Alerta URGENTE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: POSTAR INTENÇÃO DE ADOÇÃO */}
      {showModalMural && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Postar Pedido: "Quero Adotar"</h3>
              <button onClick={() => setShowModalMural(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMural} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Espécie Desejada</label>
                  <select value={formMural.especieDesejada} onChange={e => setFormMural({...formMural, especieDesejada: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Porte Preferencial</label>
                  <select value={formMural.porteDesejado} onChange={e => setFormMural({...formMural, porteDesejado: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Preferência de Raça / Perfil (Opcional)</label>
                <input type="text" placeholder="Ex: Filhote, dócil, fêmea..." value={formMural.racaPreferencial} onChange={e => setFormMural({...formMural, racaPreferencial: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Seu Bairro em Quixeramobim</label>
                <input type="text" required value={formMural.bairroMoradia} onChange={e => setFormMural({...formMural, bairroMoradia: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Conte sobre sua casa/família para os protetores</label>
                <textarea required placeholder="Ex: Tenho quintal murado, família amorosa procurando companhia..." value={formMural.descricao} onChange={e => setFormMural({...formMural, descricao: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={3}></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Seu WhatsApp</label>
                <input type="text" required value={formMural.contato} onChange={e => setFormMural({...formMural, contato: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2">
                Publicar no Mural Público
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}