import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import L from 'leaflet';
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
  Truck,
  CheckCircle2,
  Clock,
  Info,
  Pencil,
  Trash2,
  Camera,
  ImagePlus
} from 'lucide-react';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNAvOw3Pr-82sAhuDmsEJOZzt0Shr55bU",
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

const QUIXERAMOBIM_CENTER = [-5.1979, -39.2925];

const BAIRROS_QUIXERAMOBIM = [
  'Centro',
  'Edmilson Correia de Vasconcelos',
  'Rodoviária',
  'Sabonete',
  'Pompéia',
  'Entorno da Barragem',
  'Jaime Lopes',
  'Duque de Caxias',
  'Maravilha',
  'Monteiro de Moraes',
  'Conjunto Habitacional',
  'Depósito',
  'Salviano Carlos',
  'Humberto Bezerra',
  'Vila Betânia',
  'São José',
  'Distritos / Zona Rural'
];

const INITIAL_HEAT_ZONES = [
  { id: 1, bairro: 'Centro', lat: -5.1982, lng: -39.2923, baseOcorrencias: 18 },
  { id: 2, bairro: 'Edmilson Correia de Vasconcelos', lat: -5.2055, lng: -39.2865, baseOcorrencias: 22 },
  { id: 3, bairro: 'Rodoviária', lat: -5.1945, lng: -39.2985, baseOcorrencias: 11 },
  { id: 4, bairro: 'Sabonete', lat: -5.1912, lng: -39.3028, baseOcorrencias: 9 },
  { id: 5, bairro: 'Pompéia', lat: -5.2068, lng: -39.3012, baseOcorrencias: 4 },
  { id: 6, bairro: 'Entorno da Barragem', lat: -5.1885, lng: -39.2880, baseOcorrencias: 15 },
  { id: 7, bairro: 'Jaime Lopes', lat: -5.2022, lng: -39.2975, baseOcorrencias: 7 },
  { id: 8, bairro: 'Duque de Caxias', lat: -5.1958, lng: -39.2875, baseOcorrencias: 6 },
  { id: 9, bairro: 'Maravilha', lat: -5.2090, lng: -39.2925, baseOcorrencias: 8 },
  { id: 10, bairro: 'Monteiro de Moraes', lat: -5.1920, lng: -39.2940, baseOcorrencias: 5 },
  { id: 11, bairro: 'Conjunto Habitacional', lat: -5.2115, lng: -39.2890, baseOcorrencias: 10 },
  { id: 12, bairro: 'Depósito', lat: -5.2005, lng: -39.2845, baseOcorrencias: 5 },
  { id: 13, bairro: 'Salviano Carlos', lat: -5.1965, lng: -39.3045, baseOcorrencias: 4 },
  { id: 14, bairro: 'Humberto Bezerra', lat: -5.2040, lng: -39.3040, baseOcorrencias: 6 },
  { id: 15, bairro: 'Vila Betânia', lat: -5.1895, lng: -39.2975, baseOcorrencias: 5 },
  { id: 16, bairro: 'São José', lat: -5.2082, lng: -39.2968, baseOcorrencias: 7 },
  { id: 17, bairro: 'Distritos / Zona Rural', lat: -5.2160, lng: -39.3060, baseOcorrencias: 12 }
];

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
    tutorUid: 'sistema-demo',
    contato: '5588999999999',
    adotado: false,
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
    bairro: 'Edmilson Correia de Vasconcelos',
    saude: 'Vermifugada e Castrada',
    tutor: 'ONG Patas Amigas QXB',
    tutorUid: 'sistema-demo',
    contato: '5588988887777',
    adotado: false,
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
    bairroSumico: 'Jaime Lopes',
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
    local: 'Praça da Igreja - Edmilson Correia de Vasconcelos',
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

const EMPTY_ANIMAL_FORM = {
  nome: '',
  especie: 'Cão',
  raca: '',
  cor: '',
  porte: 'Médio',
  idade: '',
  bairro: 'Centro',
  saude: '',
  contato: '',
  foto: ''
};

function mergeUniqueById(primaryDocs, fallbackDocs) {
  const map = new Map();
  primaryDocs.forEach((item) => map.set(item.id, item));
  fallbackDocs.forEach((item) => {
    if (!map.has(item.id)) map.set(item.id, item);
  });
  return Array.from(map.values());
}

function computeDynamicHeatZones(baseZones, animaisList) {
  const ativos = animaisList.filter((a) => !a.adotado && !String(a.id).startsWith('default-'));

  return baseZones.map((zone) => {
    const extrasNoBairro = ativos.filter(
      (a) => (a.bairro || '').trim().toLowerCase() === zone.bairro.trim().toLowerCase()
    ).length;

    const total = Math.max(0, zone.baseOcorrencias + extrasNoBairro);

    let nivel = 'Baixa / Monitoramento';
    let color = '#3b82f6';
    let radius = 210 + total * 5;

    if (total >= 15) {
      nivel = 'Crítico (Alta Concentração)';
      color = '#ef4444';
      radius = 330 + Math.min(total * 5, 130);
    } else if (total >= 8) {
      nivel = 'Média Concentração';
      color = '#f59e0b';
      radius = 260 + total * 5;
    }

    return {
      ...zone,
      ocorrencias: total,
      extrasCadastrados: extrasNoBairro,
      nivel,
      color,
      radius
    };
  });
}

