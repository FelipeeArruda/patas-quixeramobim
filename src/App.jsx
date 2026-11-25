import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  signInWithCustomToken,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Heart, 
  MapPin, 
  PlusCircle, 
  Dog, 
  Phone, 
  AlertTriangle, 
  Search, 
  Calendar, 
  Syringe, 
  LogOut, 
  Lock, 
  Sparkles,
  MessageSquare,
  ShieldCheck,
  X,
  Filter,
  Megaphone,
  Truck,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';

// Configuração do Firebase (Usa variáveis globais do ambiente ou substitua pelas chaves do seu Console Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCNAVow3Pr-82sAhuDmsEJOZzt0Shr55bU",
  authDomain: "patas-quixeramobim.firebaseapp.com",
  projectId: "patas-quixeramobim",
  storageBucket: "patas-quixeramobim.firebasestorage.app",
  messagingSenderId: "146145919828",
  appId: "1:146145919828:web:4906b0a3b504c48216bec1",
  measurementId: "G-GWSJR3J9T9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'patas-quixeramobim-tcc';
const googleProvider = new GoogleAuthProvider();

// Zonas Georreferenciadas do Mapa Térmico de Quixeramobim
const INITIAL_HEAT_ZONES = [
  { id: 1, bairro: 'Centro', top: '48%', left: '46%', size: '130px', color: 'rgba(239, 68, 68, 0.65)', nivel: 'Crítico (Alta Concentração)', ocorrencias: 18 },
  { id: 2, bairro: 'Edmilson Correia de Vasconcelos', top: '58%', left: '56%', size: '150px', color: 'rgba(239, 68, 68, 0.65)', nivel: 'Crítico (Alta Concentração)', ocorrencias: 22 },
  { id: 3, bairro: 'Rodoviária', top: '35%', left: '38%', size: '110px', color: 'rgba(245, 158, 11, 0.6)', nivel: 'Média Concentração', ocorrencias: 11 },
  { id: 4, bairro: 'Sabonete', top: '38%', left: '30%', size: '100px', color: 'rgba(245, 158, 11, 0.6)', nivel: 'Média Concentração', ocorrencias: 9 },
  { id: 5, bairro: 'Pompéia', top: '70%', left: '28%', size: '90px', color: 'rgba(59, 130, 246, 0.55)', nivel: 'Baixa / Monitoramento', ocorrencias: 4 },
  { id: 6, bairro: 'Entorno da Barragem', top: '28%', left: '55%', size: '120px', color: 'rgba(239, 68, 68, 0.6)', nivel: 'Crítico (Descarte Recorrente)', ocorrencias: 15 }
];

// Dados iniciais caso o banco esteja vazio na primeira execução
const DEFAULT_ANIMAIS = [
  {
    id: 'default-1',
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
    id: 'default-2',
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
  }
];

const DEFAULT_PERDIDOS = [
  {
    id: 'perdido-1',
    nomeAnimal: 'Bob',
    especie: 'Cão',
    raca: 'Poodle',
    cor: 'Branco',
    porte: 'Pequeno',
    bairroSumico: 'Bairro Jaime Lopes',
    dataSumico: '20/11/2026',
    descricao: 'Usa coleira azul. Muito dócil, atende pelo nome.',
    dono: 'Fernanda Oliveira',
    contatoDono: '5588988889999',
    foto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500'
  }
];

const DEFAULT_EVENTOS = [
  {
    id: 'evt-1',
    titulo: 'Feira Municipal de Adoção Responsável',
    data: '28/11/2026',
    horario: '08:00 às 12:00',
    local: 'Praça da Matriz - Centro, Quixeramobim',
    organizador: 'Protetores Independentes & Secretaria de Meio Ambiente',
    descricao: 'Cães e gatos vermifugados disponíveis para adoção. Leve RG, CPF e comprovante de residência.'
  },
  {
    id: 'evt-2',
    titulo: 'Mutirão de Adoção no Bairro Edmilson Correia',
    data: '05/12/2026',
    horario: '15:00 às 18:00',
    local: 'Praça da Igreja - Edmilson Correia',
    organizador: 'Grupo Patas do Sertão',
    descricao: 'Evento comunitário com orientação veterinária gratuita e adoção de filhotes.'
  }
];

