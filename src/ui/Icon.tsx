import React, { memo } from 'react';

/* O Tabler ao lado do Lucide, e só para as modalidades de exercício.

   O Lucide tem uma única figura humana em quase duas mil peças — a
   `person-standing`, parada de braços abertos —, então caminhada virava
   pegada, corrida virava velocímetro e natação virava onda: o objeto ou o
   rastro no lugar de quem se mexeu. O Tabler desenha a pessoa fazendo, e
   desenha no mesmo grid de 24 com traço redondo de 2, então as duas
   bibliotecas convivem sem que a diferença apareça.

   Os dois que sobraram em objeto não existem como gente em lugar nenhum
   do Tabler: não há ninguém levantando peso nem ninguém em cima de uma
   bicicleta. Barra e bicicleta são o que essas duas modalidades têm de
   reconhecível. */
/* Vênus e Marte vêm do Tabler porque o Lucide não os tem — e o desenho de
   uma figura humana genérica não serve aqui: com o mesmo boneco nas duas
   opções, o ícone deixa de distinguir e vira enfeite repetido. */
import IconVenus from '@tabler/icons-react-native/IconVenus';
import IconMars from '@tabler/icons-react-native/IconMars';
import IconBarbell from '@tabler/icons-react-native/IconBarbell';
import IconPhotoSpark from '@tabler/icons-react-native/IconPhotoSpark';
import IconBike from '@tabler/icons-react-native/IconBike';
import IconGymnastics from '@tabler/icons-react-native/IconGymnastics';
import IconRun from '@tabler/icons-react-native/IconRun';
import IconStretching from '@tabler/icons-react-native/IconStretching';
import IconStretching2 from '@tabler/icons-react-native/IconStretching2';
import IconSwimming from '@tabler/icons-react-native/IconSwimming';
import IconWalk from '@tabler/icons-react-native/IconWalk';
import IconYoga from '@tabler/icons-react-native/IconYoga';

import Activity from 'lucide-react-native/icons/activity';
import Ellipsis from 'lucide-react-native/icons/ellipsis';
import ArrowDown from 'lucide-react-native/icons/arrow-down';
import ArrowUp from 'lucide-react-native/icons/arrow-up';
import Bell from 'lucide-react-native/icons/bell';
import BookOpen from 'lucide-react-native/icons/book-open';
import Brain from 'lucide-react-native/icons/brain';
import CakeSlice from 'lucide-react-native/icons/cake-slice';
import Calendar from 'lucide-react-native/icons/calendar';
import Camera from 'lucide-react-native/icons/camera';
import ChartColumn from 'lucide-react-native/icons/chart-column';
import ChartLine from 'lucide-react-native/icons/chart-line';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import Clock from 'lucide-react-native/icons/clock';
import Droplet from 'lucide-react-native/icons/droplet';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import FaceNeutral from 'lucide-react-native/icons/face-neutral';
import FaceSlightlyFrowning from 'lucide-react-native/icons/face-slightly-frowning';
import FaceSlightlySmiling from 'lucide-react-native/icons/face-slightly-smiling';
import FileText from 'lucide-react-native/icons/file-text';
import Flag from 'lucide-react-native/icons/flag';
import Flame from 'lucide-react-native/icons/flame';
import Funnel from 'lucide-react-native/icons/funnel';
import AtSign from 'lucide-react-native/icons/at-sign';
import Hospital from 'lucide-react-native/icons/hospital';
import Globe from 'lucide-react-native/icons/globe';
import Mail from 'lucide-react-native/icons/mail';
import Phone from 'lucide-react-native/icons/phone';
import GlassWater from 'lucide-react-native/icons/glass-water';
import Mic from 'lucide-react-native/icons/mic';
import AudioLines from 'lucide-react-native/icons/audio-lines';
import Milk from 'lucide-react-native/icons/milk';
import CupSoda from 'lucide-react-native/icons/cup-soda';
import Citrus from 'lucide-react-native/icons/citrus';
import Wine from 'lucide-react-native/icons/wine';
import ArrowLeftRight from 'lucide-react-native/icons/arrow-left-right';
import IconBottle from '@tabler/icons-react-native/IconBottle';
import Heart from 'lucide-react-native/icons/heart';
import House from 'lucide-react-native/icons/house';
import Image from 'lucide-react-native/icons/image';
import Info from 'lucide-react-native/icons/info';
import Leaf from 'lucide-react-native/icons/leaf';
import Lightbulb from 'lucide-react-native/icons/lightbulb';
import Lock from 'lucide-react-native/icons/lock';
import LogOut from 'lucide-react-native/icons/log-out';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Moon from 'lucide-react-native/icons/moon';
import Contrast from 'lucide-react-native/icons/contrast';
import Palette from 'lucide-react-native/icons/palette';
import Pencil from 'lucide-react-native/icons/pencil';
import Pill from 'lucide-react-native/icons/pill';
import PillBottle from 'lucide-react-native/icons/pill-bottle';
import Play from 'lucide-react-native/icons/play';
import Minus from 'lucide-react-native/icons/minus';
import Plus from 'lucide-react-native/icons/plus';
import Rocket from 'lucide-react-native/icons/rocket';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import Ruler from 'lucide-react-native/icons/ruler';
import Scale from 'lucide-react-native/icons/scale';
import Send from 'lucide-react-native/icons/send';
import Settings from 'lucide-react-native/icons/settings';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import Soup from 'lucide-react-native/icons/soup';
import Sparkle from 'lucide-react-native/icons/sparkle';
import Sparkles from 'lucide-react-native/icons/sparkles';
import Stethoscope from 'lucide-react-native/icons/stethoscope';
import Sun from 'lucide-react-native/icons/sun';
import Trash from 'lucide-react-native/icons/trash';
import Watch from 'lucide-react-native/icons/watch';
import Wallet from 'lucide-react-native/icons/wallet';
import MapPin from 'lucide-react-native/icons/map-pin';
import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import Coffee from 'lucide-react-native/icons/coffee';
import Sandwich from 'lucide-react-native/icons/sandwich';
import UtensilsCrossed from 'lucide-react-native/icons/utensils-crossed';
import Syringe from 'lucide-react-native/icons/syringe';
import Target from 'lucide-react-native/icons/target';
import ThumbsDown from 'lucide-react-native/icons/thumbs-down';
import ThumbsUp from 'lucide-react-native/icons/thumbs-up';
import Toilet from 'lucide-react-native/icons/toilet';
import TrendingUp from 'lucide-react-native/icons/trending-up';
import Trophy from 'lucide-react-native/icons/trophy';
import Star from 'lucide-react-native/icons/star';
import User from 'lucide-react-native/icons/user';
import Utensils from 'lucide-react-native/icons/utensils';
import WavesHorizontal from 'lucide-react-native/icons/waves-horizontal';
import X from 'lucide-react-native/icons/x';
import Zap from 'lucide-react-native/icons/zap';