// Redimensiona e comprime foto da galeria/câmera para caber com folga no Firestore
function compressImageToBase64(file, maxWidth = 720, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagem inválida ou corrompida.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function QuixeramobimRealMap({ zones, selectedZoneId, onSelectZone }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const circlesByIdRef = useRef({});

  useEffect(() => {
    const cssId = 'leaflet-cdn-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: QUIXERAMOBIM_CENTER,
      zoom: 14,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Quixeramobim-CE',
      maxZoom: 19
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();
    circlesByIdRef.current = {};

    zones.forEach((z) => {
      L.circle([z.lat, z.lng], {
        radius: z.radius * 1.4,
        color: 'transparent',
        fillColor: z.color,
        fillOpacity: 0.2
      }).addTo(layerGroupRef.current);

      const coreCircle = L.circle([z.lat, z.lng], {
        radius: z.radius * 0.85,
        color: z.color,
        weight: 2,
        fillColor: z.color,
        fillOpacity: 0.46
      }).addTo(layerGroupRef.current);

      coreCircle.bindPopup(`
        <div style="font-family: sans-serif; min-width: 205px;">
          <strong style="font-size: 13px; color: #064e3b;">Bairro: ${z.bairro}</strong><br/>
          <span style="font-size: 11px; color: #334155;"><b>Nível:</b> ${z.nivel}</span><br/>
          <span style="font-size: 11px; color: #334155;"><b>Total mapeado:</b> ${z.ocorrencias} animais</span>
          ${z.extrasCadastrados > 0 ? `<br/><span style="font-size: 11px; color: #047857;"><b>+${z.extrasCadastrados} cadastrado(s) na plataforma</b></span>` : ''}
        </div>
      `);

      coreCircle.on('click', () => {
        onSelectZone(z.id);
      });

      circlesByIdRef.current[z.id] = coreCircle;

      const badgeIcon = L.divIcon({
        className: 'custom-qxb-pin',
        html: `
          <div style="
            background: rgba(15, 23, 42, 0.92);
            color: #ffffff;
            border: 1.5px solid ${z.color};
            border-radius: 9999px;
            padding: 3px 8px;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            transform: translate(-50%, -50%);
            display: inline-block;
          ">
            ${z.bairro} (${z.ocorrencias})
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker([z.lat, z.lng], { icon: badgeIcon }).addTo(layerGroupRef.current);
      marker.on('click', () => {
        onSelectZone(z.id);
        coreCircle.openPopup();
      });
    });
  }, [zones, onSelectZone]);

  useEffect(() => {
    if (!selectedZoneId || !mapInstanceRef.current) return;
    const target = zones.find((z) => z.id === selectedZoneId);
    if (target) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], 15, { duration: 0.8 });
      const circle = circlesByIdRef.current[target.id];
      if (circle) circle.openPopup();
    }
  }, [selectedZoneId, zones]);

  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-md border border-slate-300 z-10">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white text-xs p-3 rounded-xl border border-slate-700 pointer-events-none">
        <p className="font-bold text-emerald-400">Quixeramobim - Ceará (OpenStreetMap)</p>
        <p className="text-[11px] text-slate-300">Atualizado em tempo real conforme cadastros e adoções por bairro</p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginBusy, setLoginBusy] = useState(false);
  const [activeTab, setActiveTab] = useState('mapa');

  const [showModalAdocao, setShowModalAdocao] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState(null);
  const [processingPhotoAdocao, setProcessingPhotoAdocao] = useState(false);

  const [showModalPerdido, setShowModalPerdido] = useState(false);
  const [processingPhotoPerdido, setProcessingPhotoPerdido] = useState(false);

  const [showModalMural, setShowModalMural] = useState(false);
  const [showModalEvento, setShowModalEvento] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const [animaisAdocao, setAnimaisAdocao] = useState(DEFAULT_ANIMAIS);
  const [animaisPerdidos, setAnimaisPerdidos] = useState(DEFAULT_PERDIDOS);
  const [eventosAdocao, setEventosAdocao] = useState(DEFAULT_EVENTOS);
  const [pedidosMural, setPedidosMural] = useState(DEFAULT_MURAL);

  const [filtroEspecie, setFiltroEspecie] = useState('Todos');
  const [filtroPorte, setFiltroPorte] = useState('Todos');
  const [filtroBusca, setFiltroBusca] = useState('');

  const [formAdocao, setFormAdocao] = useState(EMPTY_ANIMAL_FORM);

  const [formPerdido, setFormPerdido] = useState({
    nomeAnimal: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', bairroSumico: 'Centro', dataSumico: '', descricao: '', contatoDono: '', foto: ''
  });

  const [formEvento, setFormEvento] = useState({
    titulo: '', data: '', horario: '', local: '', organizador: '', descricao: ''
  });

  const [formMural, setFormMural] = useState({
    especieDesejada: 'Cão', porteDesejado: 'Médio', racaPreferencial: '', bairroMoradia: 'Centro', descricao: '', contato: ''
  });

  const galleryAdocaoRef = useRef(null);
  const cameraAdocaoRef = useRef(null);
  const galleryPerdidoRef = useRef(null);
  const cameraPerdidoRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5500);
  };

  const isOwnerOfAnimal = (animal) => {
    if (!user || !animal) return false;
    return Boolean(animal.tutorUid && animal.tutorUid === user.uid);
  };

  const dynamicHeatZones = computeDynamicHeatZones(INITIAL_HEAT_ZONES, animaisAdocao);
  const selectedZone = dynamicHeatZones.find((z) => z.id === selectedZoneId) || null;
  const animaisDisponiveis = animaisAdocao.filter((a) => !a.adotado);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !currentUser.isAnonymous) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Usuário Google',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubAdocao = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'animais_adocao'),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));
        setAnimaisAdocao((prev) => {
          const locaisPendentes = prev.filter((item) => String(item.id).startsWith('local-'));
          return mergeUniqueById([...locaisPendentes, ...docs], DEFAULT_ANIMAIS);
        });
      },
      (err) => {
        console.error('Erro ao ler animais_adocao no Firestore:', err);
        showToast(`⚠️ Aviso ao ler banco: ${err.message}`);
      }
    );

    const unsubPerdidos = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'animais_perdidos'),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAnimaisPerdidos(mergeUniqueById(docs, DEFAULT_PERDIDOS));
      },
      (err) => console.warn('Firestore Perdidos:', err.message)
    );

    const unsubEventos = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'eventos_adocao'),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEventosAdocao(mergeUniqueById(docs, DEFAULT_EVENTOS));
      },
      (err) => console.warn('Firestore Eventos:', err.message)
    );

    const unsubMural = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'pedidos_mural'),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPedidosMural(mergeUniqueById(docs, DEFAULT_MURAL));
      },
      (err) => console.warn('Firestore Mural:', err.message)
    );

    return () => {
      unsubAdocao();
      unsubPerdidos();
      unsubEventos();
      unsubMural();
    };
  }, []);

  const handleLoginGoogle = async () => {
    if (loginBusy) return;
    setLoginBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        showToast(`✅ Conectado com Google: ${result.user.displayName}`);
      }
    } catch (error) {
      console.error('Erro detalhado Google Auth:', error);
      const code = error?.code || '';
      if (code.includes('api-key-not-valid')) {
        showToast('⚠️ Chave de API rejeitada pelo Google (auth/api-key-not-valid).');
      } else if (code === 'auth/unauthorized-domain') {
        showToast(`⚠️ Domínio "${window.location.hostname}" não autorizado no Firebase.`);
      } else if (code === 'auth/popup-blocked') {
        showToast('⚠️ Popup bloqueado pelo navegador. Permita popups para este site.');
      } else if (code === 'auth/popup-closed-by-user') {
        showToast('Janela de login fechada antes da conclusão.');
      } else {
        showToast(`❌ Falha no login Google (${code || 'erro'}): ${error.message}`);
      }
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowModalAdocao(false);
      setEditingAnimalId(null);
      setShowModalEvento(false);
      setShowModalPerdido(false);
      setShowModalMural(false);
      showToast('Sessão encerrada.');
    } catch (error) {
      console.error('Erro ao sair:', error);
      showToast('❌ Erro ao encerrar sessão.');
    }
  };

  const handlePhotoFileAdocao = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingPhotoAdocao(true);
    try {
      const base64Image = await compressImageToBase64(file, 720, 0.72);
      setFormAdocao((prev) => ({ ...prev, foto: base64Image }));
      showToast('📸 Foto anexada e otimizada com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('⚠️ Não foi possível processar esta foto. Tente outra imagem.');
    } finally {
      setProcessingPhotoAdocao(false);
      e.target.value = '';
    }
  };

  const handlePhotoFilePerdido = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingPhotoPerdido(true);
    try {
      const base64Image = await compressImageToBase64(file, 720, 0.72);
      setFormPerdido((prev) => ({ ...prev, foto: base64Image }));
      showToast('📸 Foto do pet anexada com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('⚠️ Não foi possível processar esta foto. Tente outra imagem.');
    } finally {
      setProcessingPhotoPerdido(false);
      e.target.value = '';
    }
  };

  const openNewAnimalModal = () => {
    if (!user) {
      showToast('🔒 Entre com sua conta Google para cadastrar animais.');
      return;
    }
    setEditingAnimalId(null);
    setFormAdocao(EMPTY_ANIMAL_FORM);
    setShowModalAdocao(true);
  };

  const openEditAnimalModal = (animal) => {
    if (!user) {
      showToast('🔒 Entre com sua conta Google para editar.');
      return;
    }
    if (!isOwnerOfAnimal(animal)) {
      showToast('⛔ Você só pode editar animais cadastrados pela sua própria conta.');
      return;
    }
    setEditingAnimalId(animal.id);
    setFormAdocao({
      nome: animal.nome || '',
      especie: animal.especie || 'Cão',
      raca: animal.raca || '',
      cor: animal.cor || '',
      porte: animal.porte || 'Médio',
      idade: animal.idade || '',
      bairro: BAIRROS_QUIXERAMOBIM.includes(animal.bairro) ? animal.bairro : 'Centro',
      saude: animal.saude || '',
      contato: animal.contato || '',
      foto: animal.foto || ''
    });
    setShowModalAdocao(true);
  };

  const handleMarkAsAdopted = async (animal) => {
    if (!user) {
      showToast('🔒 Entre com sua conta Google para atualizar o status.');
      return;
    }
    if (!isOwnerOfAnimal(animal)) {
      showToast('⛔ Apenas o responsável que cadastrou pode marcar este animal como adotado.');
      return;
    }

    const confirmar = window.confirm(
      `Confirmar que "${animal.nome}" foi adotado? O contador do bairro ${animal.bairro} no mapa será reduzido automaticamente.`
    );
    if (!confirmar) return;

    const isFirestoreDoc = !String(animal.id).startsWith('default-') && !String(animal.id).startsWith('local-');
    if (isFirestoreDoc) {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'animais_adocao', animal.id), {
          adotado: true,
          adotadoEm: serverTimestamp()
        });
        showToast(`💚 "${animal.nome}" marcado como adotado! Mapa do bairro ${animal.bairro} atualizado.`);
        return;
      } catch (err) {
        console.warn('Erro ao marcar adotado no Firestore:', err.message);
      }
    }

    setAnimaisAdocao((prev) =>
      prev.map((item) => (item.id === animal.id ? { ...item, adotado: true } : item))
    );
    showToast(`💚 "${animal.nome}" marcado como adotado! Mapa do bairro ${animal.bairro} atualizado.`);
  };

  const handleDeleteAnimal = async (animal) => {
    if (!user) {
      showToast('🔒 Entre com sua conta Google para excluir.');
      return;
    }
    if (!isOwnerOfAnimal(animal)) {
      showToast('⛔ Você só pode excluir animais cadastrados pela sua própria conta.');
      return;
    }
    const confirmar = window.confirm(
      `Deseja realmente excluir "${animal.nome}"? O contador do bairro ${animal.bairro} no mapa também será atualizado.`
    );
    if (!confirmar) return;

    const isFirestoreDoc = !String(animal.id).startsWith('default-') && !String(animal.id).startsWith('local-');
    if (isFirestoreDoc) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'animais_adocao', animal.id));
        showToast(`🗑️ "${animal.nome}" excluído e contador de ${animal.bairro} atualizado.`);
        return;
      } catch (err) {
        console.warn('Erro ao excluir no Firestore:', err.message);
      }
    }

    setAnimaisAdocao((prev) => prev.filter((item) => item.id !== animal.id));
    showToast(`🗑️ "${animal.nome}" removido e contador de ${animal.bairro} atualizado.`);
  };

  const handleSubmitAdocao = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('🔒 Entre com sua conta Google para salvar.');
      return;
    }

    const fotoLimpa = (formAdocao.foto || '').trim();
    const isValidPhoto = fotoLimpa.startsWith('http') || fotoLimpa.startsWith('data:image/');
    const fotoFinal = isValidPhoto
      ? fotoLimpa
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500';

    if (editingAnimalId) {
      const alvo = animaisAdocao.find((item) => item.id === editingAnimalId);
      if (!alvo || !isOwnerOfAnimal(alvo)) {
        showToast('⛔ Permissão negada: apenas o autor do cadastro pode editar este animal.');
        setShowModalAdocao(false);
        setEditingAnimalId(null);
        return;
      }

      const dadosAtualizados = {
        ...formAdocao,
        foto: fotoFinal,
        tutorUid: user.uid,
        atualizadoEm: serverTimestamp()
      };

      const isFirestoreDoc = !String(editingAnimalId).startsWith('default-') && !String(editingAnimalId).startsWith('local-');
      if (isFirestoreDoc) {
        try {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'animais_adocao', editingAnimalId), dadosAtualizados);
          showToast(`✏️ Dados de "${formAdocao.nome}" atualizados! Mapa sincronizado.`);
        } catch (err) {
          console.error('Erro ao atualizar no Firestore:', err);
          setAnimaisAdocao((prev) => prev.map((item) => (item.id === editingAnimalId ? { ...item, ...dadosAtualizados } : item)));
          showToast(`⚠️ Atualizado na tela (Firestore: ${err.code || err.message})`);
        }
      } else {
        setAnimaisAdocao((prev) => prev.map((item) => (item.id === editingAnimalId ? { ...item, ...dadosAtualizados } : item)));
        showToast(`✏️ Dados de "${formAdocao.nome}" atualizados.`);
      }

      setFiltroEspecie('Todos');
      setFiltroPorte('Todos');
      setFiltroBusca('');
      setShowModalAdocao(false);
      setEditingAnimalId(null);
      setFormAdocao(EMPTY_ANIMAL_FORM);
      setActiveTab('adocao');
      return;
    }

    const novo = {
      ...formAdocao,
      foto: fotoFinal,
      adotado: false,
      tutor: user.displayName,
      tutorUid: user.uid,
      tutorEmail: user.email,
      criadoEm: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'animais_adocao'), novo);
      const itemCriado = { id: docRef.id, ...novo };
      setAnimaisAdocao((prev) => mergeUniqueById([itemCriado], prev));
      showToast(`✅ "${formAdocao.nome}" cadastrado! +1 registro adicionado em ${formAdocao.bairro} no mapa.`);
    } catch (err) {
      console.error('Erro ao salvar animal no Firestore:', err);
      const itemLocal = { id: `local-${Date.now()}`, ...novo };
      setAnimaisAdocao((prev) => [itemLocal, ...prev]);
      showToast(`⚠️ Card exibido, mas Firestore retornou: ${err.code || err.message}`);
    }

    setFiltroEspecie('Todos');
    setFiltroPorte('Todos');
    setFiltroBusca('');
    setShowModalAdocao(false);
    setFormAdocao(EMPTY_ANIMAL_FORM);
    setActiveTab('adocao');
  };

  const handleSubmitPerdido = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('🔒 Entre com sua conta Google para publicar alerta.');
      return;
    }

    const fotoLimpa = (formPerdido.foto || '').trim();
    const isValidPhoto = fotoLimpa.startsWith('http') || fotoLimpa.startsWith('data:image/');
    const fotoFinal = isValidPhoto
      ? fotoLimpa
      : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500';

    const novo = {
      ...formPerdido,
      foto: fotoFinal,
      dono: user.displayName,
      donoUid: user.uid,
      criadoEm: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'animais_perdidos'), novo);
      showToast('🚨 Alerta de animal perdido salvo no Cloud Firestore!');
    } catch (err) {
      console.warn('Salvamento local:', err.message);
      setAnimaisPerdidos((prev) => [{ id: `local-${Date.now()}`, ...novo }, ...prev]);
      showToast('🚨 Alerta publicado.');
    }

    setShowModalPerdido(false);
    setFormPerdido({ nomeAnimal: '', especie: 'Cão', raca: '', cor: '', porte: 'Médio', bairroSumico: 'Centro', dataSumico: '', descricao: '', contatoDono: '', foto: '' });
    setActiveTab('perdidos');
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('🔒 Entre com sua conta Google para divulgar eventos.');
      return;
    }

    const novo = {
      ...formEvento,
      organizador: formEvento.organizador || user.displayName,
      criadoPorUid: user.uid,
      criadoEm: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'eventos_adocao'), novo);
      showToast('📅 Evento de adoção salvo no Cloud Firestore!');
    } catch (err) {
      console.warn('Salvamento local:', err.message);
      setEventosAdocao((prev) => [{ id: `local-${Date.now()}`, ...novo }, ...prev]);
      showToast('📅 Evento adicionado.');
    }

    setShowModalEvento(false);
    setFormEvento({ titulo: '', data: '', horario: '', local: '', organizador: '', descricao: '' });
    setActiveTab('eventos');
  };

  const handleSubmitMural = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('🔒 Entre com sua conta Google para postar no mural.');
      return;
    }

    const novo = {
      ...formMural,
      usuarioNome: user.displayName,
      usuarioUid: user.uid,
      dataPostagem: new Date().toLocaleDateString('pt-BR'),
      criadoEm: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'pedidos_mural'), novo);
      showToast('📢 Pedido salvo no Cloud Firestore!');
    } catch (err) {
      console.warn('Salvamento local:', err.message);
      setPedidosMural((prev) => [{ id: `local-${Date.now()}`, ...novo }, ...prev]);
      showToast('📢 Pedido publicado.');
    }

    setShowModalMural(false);
    setFormMural({ especieDesejada: 'Cão', porteDesejado: 'Médio', racaPreferencial: '', bairroMoradia: 'Centro', descricao: '', contato: '' });
    setActiveTab('eventos');
  };

  const animaisFiltrados = animaisDisponiveis.filter((a) => {
    const matchEspecie = filtroEspecie === 'Todos' || a.especie === filtroEspecie;
    const matchPorte = filtroPorte === 'Todos' || a.porte === filtroPorte;
    const busca = filtroBusca.toLowerCase();
    const matchSearch =
      (a.nome || '').toLowerCase().includes(busca) ||
      (a.raca || '').toLowerCase().includes(busca) ||
      (a.cor || '').toLowerCase().includes(busca) ||
      (a.bairro || '').toLowerCase().includes(busca);
    return matchEspecie && matchPorte && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">

      {toastMessage && (
        <div className="fixed top-4 right-4 z-[999] bg-emerald-950 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-600 max-w-md">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
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

          <div>
            {authLoading ? (
              <span className="text-xs text-emerald-200 px-3 py-2">Verificando sessão...</span>
            ) : user ? (
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
                  className="p-1.5 bg-emerald-800 hover:bg-red-600 text-emerald-200 hover:text-white rounded-full transition ml-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginGoogle}
                disabled={loginBusy}
                className="bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2.5 border border-slate-200 cursor-pointer"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                {loginBusy ? 'Abrindo Google...' : 'Entrar com Google'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-emerald-900/95 border-t border-emerald-700/60">
          <div className="max-w-7xl mx-auto px-4 flex gap-1.5 overflow-x-auto py-1.5">
            <button
              onClick={() => setActiveTab('mapa')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'mapa' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <MapPin className="w-4 h-4 text-emerald-300" /> Mapa de Calor
            </button>
            <button
              onClick={() => setActiveTab('adocao')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'adocao' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Heart className="w-4 h-4 text-pink-300" /> Adoção Responsável
            </button>
            <button
              onClick={() => setActiveTab('castramovel')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'castramovel' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Truck className="w-4 h-4 text-amber-300" /> Castramóvel QXB
            </button>
            <button
              onClick={() => setActiveTab('perdidos')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'perdidos' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <AlertTriangle className="w-4 h-4 text-red-300" /> Achados e Perdidos
            </button>
            <button
              onClick={() => setActiveTab('eventos')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'eventos' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-100 hover:bg-emerald-800'}`}
            >
              <Calendar className="w-4 h-4 text-cyan-300" /> Eventos & Mural
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

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
                  ? 'Permissões liberadas: Cadastre animais com foto/câmera, atualize o mapa por bairro e gerencie seus próprios registros.'
                  : 'Conecte sua conta real do Google para cadastrar animais e gerenciar seus próprios anúncios.'}
              </p>
            </div>
          </div>

          {user ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={openNewAnimalModal}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Adicionar Animal
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
              disabled={loginBusy}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              {loginBusy ? 'Abrindo Google...' : 'Entrar com Google'}
            </button>
          )}
        </div>

        {activeTab === 'mapa' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  Mapa Real de Densidade de Abandono em Quixeramobim-CE
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada novo animal cadastrado soma +1 no bairro selecionado; ao ser adotado ou removido, o índice diminui automaticamente.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Crítico (15+)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Moderado (8-14)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Baixo (0-7)</span>
              </div>
            </div>

            <QuixeramobimRealMap
              zones={dynamicHeatZones}
              selectedZoneId={selectedZoneId}
              onSelectZone={setSelectedZoneId}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {dynamicHeatZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedZoneId === z.id
                      ? 'bg-emerald-900 text-white border-emerald-700 shadow'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{z.bairro}</p>
                  <p className={`text-[11px] mt-0.5 flex items-center justify-between ${selectedZoneId === z.id ? 'text-emerald-300' : 'text-slate-500'}`}>
                    <span>{z.ocorrencias} registros</span>
                    {z.extrasCadastrados > 0 && (
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        +{z.extrasCadastrados}
                      </span>
                    )}
                  </p>
                </button>
              ))}
            </div>

            {selectedZone && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-emerald-400">Bairro: {selectedZone.bairro}</h4>
                  <p className="text-xs text-slate-300">
                    Classificação: <strong>{selectedZone.nivel}</strong> | Total mapeado: <strong>{selectedZone.ocorrencias} animais</strong>
                    {selectedZone.extrasCadastrados > 0 && (
                      <span className="text-emerald-300"> ({selectedZone.baseOcorrencias} base + {selectedZone.extrasCadastrados} ativo(s) no sistema)</span>
                    )}
                  </p>
                </div>
                <button onClick={() => setSelectedZoneId(null)} className="text-slate-300 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">
                  Fechar
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'adocao' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-700" />
                  Buscar Animais para Adoção
                </h2>
                <div className="flex items-center gap-2">
                  {user && (
                    <button
                      onClick={openNewAnimalModal}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Adicionar Animal
                    </button>
                  )}
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                    {animaisFiltrados.length} Animais Disponíveis
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar por raça, cor, nome ou bairro..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={filtroEspecie}
                  onChange={(e) => setFiltroEspecie(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Todos">Todas as Espécies</option>
                  <option value="Cão">Cães</option>
                  <option value="Gato">Gatos</option>
                </select>

                <select
                  value={filtroPorte}
                  onChange={(e) => setFiltroPorte(e.target.value)}
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
              {animaisFiltrados.map((a) => {
                const podeGerenciar = isOwnerOfAnimal(a);
                return (
                  <div key={a.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="relative">
                        <img src={a.foto} alt={a.nome} className="w-full h-52 object-cover" />
                        <span className="absolute top-3 right-3 bg-emerald-800 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          {a.especie}
                        </span>
                        {podeGerenciar && (
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <button
                              onClick={() => openEditAnimalModal(a)}
                              title="Editar meu cadastro"
                              className="bg-white/95 hover:bg-blue-600 text-slate-800 hover:text-white p-2 rounded-lg shadow transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnimal(a)}
                              title="Excluir meu cadastro"
                              className="bg-white/95 hover:bg-red-600 text-slate-800 hover:text-white p-2 rounded-lg shadow transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
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
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span><strong>Responsável:</strong> {a.tutor}</span>
                          {podeGerenciar && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Seu cadastro
                            </span>
                          )}
                        </p>

                        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-2">
                          <strong>Saúde / Vacinação:</strong> {a.saude}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 space-y-2">
                      <a
                        href={`https://wa.me/${a.contato}?text=Olá!%20Vi%20o%20anúncio%20do(a)%20${a.nome}%20no%20sistema%20Patas%20de%20Quixeramobim.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
                      >
                        <Phone className="w-4 h-4" /> Entrar em Contato (WhatsApp)
                      </a>

                      {podeGerenciar && (
                        <div className="space-y-1.5 pt-1">
                          <button
                            onClick={() => handleMarkAsAdopted(a)}
                            className="w-full bg-amber-50 hover:bg-amber-500 text-amber-900 hover:text-white border border-amber-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5" /> Marcar como Adotado (-1 no Mapa)
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => openEditAnimalModal(a)}
                              className="w-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Editar
                            </button>
                            <button
                              onClick={() => handleDeleteAnimal(a)}
                              className="w-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              {animaisPerdidos.map((p) => (
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

        {activeTab === 'eventos' && (
          <div className="space-y-6">
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
                {eventosAdocao.map((ev) => (
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
                {pedidosMural.map((m) => (
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

      {showModalAdocao && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                {editingAnimalId ? 'Editar Meu Animal Cadastrado' : 'Adicionar Animal para Adoção'}
              </h3>
              <button
                onClick={() => {
                  setShowModalAdocao(false);
                  setEditingAnimalId(null);
                  setFormAdocao(EMPTY_ANIMAL_FORM);
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdocao} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Nome do Animal</label>
                  <input type="text" required value={formAdocao.nome} onChange={(e) => setFormAdocao({ ...formAdocao, nome: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Espécie</label>
                  <select value={formAdocao.especie} onChange={(e) => setFormAdocao({ ...formAdocao, especie: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Raça</label>
                  <input type="text" required value={formAdocao.raca} onChange={(e) => setFormAdocao({ ...formAdocao, raca: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Cor</label>
                  <input type="text" required value={formAdocao.cor} onChange={(e) => setFormAdocao({ ...formAdocao, cor: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Porte</label>
                  <select value={formAdocao.porte} onChange={(e) => setFormAdocao({ ...formAdocao, porte: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Idade Aprox.</label>
                  <input type="text" required value={formAdocao.idade} onChange={(e) => setFormAdocao({ ...formAdocao, idade: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Bairro em Quixeramobim</label>
                  <select
                    value={formAdocao.bairro}
                    onChange={(e) => setFormAdocao({ ...formAdocao, bairro: e.target.value })}
                    className="mt-1 w-full p-2 border rounded-xl text-xs bg-white"
                  >
                    {BAIRROS_QUIXERAMOBIM.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Estado de Saúde / Vacinação</label>
                <input type="text" required value={formAdocao.saude} onChange={(e) => setFormAdocao({ ...formAdocao, saude: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">Foto do Animal (Galeria, Câmera ou Link)</label>

                <input
                  ref={galleryAdocaoRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileAdocao}
                  className="hidden"
                />
                <input
                  ref={cameraAdocaoRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoFileAdocao}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => galleryAdocaoRef.current?.click()}
                    disabled={processingPhotoAdocao}
                    className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ImagePlus className="w-4 h-4" />
                    {processingPhotoAdocao ? 'Processando...' : 'Anexar Foto'}
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraAdocaoRef.current?.click()}
                    disabled={processingPhotoAdocao}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    {processingPhotoAdocao ? 'Processando...' : 'Abrir Câmera'}
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Ou cole uma URL de imagem (https://...)"
                  value={formAdocao.foto.startsWith('data:image/') ? '' : formAdocao.foto}
                  onChange={(e) => setFormAdocao({ ...formAdocao, foto: e.target.value })}
                  className="w-full p-2 border rounded-xl text-xs bg-white"
                />

                {formAdocao.foto && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-300">
                    <img
                      src={formAdocao.foto}
                      alt="Pré-visualização do animal"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormAdocao({ ...formAdocao, foto: '' })}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      Remover foto
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">WhatsApp para Contato (com DDD)</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formAdocao.contato} onChange={(e) => setFormAdocao({ ...formAdocao, contato: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button
                type="submit"
                disabled={processingPhotoAdocao}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer"
              >
                {editingAnimalId ? 'Salvar Alterações' : 'Publicar no Catálogo (+1 no Mapa)'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showModalEvento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Divulgar Evento de Adoção</h3>
              <button onClick={() => setShowModalEvento(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvento} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700">Título do Evento / Feira</label>
                <input type="text" placeholder="Ex: Feira de Adoção na Praça da Matriz" required value={formEvento.titulo} onChange={(e) => setFormEvento({ ...formEvento, titulo: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Data</label>
                  <input type="text" placeholder="DD/MM/AAAA" required value={formEvento.data} onChange={(e) => setFormEvento({ ...formEvento, data: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Horário</label>
                  <input type="text" placeholder="Ex: 08:00 às 12:00" required value={formEvento.horario} onChange={(e) => setFormEvento({ ...formEvento, horario: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Local em Quixeramobim</label>
                <input type="text" placeholder="Ex: Praça da Prefeitura" required value={formEvento.local} onChange={(e) => setFormEvento({ ...formEvento, local: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Organizador / ONG</label>
                <input type="text" placeholder="Nome do grupo ou protetor" value={formEvento.organizador} onChange={(e) => setFormEvento({ ...formEvento, organizador: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Detalhes e Documentos Exigidos</label>
                <textarea required placeholder="Ex: Levar RG e comprovante de residência..." value={formEvento.descricao} onChange={(e) => setFormEvento({ ...formEvento, descricao: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={3}></textarea>
              </div>

              <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer">
                Publicar Evento no Mural
              </button>
            </form>
          </div>
        </div>
      )}

      {showModalPerdido && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Publicar Alerta de Animal Perdido</h3>
              <button onClick={() => setShowModalPerdido(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPerdido} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Nome do Animal</label>
                  <input type="text" required value={formPerdido.nomeAnimal} onChange={(e) => setFormPerdido({ ...formPerdido, nomeAnimal: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Espécie</label>
                  <select value={formPerdido.especie} onChange={(e) => setFormPerdido({ ...formPerdido, especie: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Raça</label>
                  <input type="text" required value={formPerdido.raca} onChange={(e) => setFormPerdido({ ...formPerdido, raca: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Cor</label>
                  <input type="text" required value={formPerdido.cor} onChange={(e) => setFormPerdido({ ...formPerdido, cor: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Porte</label>
                  <select value={formPerdido.porte} onChange={(e) => setFormPerdido({ ...formPerdido, porte: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Bairro do Desaparecimento</label>
                  <select
                    value={formPerdido.bairroSumico}
                    onChange={(e) => setFormPerdido({ ...formPerdido, bairroSumico: e.target.value })}
                    className="mt-1 w-full p-2 border rounded-xl text-xs bg-white"
                  >
                    {BAIRROS_QUIXERAMOBIM.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Data do Sumiço</label>
                  <input type="text" placeholder="DD/MM/AAAA" required value={formPerdido.dataSumico} onChange={(e) => setFormPerdido({ ...formPerdido, dataSumico: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Foto do Pet Desaparecido</label>
                <input ref={galleryPerdidoRef} type="file" accept="image/*" onChange={handlePhotoFilePerdido} className="hidden" />
                <input ref={cameraPerdidoRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoFilePerdido} className="hidden" />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => galleryPerdidoRef.current?.click()}
                    disabled={processingPhotoPerdido}
                    className="bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ImagePlus className="w-4 h-4" /> Anexar Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraPerdidoRef.current?.click()}
                    disabled={processingPhotoPerdido}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4" /> Abrir Câmera
                  </button>
                </div>
                {formPerdido.foto && (
                  <img src={formPerdido.foto} alt="Prévia pet perdido" className="w-full h-32 object-cover rounded-xl border border-slate-300" />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Descrição / Características</label>
                <textarea required value={formPerdido.descricao} onChange={(e) => setFormPerdido({ ...formPerdido, descricao: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={2}></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">WhatsApp do Tutor</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formPerdido.contatoDono} onChange={(e) => setFormPerdido({ ...formPerdido, contatoDono: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <button type="submit" disabled={processingPhotoPerdido} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2 cursor-pointer">
                Publicar Alerta URGENTE
              </button>
            </form>
          </div>
        </div>
      )}

      {showModalMural && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Postar Pedido: "Quero Adotar"</h3>
              <button onClick={() => setShowModalMural(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMural} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Espécie Desejada</label>
                  <select value={formMural.especieDesejada} onChange={(e) => setFormMural({ ...formMural, especieDesejada: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Cão">Cão</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Porte Preferencial</label>
                  <select value={formMural.porteDesejado} onChange={(e) => setFormMural({ ...formMural, porteDesejado: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs">
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Preferência de Raça / Perfil</label>
                <input type="text" placeholder="Ex: Filhote, dócil..." value={formMural.racaPreferencial} onChange={(e) => setFormMural({ ...formMural, racaPreferencial: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Seu Bairro em Quixeramobim</label>
                <select
                  value={formMural.bairroMoradia}
                  onChange={(e) => setFormMural({ ...formMural, bairroMoradia: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-xl text-xs bg-white"
                >
                  {BAIRROS_QUIXERAMOBIM.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Conte sobre sua casa para os protetores</label>
                <textarea required placeholder="Ex: Tenho quintal murado..." value={formMural.descricao} onChange={(e) => setFormMural({ ...formMural, descricao: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" rows={3}></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Seu WhatsApp</label>
                <input type="text" placeholder="Ex: 5588999999999" required value={formMural.contato} onChange={(e) => setFormMural({ ...formMural, contato: e.target.value })} className="mt-1 w-full p-2 border rounded-xl text-xs" />
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