const DEFAULT_MURAL = [
  {
    id: 'mural-1',
    usuarioNome: 'Ana Paula Nobre',
    especieDesejada: 'Gato',
    porteDesejado: 'Pequeno',
    racaPreferencial: 'Fêmea Filhote ou Castrada',
    bairroMoradia: 'Centro',
    descricao: 'Procuro uma gatinha fêmea dócil para fazer companhia para minha mãe idosa. Casa toda telada.',
    contato: '5588994433221',
    dataPostagem: '21/11/2026'
  }
];

export default function App() {
  const [user, setUser] = useState(null); // Usuário real do Google (isAnonymous === false)
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('mapa');

  // Modais de Cadastro
  const [showModalAdocao, setShowModalAdocao] = useState(false);
  const [showModalPerdido, setShowModalPerdido] = useState(false);
  const [showModalMural, setShowModalMural] = useState(false);
  const [showModalEvento, setShowModalEvento] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  // Notificação Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Estados de Dados (Sincronizados com Firestore)
  const [animaisAdocao, setAnimaisAdocao] = useState(DEFAULT_ANIMAIS);
  const [animaisPerdidos, setAnimaisPerdidos] = useState(DEFAULT_PERDIDOS);
  const [eventosAdocao, setEventosAdocao] = useState(DEFAULT_EVENTOS);
  const [pedidosMural, setPedidosMural] = useState(DEFAULT_MURAL);

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

  const [formEvento, setFormEvento] = useState({
    titulo: '', data: '', horario: '', local: '', organizador: '', descricao: ''
  });

  const [formMural, setFormMural] = useState({
    especieDesejada: 'Cão', porteDesejado: 'Médio', racaPreferencial: '', bairroMoradia: 'Centro', descricao: '', contato: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // 1. Inicialização da Autenticação Firebase (Suporta ambiente embutido e login real com Google)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Aviso na inicialização de sessão anônima:", err.message);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthReady(true);
      // Apenas considera logado com permissões se não for anônimo (ou seja, entrou via Google)
      if (currentUser && !currentUser.isAnonymous) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Protetor Google',
          email: currentUser.email,
          photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'Conta Google Verificada'
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Sincronização em Tempo Real com Cloud Firestore
  useEffect(() => {
    if (!authReady || !auth.currentUser) return;

    const unsubAdocao = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'animais_adocao'),
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) setAnimaisAdocao([...docs, ...DEFAULT_ANIMAIS]);
      },
      (err) => console.warn("Firestore Adoção (modo local ativo):", err.message)
    );

    const unsubPerdidos = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'animais_perdidos'),
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) setAnimaisPerdidos([...docs, ...DEFAULT_PERDIDOS]);
      },
      (err) => console.warn("Firestore Perdidos (modo local ativo):", err.message)
    );

    const unsubEventos = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'eventos_adocao'),
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) setEventosAdocao([...docs, ...DEFAULT_EVENTOS]);
      },
      (err) => console.warn("Firestore Eventos (modo local ativo):", err.message)
    );

    const unsubMural = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'pedidos_mural'),
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) setPedidosMural([...docs, ...DEFAULT_MURAL]);
      },
      (err) => console.warn("Firestore Mural (modo local ativo):", err.message)
    );

    return () => {
      unsubAdocao();
      unsubPerdidos();
      unsubEventos();
      unsubMural();
    };
  }, [authReady]);

  // Login Real com Conta do Google (OAuth 2.0 Popup)
  const handleLoginGoogle = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        showToast(`✅ Bem-vindo(a), ${result.user.displayName}! Conta Google conectada.`);
      }
    } catch (error) {
      console.error("Erro na autenticação Google:", error);
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        showToast('⚠️ Configure sua apiKey do Firebase Console no código para abrir o popup do Google.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        showToast('Login cancelado: a janela do Google foi fechada.');
      } else {
        showToast(`❌ Erro ao autenticar: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth);
      showToast('Você saiu da sua conta Google.');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Submissão de Formulários (Salva no Firestore e atualiza tela)
  const handleSubmitAdocao = async (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formAdocao,
      tutor: user.displayName,
      tutorEmail: user.email,
      criadoEm: new Date().toISOString(),
      foto: formAdocao.foto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500'
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'animais_adocao'), novo);
    } catch {
      setAnimaisAdocao([{ id: Date.now(), ...novo }, ...animaisAdocao]);
    }

    setShowModalAdocao(false);
    setFormAdocao({ nome: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', idade: '', bairro: 'Centro', saude: '', contato: '', foto: '' });
    showToast('✅ Animal cadastrado para adoção!');
    setActiveTab('adocao');
  };

  const handleSubmitPerdido = async (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formPerdido,
      dono: user.displayName,
      criadoEm: new Date().toISOString(),
      foto: formPerdido.foto || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500'
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'animais_perdidos'), novo);
    } catch {
      setAnimaisPerdidos([{ id: Date.now(), ...novo }, ...animaisPerdidos]);
    }

    setShowModalPerdido(false);
    setFormPerdido({ nomeAnimal: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', bairroSumico: 'Centro', dataSumico: '', descricao: '', contatoDono: '', foto: '' });
    showToast('🚨 Alerta de animal perdido publicado!');
    setActiveTab('perdidos');
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formEvento,
      organizador: formEvento.organizador || user.displayName,
      criadoEm: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'eventos_adocao'), novo);
    } catch {
      setEventosAdocao([{ id: Date.now(), ...novo }, ...eventosAdocao]);
    }

    setShowModalEvento(false);
    setFormEvento({ titulo: '', data: '', horario: '', local: '', organizador: '', descricao: '' });
    showToast('📅 Evento de adoção agendado no mural!');
    setActiveTab('eventos');
  };

  const handleSubmitMural = async (e) => {
    e.preventDefault();
    if (!user) return;
    const novo = {
      ...formMural,
      usuarioNome: user.displayName,
      dataPostagem: new Date().toLocaleDateString('pt-BR')
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'pedidos_mural'), novo);
    } catch {
      setPedidosMural([{ id: Date.now(), ...novo }, ...pedidosMural]);
    }

    setShowModalMural(false);
    setFormMural({ especieDesejada: 'Cão', porteDesejado: 'Médio', racaPreferencial: '', bairroMoradia: 'Centro', descricao: '', contato: '' });
    showToast('📢 Pedido de adoção publicado!');
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
      
      {/* Notificação Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-950 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-600 max-w-md">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
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
              <p className="text-xs text-emerald-200">Mapeamento Térmico, Castramóvel e Adoção Responsável (Quixeramobim-CE)</p>
            </div>
          </div>

          {/* Botão Oficial de Login com Google */}
          <div>
            {user ? (
              <div className="flex items-center gap-3 bg-emerald-900/90 p-1.5 pr-3 rounded-full border border-emerald-600 shadow-sm">
                <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">{user.displayName}</p>
                  <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> {user.email}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Sair da conta Google"
                  className="p-1.5 bg-emerald-800 hover:bg-red-600 text-emerald-200 hover:text-white rounded-full transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginGoogle}
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2.5 border border-slate-200 cursor-pointer"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Entrar com Google
              </button>
            )}
          </div>
        </div>

        {/* NAVEGAÇÃO POR ABAS */}
        <div className="bg-emerald-900/95 border-t border-emerald-700/60">
          <div className="max-w-7xl mx-auto px-4 flex gap-1.5 overflow-x-auto py-1.5">
            <button 
              onClick={() => setActiveTab('mapa')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'mapa' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <MapPin className="w-4 h-4 text-emerald-300" /> Mapa de Calor
            </button>
            <button 
              onClick={() => setActiveTab('adocao')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'adocao' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Heart className="w-4 h-4 text-pink-300" /> Adoção Responsável
            </button>
            <button 
              onClick={() => setActiveTab('castramovel')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'castramovel' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Truck className="w-4 h-4 text-amber-300" /> Castramóvel QXB
            </button>
            <button 
              onClick={() => setActiveTab('perdidos')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'perdidos' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <AlertTriangle className="w-4 h-4 text-red-300" /> Achados e Perdidos
            </button>
            <button 
              onClick={() => setActiveTab('eventos')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'eventos' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Calendar className="w-4 h-4 text-cyan-300" /> Eventos & Mural
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* BARRA DE PERMISSÕES DO USUÁRIO */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${user ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {user ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {user ? `Autenticado via Google: ${user.displayName}` : 'Acesso Visitante (Apenas Leitura)'}
              </h3>
              <p className="text-xs text-slate-500">
                {user 
                  ? 'Permissões liberadas: Você pode cadastrar animais, divulgar feiras de adoção, reportar sumiços e postar no mural.' 
                  : 'Conecte sua conta real do Google para cadastrar animais para adoção ou anunciar feiras e alertas.'}
              </p>
            </div>
          </div>

          {user ? (
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowModalAdocao(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Cadastrar Animal
              </button>
              <button 
                onClick={() => setShowModalEvento(true)}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Calendar className="w-4 h-4" /> Divulgar Feira
              </button>
              <button 
                onClick={() => setShowModalMural(true)}
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" /> Quero Adotar
              </button>
              <button 
                onClick={() => setShowModalPerdido(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" /> Animal Perdido
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLoginGoogle}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Entrar com Google
            </button>
          )}
        </div>

        {/* ABA 1: MAPA DE CALOR */}
        {activeTab === 'mapa' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  Mapa de Densidade de Abandono em Quixeramobim-CE
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  As manchas térmicas indicam os bairros com maior incidência de animais abandonados ou em situação de vulnerabilidade.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Crítico</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Moderado</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Baixo</span>
              </div>
            </div>

            <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-300 bg-slate-800 relative">
              <svg className="w-full h-full opacity-40 stroke-slate-500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M 0 260 Q 300 240 700 280 T 1200 260" fill="none" stroke="#64748b" strokeWidth="8" />
                <path d="M 450 0 Q 480 300 460 600" fill="none" stroke="#64748b" strokeWidth="6" />
              </svg>

              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-emerald-400">Quixeramobim - Ceará</p>
                <p className="text-[11px] text-slate-300">Clique em uma mancha térmica para ver detalhes do bairro</p>
              </div>

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

            {selectedZone && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-emerald-400">Bairro: {selectedZone.bairro}</h4>
                  <p className="text-xs text-slate-300">Classificação: <strong>{selectedZone.nivel}</strong> | Registros mapeados: <strong>{selectedZone.ocorrencias} animais</strong></p>
                </div>
                <button onClick={() => setSelectedZone(null)} className="text-slate-300 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">
                  Fechar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA 2: ADOÇÃO RESPONSÁVEL */}
        {activeTab === 'adocao' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-700" />
                  Buscar Animais para Adoção
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  {animaisFiltrados.length} Animais Disponíveis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Buscar por raça, cor, nome ou bairro..."
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
                          Porte {a.porte}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600"><strong>Raça:</strong> {a.raca}</p>
                      <p className="text-xs text-slate-600"><strong>Cor:</strong> {a.cor} | <strong>Idade:</strong> {a.idade}</p>
                      <p className="text-xs text-slate-600"><strong>Bairro:</strong> {a.bairro}</p>
                      <p className="text-xs text-slate-600"><strong>Responsável:</strong> {a.tutor}</p>
                      
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-2">
                        <strong>Saúde / Vacinação:</strong> {a.saude}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a 
                      href={`https://wa.me/${a.contato}?text=Olá!%20Vi%20o%20anúncio%20do(a)%20${a.nome}%20no%20sistema%20Patas%20de%20Quixeramobim.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
                    >
                      <Phone className="w-4 h-4" /> Entrar em Contato (WhatsApp)
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 3: INFORMAÇÕES SOBRE O CASTRAMÓVEL EM QUIXERAMOBIM */}
        {activeTab === 'castramovel' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Serviço Público Veterinário
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold">Castramóvel em Quixeramobim - CE</h2>
                  <p className="text-sm text-emerald-100 leading-relaxed">
                    Programa de controle populacional ético e gratuito de cães e gatos no município de Quixeramobim, visando reduzir o abandono e prevenir zoonoses.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cronograma e Locais */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
                  <Clock className="w-5 h-5 text-emerald-700" />
                  Cronograma de Atendimento nos Bairros
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-emerald-950">Etapa Atual: Bairro Edmilson Correia</span>
                      <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">EM ANDAMENTO</span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1"><strong>Local:</strong> Praça Principal / Anexo ao Posto de Saúde</p>
                    <p className="text-xs text-emerald-800"><strong>Horário de Triagem:</strong> Segunda a Sexta, 07:30 às 11:30</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-800">Próxima Parada: Bairro Sabonete & Centro</span>
                      <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">PRÓXIMA SEMANA</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1"><strong>Local:</strong> Estacionamento do Ginásio Poliesportivo</p>
                    <p className="text-xs text-slate-600"><strong>Vagas:</strong> Limitadas por ordem de agendamento prévio</p>
                  </div>
                </div>
              </div>

              {/* Requisitos e Pré-Operatório */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  Requisitos e Cuidados Pré-Operatórios
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Documentos do Tutor:</strong> RG, CPF, Cartão do SUS e Comprovante de Residência em Quixeramobim.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Idade do Animal:</strong> Cães e gatos entre 6 meses e 7 anos de idade, saudáveis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Jejum Obrigatório:</strong> 8 horas de jejum sólido e 4 horas de jejum hídrico (água) antes do procedimento.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Transporte Seguro:</strong> Gatos devem ir obrigatoriamente em caixa de transporte; cães com coleira e focinheira (se necessário).</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">Como realizar o cadastro presencial?</p>
                <p>Procure a Secretaria de Meio Ambiente / Vigilância em Saúde de Quixeramobim ou os agentes comunitários nos pontos de apoio do Castramóvel para realizar a triagem clínica do seu animal.</p>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: ACHADOS E PERDIDOS */}
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
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Reportar Animal Perdido
                </button>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold">
                  Entre com Google para postar um animal sumido
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

        {/* ABA 5: EVENTOS DE ADOÇÃO, VACINAÇÃO E MURAL */}
        {activeTab === 'eventos' && (
          <div className="space-y-6">
            {/* Eventos de Adoção (Dinâmico) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Eventos e Feiras de Adoção em Quixeramobim</h3>
                    <p className="text-xs text-slate-500">Confira as próximas feiras presenciais organizadas por ONGs e protetores locais.</p>
                  </div>
                </div>

                {user && (
                  <button 
                    onClick={() => setShowModalEvento(true)}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Cadastrar Novo Evento
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventosAdocao.map(ev => (
                  <div key={ev.id} className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">FEIRA DE ADOÇÃO</span>
                        <span className="text-xs font-bold text-emerald-900">{ev.data}</span>
                      </div>
                      <h4 className="font-bold text-base text-emerald-950 mt-2">{ev.titulo}</h4>
                      <p className="text-xs text-emerald-800 mt-1"><strong>Horário:</strong> {ev.horario}</p>
                      <p className="text-xs text-emerald-800"><strong>Local:</strong> {ev.local}</p>
                      <p className="text-xs text-emerald-800"><strong>Organização:</strong> {ev.organizador}</p>
                    </div>
                    <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-emerald-200 mt-2">
                      {ev.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aviso de Vacinação */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 border-b pb-2">
                <Syringe className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base">Campanhas de Vacinação Gratuita</h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-1">
                <span className="bg-blue-200 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded">IMUNIZAÇÃO PÚBLICA</span>
                <h4 className="font-bold text-sm text-blue-950">Vacinação Antirrábica Gratuita nos Postos de Saúde</h4>
                <p className="text-xs text-blue-800"><strong>Atendimento:</strong> Segunda a Sexta, 08:00 às 16:00</p>
                <p className="text-xs text-blue-800"><strong>Unidades:</strong> UBS Sabonete, UBS Centro e UBS Edmilson Correia</p>
              </div>
            </div>

            {/* Mural Quero Adotar */}
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
                    className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Postar Intenção de Adoção
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Entre com Google para postar no mural</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pedidosMural.map(m => (
                  <div key={m.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-xs">
                          {m.usuarioNome.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{m.usuarioNome}</h4>
                          <span className="text-[10px] text-slate-400">Postado em {m.dataPostagem}</span>
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
                        href={`https://wa.me/${m.contato}?text=Olá%20${m.usuarioNome}!%20Vi%20seu%20pedido%20no%20mural%20Patas%20de%20Quixeramobim.`}
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

      <footer className="bg-slate-900 text-slate-400 text-center py-4 px-4 text-xs border-t border-slate-800">
        <p className="font-semibold text-slate-300">TCC II - Bacharelado em Sistemas de Informação</p>
        <p className="mt-0.5">UniCatólica - Centro Universitário Católica do Quixadá | Estudo de Caso: Quixeramobim-CE</p>
      </footer>

      {/* MODAL 1: CADASTRAR ANIMAL PARA ADOÇÃO */}
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
                  <input type="text" required value={formAdocao.raca} onChange={e => setFormAdocao({...formAdocao, raca: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Cor</label>
                  <input type="text" required value={formAdocao.cor} onChange={e => setFormAdocao({...formAdocao, cor: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
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
                  <input type="text" required value={formAdocao.idade} onChange={e => setFormAdocao({...formAdocao, idade: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Bairro em Quixeramobim</label>
                  <input type="text" required value={formAdocao.bairro} onChange={e => setFormAdocao({...formAdocao, bairro: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Estado de Saúde / Vacinação</label>
                <input type="text" required value={formAdocao.saude} onChange={e => setFormAdocao({...formAdocao, saude: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">WhatsApp para Contato (com DDD)</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formAdocao.contato} onChange={e => setFormAdocao({...formAdocao, contato: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer">
                Publicar no Catálogo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DIVULGAR EVENTO / FEIRA DE ADOÇÃO */}
      {showModalEvento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Divulgar Evento de Adoção</h3>
              <button onClick={() => setShowModalEvento(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvento} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700">Título do Evento / Feira</label>
                <input type="text" placeholder="Ex: Feira de Adoção na Praça da Matriz" required value={formEvento.titulo} onChange={e => setFormEvento({...formEvento, titulo: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Data</label>
                  <input type="text" placeholder="DD/MM/AAAA" required value={formEvento.data} onChange={e => setFormEvento({...formEvento, data: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Horário</label>
                  <input type="text" placeholder="Ex: 08:00 às 12:00" required value={formEvento.horario} onChange={e => setFormEvento({...formEvento, horario: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Local em Quixeramobim</label>
                <input type="text" placeholder="Ex: Praça da Prefeitura" required value={formEvento.local} onChange={e => setFormEvento({...formEvento, local: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Organizador / ONG</label>
                <input type="text" placeholder="Nome do grupo ou protetor" value={formEvento.organizador} onChange={e => setFormEvento({...formEvento, organizador: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Detalhes e Documentos Exigidos</label>
                <textarea required placeholder="Ex: Levar RG e comprovante de residência..." value={formEvento.descricao} onChange={e => setFormEvento({...formEvento, descricao: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={3}></textarea>
              </div>

              <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer">
                Publicar Evento no Mural
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REPORTAR ANIMAL PERDIDO */}
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
                <label className="block text-xs font-bold text-slate-700">Descrição / Características</label>
                <textarea required value={formPerdido.descricao} onChange={e => setFormPerdido({...formPerdido, descricao: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={2}></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">WhatsApp do Tutor</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formPerdido.contatoDono} onChange={e => setFormPerdido({...formPerdido, contatoDono: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer">
                Publicar Alerta URGENTE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: POSTAR INTENÇÃO DE ADOÇÃO NO MURAL */}
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
                <label className="block text-xs font-bold text-slate-700">Preferência de Raça / Perfil</label>
                <input type="text" placeholder="Ex: Filhote, dócil..." value={formMural.racaPreferencial} onChange={e => setFormMural({...formMural, racaPreferencial: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Seu Bairro em Quixeramobim</label>
                <input type="text" required value={formMural.bairroMoradia} onChange={e => setFormMural({...formMural, bairroMoradia: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Conte sobre sua casa para os protetores</label>
                <textarea required placeholder="Ex: Tenho quintal murado..." value={formMural.descricao} onChange={e => setFormMural({...formMural, descricao: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={3}></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Seu WhatsApp</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formMural.contato} onChange={e => setFormMural({...formMural, contato: e.target.value})} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer">
                Publicar no Mural Público
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}