/* ============================================================
   ÍCONES

   Eram 68 paths desenhados à mão, herdados do protótipo. Serviram
   enquanto o app tinha vinte telas; com sessenta, cada ícone novo virava
   uma decisão de desenho, e os que existiam iam ficando desiguais — o
   halter lia como uma seta de tanto colapsar em 19px.

   Agora vêm do Lucide, que é a mesma família geométrica do que já estava
   aqui: grade de 24, traço aberto, pontas redondas. A troca é invisível
   na maioria dos ícones e conserta os que não estavam funcionando.

   A API não mudou: as telas continuam pedindo `<Icon name="water" />`.
   O mapa abaixo é a única coisa que sabe o nome do ícone lá dentro, então
   trocar de biblioteca de novo é reescrever este arquivo e mais nada.

   Import por arquivo, e não do índice: o índice traz os 1839 ícones da
   biblioteca para o bundle, e a gente usa 68.
   ============================================================ */
const MAPA: Record<string, React.ComponentType<any>> = {
  home: House,
  journey: Flag,
  minus: Minus,
  plus: Plus,
  evolution: TrendingUp,
  companion: MessageCircle,
  back: ChevronLeft,
  x: X,
  trash: Trash,
  watch: Watch,
  wallet: Wallet,
  pin: MapPin,
  /* ⚠️ NENHUM DESTES É A MARCA DE NINGUÉM. A linha do WhatsApp usa o
     balão de conversa e a do Instagram usa o arroba — o nome do serviço
     está escrito na linha, que é o que a pessoa precisa para saber onde
     o toque vai dar. Reproduzir o logotipo alheio é outra conversa, e
     esta casa não tem essa conversa com ninguém. */
  /* ⚠️ A CLÍNICA NÃO É UM CORAÇÃO. O coração estava na ação "Clínica" da
     área médica e da ficha de quem atende, e ele é o desenho de "salvar
     nos favoritos" em metade dos aplicativos do mundo — quem toca espera
     marcar, e chega numa tela de endereço e convênios. É um prédio: o
     que está do outro lado do toque é um LUGAR. */
  clinica: Hospital,
  phone: Phone,
  mail: Mail,
  site: Globe,
  at: AtSign,
  alerta: TriangleAlert,
  chev: ChevronRight,
  check: Check,
  water: GlassWater,
  flame: Flame,
  moon: Moon,
  /* O disco meio cheio — o desenho que os sistemas usam para "siga o
     aparelho" na escolha de tema. */
  contrast: Contrast,
  bolt: Zap,
  mood: FaceSlightlySmiling,
  meh: FaceNeutral,
  /* A tigela é o jantar. A chave se chamava `full` e não era usada em
     lugar nenhum — nome de sentimento para um desenho de prato. */
  soup: Soup,
  gut: Toilet,
  pill: Pill,
  syringe: Syringe,
  scale: Scale,
  camera: Camera,
  target: Target,
  cal: Calendar,
  clock: Clock,
  steth: Stethoscope,
  send: Send,
  sun: Sun,
  /* As refeições, cada uma pelo que se come nela. O talher CRUZADO é o
     almoço; o talher paralelo (`utensils`, logo abaixo) continua sendo a
     categoria Alimentação no resto do app. São dois desenhos parecidos
     de propósito — mesma família, níveis diferentes —, mas o cruzado é
     a marca clássica de refeição principal e se distingue no tamanho em
     que a lista desenha. */
  /* A foto com a estrelinha: é o desenho que virou convenção para
     "imagem que a máquina vai ler". O Tabler também tem uma câmera com
     as letras A e I, mas letra é idioma e a estrela não é. */
  photoSpark: IconPhotoSpark,
  coffee: Coffee,
  cutlery: UtensilsCrossed,
  sandwich: Sandwich,
  aura: Sparkles,
  doc: FileText,
  ruler: Ruler,
  photo: Image,
  reset: RotateCcw,
  chart: ChartLine,
  trend: TrendingUp,
  bell: Bell,
  book: BookOpen,
  spark: Sparkle,
  drop2: Droplet,
  /* As bebidas que contam na hidratação — ver src/logic/bebidas.ts. O chá
     usa a folha, que é o que ele é; o café tem xícara própria logo acima. */
  milk: Milk,
  soda: CupSoda,
  citrus: Citrus,
  wine: Wine,
  /* A troca: duas setas em sentidos opostos. O círculo de recarregar
     dizia "atualizar", que é uma operação; aqui o assunto é que os dois
     lados conversam. */
  troca: ArrowLeftRight,
  /* A garrafa de coqueteleira — o shake. */
  shaker: IconBottle,
  /* ⚠️ O DITADO TEM DOIS DESENHOS PORQUE TEM DOIS ESTADOS. O microfone
     parado convida; as ondas confirmam que alguém está ouvindo. Um só
     ícone teria de carregar as duas coisas com a cor, e cor sozinha não
     diz a diferença entre "toque para falar" e "estou gravando". */
  mic: Mic,
  ondas: AudioLines,
  leaf: Leaf,
  arrowdown: ArrowDown,
  arrowup: ArrowUp,
  dose: PillBottle,
  info: Info,
  play: Play,
  chevdown: ChevronDown,
  chevup: ChevronUp,
  user: User,
  venus: IconVenus,
  mars: IconMars,
  activity: Activity,
  barchart: ChartColumn,
  brain: Brain,
  dumbbell: Dumbbell,
  waves: WavesHorizontal,
  cupcake: CakeSlice,
  rocket: Rocket,
  shield: ShieldCheck,
  filter: Funnel,
  trophy: Trophy,
  star: Star,
  bulb: Lightbulb,
  thumbup: ThumbsUp,
  thumbdown: ThumbsDown,
  palette: Palette,
  logout: LogOut,
  gear: Settings,
  heart: Heart,
  pencil: Pencil,
  utensils: Utensils,
  frown: FaceSlightlyFrowning,
  lock: Lock,
  /* As modalidades de exercício, em gente fazendo (Tabler). Nomeadas
     pelo desenho e não pela modalidade, como o resto do mapa: `lunge` é
     a pessoa em avanço, e quem escolhe o que ela representa é a tela. */
  walk: IconWalk,
  run: IconRun,
  swim: IconSwimming,
  yoga: IconYoga,
  gymnastics: IconGymnastics,
  stretch: IconStretching,
  lunge: IconStretching2,
  barbell: IconBarbell,
  bike: IconBike,
  more: Ellipsis,
};

export const Icon = memo(function Icon({
  name, size = 20, color = '#0F2E38', sw = 1.7,
}: { name: string; size?: number; color?: string; sw?: number }) {
  const Glifo = MAPA[name];
  if (!Glifo) return null;
  return <Glifo size={size} color={color} strokeWidth={sw} />;
});
