import { Post } from "@/components/PostCard";
import { Comment } from "@/components/CommentItem";

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    content: "Udah semester akhir tapi rasanya stuck banget ngerjain skripsi. Kadang ngerasa bersalah sama orang tua karena belum lulus-lulus. Ada yang ngerasain hal yang sama? 😭",
    mood: "Overthinking",
    createdAt: "10 menit yang lalu",
    isAnonymous: true,
    author: {
      nickname: "Anonim",
      avatar: "👻",
    },
    likes: 24,
    commentsCount: 3,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "post-2",
    content: "Hari ini capek banget abis ngerjain tugas kelompok sendirian karena yang lain pada ilang-ilangan. Tapi untung tugasnya kelar dan dapet pujian dari dosen. Sedih tapi bangga dikit lah.",
    mood: "Capek",
    createdAt: "1 jam yang lalu",
    isAnonymous: false,
    author: {
      nickname: "Rara🦊",
      avatar: "🦊",
    },
    likes: 42,
    commentsCount: 2,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "post-3",
    content: "Pengen banget punya temen ngobrol malam-malam gini yang sehobi (suka dengerin lofi & baca buku). Kadang sepi banget kalo malem, pikiran ke mana-mana.",
    mood: "Butuh Teman",
    createdAt: "2 jam yang lalu",
    isAnonymous: true,
    author: {
      nickname: "Anonim",
      avatar: "👻",
    },
    likes: 18,
    commentsCount: 4,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "post-4",
    content: "YESSS! Akhirnya keterima magang di perusahaan impian setelah ditolak 7 kali berturut-turut! Jangan patah semangat ya guys, perjuangan kalian pasti bakal berbuah manis! ✨✊",
    mood: "Lega",
    createdAt: "5 jam yang lalu",
    isAnonymous: false,
    author: {
      nickname: "Bobi🐼",
      avatar: "🐼",
    },
    likes: 112,
    commentsCount: 8,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "post-5",
    content: "Lagi ngerasa asing di circle sendiri. Rasanya mereka punya topik obrolan baru yang aku ga tau sama sekali. Cuma bisa senyum palsu pas kumpul. Sakit bgt tapi ya sudahlah.",
    mood: "Kecewa",
    createdAt: "1 hari yang lalu",
    isAnonymous: true,
    author: {
      nickname: "Anonim",
      avatar: "👻",
    },
    likes: 31,
    commentsCount: 5,
    isLiked: false,
    isBookmarked: false,
  },
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  "post-1": [
    {
      id: "comment-1-1",
      content: "Sama banget kak! Aku juga semester 8 skripsi masih bab 2. Jangan berkecil hati ya, kita berjuang bareng-bareng! Semangat!",
      createdAt: "8 menit yang lalu",
      isAnonymous: false,
      author: {
        nickname: "Roni🐨",
        avatar: "🐨",
      },
      likes: 8,
      isLiked: false,
    },
    {
      id: "comment-1-2",
      content: "Orang tua pasti ngerti perjuangan kita kok. Ambil nafas dulu sebentar, jangan dipaksa kalo lagi bener-bener mentok.",
      createdAt: "5 menit yang lalu",
      isAnonymous: true,
      author: {
        nickname: "Anonim",
        avatar: "👻",
      },
      likes: 4,
      isLiked: false,
    },
    {
      id: "comment-1-3",
      content: "Peluk jauh! 🫂 Ingat ya, lulus di waktu yang tepat itu nyata. Ga usah dengerin omongan orang lain.",
      createdAt: "2 menit yang lalu",
      isAnonymous: false,
      author: {
        nickname: "Mimi🐰",
        avatar: "🐰",
      },
      likes: 3,
      isLiked: true,
    },
  ],
  "post-2": [
    {
      id: "comment-2-1",
      content: "Keren banget kak bisa kelarin sendiri! Tapi lain kali kalo kerja kelompok harusnya lapor dosen aja biar adil.",
      createdAt: "45 menit yang lalu",
      isAnonymous: false,
      author: {
        nickname: "Tono🐙",
        avatar: "🐙",
      },
      likes: 12,
      isLiked: false,
    },
    {
      id: "comment-2-2",
      content: "Kamu hebat banget! Capeknya bakal kebayar dengan nilai yang berkah dan skill yang nambah. Semangat istirahat yaa.",
      createdAt: "30 menit yang lalu",
      isAnonymous: false,
      author: {
        nickname: "Cica🐱",
        avatar: "🐱",
      },
      likes: 15,
      isLiked: true,
    },
  ],
  "post-3": [
    {
      id: "comment-3-1",
      content: "Halo! Aku juga suka denger lofi malam-malam. Kalo mau ngobrol santai boleh banget loh.",
      createdAt: "1 jam yang lalu",
      isAnonymous: false,
      author: {
        nickname: "Lala🐤",
        avatar: "🐤",
      },
      likes: 5,
      isLiked: false,
    },
    {
      id: "comment-3-2",
      content: "Sama, lofi emang penyelamat pas overthinking malem-malem gini. Dengerin playlist ChilledCow deh kak.",
      createdAt: "45 menit yang lalu",
      isAnonymous: true,
      author: {
        nickname: "Anonim",
        avatar: "👻",
      },
      likes: 2,
      isLiked: false,
    },
  ],
};

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "like",
    content: "menyukai curhatanmu tentang 'Udah semester akhir...'",
    author: { nickname: "Mimi🐰", avatar: "🐰" },
    createdAt: "3 menit yang lalu",
    unread: true,
  },
  {
    id: "notif-2",
    type: "comment",
    content: "membalas curhatanmu: 'Peluk jauh! 🫂 Ingat ya, lulus...'",
    author: { nickname: "Mimi🐰", avatar: "🐰" },
    createdAt: "5 menit yang lalu",
    unread: true,
  },
  {
    id: "notif-3",
    type: "like",
    content: "menyukai balasan komentarmu di curhatan Rara🦊",
    author: { nickname: "Rara🦊", avatar: "🦊" },
    createdAt: "2 jam yang lalu",
    unread: false,
  },
];
