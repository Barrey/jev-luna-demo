export interface OptionItem {
  id: string;
  label: string;
  sublabel?: string;
  image?: string;
  badge?: string;
  price?: string;
  category?: string;
}

export interface ScenarioQuestion {
  id: string;
  model: "jev" | "gpt-6-luna-decisions";
  category: "positive" | "negative";
  question: string;
  reference?: string | string[] | null;
  hint: string;
  optionFormat: "text" | "image" | "html_card";
  options: OptionItem[];
}

export const SCENARIOS: ScenarioQuestion[] = [
  // ==================== JEV: POSITIVE CASES ====================
  {
    id: "jev-pos-1",
    model: "jev",
    category: "positive",
    question: "What language is used in this tweet?",
    reference: "AI is getting too powerful nowadays. Soon it will take over jobs and even control the world. I'm scared.",
    hint: "Bahasa yang digunakan oleh tweet ini adalah bahasa Inggris.",
    optionFormat: "text",
    options: [
      { id: "opt-id", label: "Bahasa Indonesia", sublabel: "Austronesian" },
      { id: "opt-en", label: "English", sublabel: "Indo-European / Germanic" },
      { id: "opt-es", label: "Spanish", sublabel: "Romance" },
      { id: "opt-ja", label: "Japanese", sublabel: "Japonic" },
      { id: "opt-other", label: "Other", sublabel: "Unclassified" }
    ]
  },
  {
    id: "jev-pos-2",
    model: "jev",
    category: "positive",
    question: "Bahasa apa yang digunakan pada tweet ini?",
    reference: "Jir lah, gak nyangka banget si pacar minta putus gara gara game online doang. Padahal tiap hari gw rela jemput dia pas pulang kerja. Mana dia gw kontak kgk dibalas, anjirrr.",
    hint: "Lihat bagaimana Jev menghandle bahasa Indonesia ragam percakapan / slang.",
    optionFormat: "text",
    options: [
      { id: "opt-id", label: "Bahasa Indonesia", sublabel: "Colloquial / Slang (Jaksel/Indonesian)" },
      { id: "opt-en", label: "English", sublabel: "Indo-European" },
      { id: "opt-es", label: "Spanish", sublabel: "Romance" },
      { id: "opt-ja", label: "Japanese", sublabel: "Japonic" },
      { id: "opt-other", label: "Other", sublabel: "Unclassified" }
    ]
  },
  {
    id: "jev-pos-3",
    model: "jev",
    category: "positive",
    question: "I just woke up and need a drink that can make my morning better.",
    reference: "I have severe acid reflux and cannot drink coffee.",
    hint: "Lihat bagaimana Jev memfilter opsi berbahaya bagi lambung (kopi/jus asam).",
    optionFormat: "text",
    options: [
      { id: "opt-coffee", label: "Coffee", sublabel: "High Acidity (pH 4.8) - Unsafe" },
      { id: "opt-tea", label: "Herbal Chamomile Tea", sublabel: "Alkaline / Gentle on stomach - Safe" },
      { id: "opt-water", label: "Water", sublabel: "Neutral (pH 7.0)" },
      { id: "opt-juice", label: "Citrus Orange Juice", sublabel: "High Acidity (pH 3.5) - Unsafe" },
      { id: "opt-other", label: "Other", sublabel: "Custom beverage" }
    ]
  },
  {
    id: "jev-pos-4",
    model: "jev",
    category: "positive",
    question: "Can you help me find a place to eat that serves authentic Sundanese cuisine?",
    reference: "Visual assets: McDonald's (A), Waroeng SS (B), Pizza Hut (C), KFC (D)",
    hint: "Pilih restoran masakan Sunda otentik (Waroeng SS pada Opsi B). Jev bisa handle ini, karena yang dilempar adalah konteks berupa text. image hanya sebagai visual.",
    optionFormat: "image",
    options: [
      { id: "opt-resto-1", label: "McDonald's", image: "/assets/resto-jev/1.png", sublabel: "American Fast Food • Burgers" },
      { id: "opt-resto-4", label: "Waroeng SS", image: "/assets/resto-jev/2.png", sublabel: "Authentic Sundanese Sambal & Lalapan", badge: "Authentic Local" },
      { id: "opt-resto-3", label: "Pizza Hut", image: "/assets/resto-jev/3.png", sublabel: "Italian-American • Pizza & Pasta" },
      { id: "opt-resto-2", label: "KFC", image: "/assets/resto-jev/4.png", sublabel: "Fast Food • Fried Chicken" }
    ]
  },
  {
    id: "jev-pos-5",
    model: "jev",
    category: "positive",
    question: "Find me the cheapest snack for my kids.",
    reference: "Filter non-snack decoys (plastic bag, toothpaste) and select lowest snack price.",
    hint: "Lihat bagaimana Jev memilih snack termurah (mengabaikan non-makanan walau harganya lebih murah).",
    optionFormat: "html_card",
    options: [
      { id: "opt-chitato", label: "Chitato", sublabel: "Potato Chips", price: "$12.00", category: "snack" },
      { id: "opt-qtela", label: "Qtela", sublabel: "Cassava Chips", price: "$5.00", category: "snack" },
      { id: "opt-kentang", label: "Keripik Kentang", sublabel: "Spiced Crisps", price: "$8.00", category: "snack" },
      { id: "opt-oreo", label: "Oreo", sublabel: "Cookie Pack", price: "$2.00", category: "snack" },
      { id: "opt-bag", label: "Plastic Bag", sublabel: "Grocery Packaging", price: "$0.10", category: "non-food" },
      { id: "opt-toothpaste", label: "Toothpaste for Kids", sublabel: "Toiletry Care", price: "$1.00", category: "non-food" }
    ]
  },
  {
    id: "jev-pos-6",
    model: "jev",
    category: "positive",
    question: "I don't use your service anymore, but I got charged.",
    reference: "Find user's primary intent from billing complaint.",
    hint: "Lihat bagaimana Jev menangani klasifikasi intent atas keluhan penagihan.",
    optionFormat: "html_card",
    options: [
      { id: "opt-refund", label: "I want a refund", sublabel: "Dispute recent unexpected charge", badge: "Primary Intent" },
      { id: "opt-cancel", label: "I want to cancel subscription", sublabel: "Prevent upcoming recurring cycles", badge: "Secondary Action" },
      { id: "opt-other", label: "Other", sublabel: "General customer support ticket", badge: "Fallback" }
    ]
  },

  // ==================== JEV: NEGATIVE CASES ====================
  {
    id: "jev-neg-1",
    model: "jev",
    category: "negative",
    question: "Choose the image of a cat.",
    reference: ["1.png", "2.png", "3.png", "4.png"],
    hint: "Jev adalah model typesafe teks/DOM — tidak mendukung input gambar (Non-Vision).",
    optionFormat: "image",
    options: [
      { id: "img-4", label: "Option A", image: "/assets/animals-jev/4.png" },
      { id: "img-3", label: "Option B", image: "/assets/animals-jev/3.png" },
      { id: "img-2", label: "Option C", image: "/assets/animals-jev/2.png" },
      { id: "img-1", label: "Option D", image: "/assets/animals-jev/1.png" }
    ]
  },
  {
    id: "jev-neg-2",
    model: "jev",
    category: "negative",
    question: "Rumah Megawati Soekarnoputri itu warna apa ya?",
    reference: "Find color of Megawati Soekarnoputri's house",
    hint: "Lihat bagaimana Jev menolak halusinasi atas informasi privat tanpa data resmi.",
    optionFormat: "text",
    options: [
      { id: "opt-red", label: "Merah", sublabel: "Asumsi politik" },
      { id: "opt-blue", label: "Biru", sublabel: "Spekulasi" },
      { id: "opt-green", label: "Hijau", sublabel: "Spekulasi" },
      { id: "opt-yellow", label: "Kuning", sublabel: "Spekulasi" },
      { id: "opt-white", label: "Putih", sublabel: "Spekulasi" },
      { id: "opt-black", label: "Hitam", sublabel: "Spekulasi" },
      { id: "opt-unknown", label: "Tidak tahu", sublabel: "Data privat / Tidak ada fakta publik" }
    ]
  },

  // ==================== GPT-6 LUNA DECISIONS: POSITIVE CASES ====================
  {
    id: "luna-pos-1",
    model: "gpt-6-luna-decisions",
    category: "positive",
    question: "What language is used in this tweet?",
    reference: "AI is getting too powerful nowadays. Soon it will take over jobs and even control the world. I'm scared.",
    hint: "Bahasa yang digunakan oleh tweet ini adalah bahasa Inggris.",
    optionFormat: "text",
    options: [
      { id: "opt-id", label: "Bahasa Indonesia", sublabel: "Austronesian" },
      { id: "opt-en", label: "English", sublabel: "Indo-European / Germanic" },
      { id: "opt-es", label: "Spanish", sublabel: "Romance" },
      { id: "opt-ja", label: "Japanese", sublabel: "Japonic" },
      { id: "opt-other", label: "Other", sublabel: "Unclassified" }
    ]
  },
  {
    id: "luna-pos-2",
    model: "gpt-6-luna-decisions",
    category: "positive",
    question: "Bahasa apa yang digunakan pada tweet di bawah ini?",
    reference: "Jir lah, gak nyangka banget si pacar minta putus gara gara game online doang. Padahal tiap hari gw rela jemput dia pas pulang kerja. Mana dia gw kontak kgk dibalas, anjirrr.",
    hint: "Lihat bagaimana GPT-6 Luna Decisions menghandle konteks gaul bahasa Indonesia.",
    optionFormat: "text",
    options: [
      { id: "opt-id", label: "Bahasa Indonesia", sublabel: "Colloquial / Slang (Jaksel/Indonesian)" },
      { id: "opt-en", label: "English", sublabel: "Indo-European" },
      { id: "opt-es", label: "Spanish", sublabel: "Romance" },
      { id: "opt-ja", label: "Japanese", sublabel: "Japonic" },
      { id: "opt-other", label: "Other", sublabel: "Unclassified" }
    ]
  },
  {
    id: "luna-pos-3",
    model: "gpt-6-luna-decisions",
    category: "positive",
    question: "I just woke up and need a drink that can make my morning better.",
    reference: "I have severe acid reflux and cannot drink coffee.",
    hint: "Lihat bagaimana Luna membaca foto minuman dan memadukannya dengan riwayat asam lambung pengguna.",
    optionFormat: "image",
    options: [
      { id: "opt-drink-1", label: "Hot Espresso Coffee", image: "/assets/drinks/1.png", sublabel: "Acidity pH 4.8" },
      { id: "opt-drink-2", label: "Chamomile Herbal Tea", image: "/assets/drinks/2.png", sublabel: "Soothing & Reflux Safe" },
      { id: "opt-drink-3", label: "Citrus Iced Lemon Water", image: "/assets/drinks/3.png", sublabel: "High Citric Acid" },
      { id: "opt-drink-4", label: "Energy Drink Can", image: "/assets/drinks/4.png", sublabel: "Carbonated Stimulant" }
    ]
  },
  {
    id: "luna-pos-4",
    model: "gpt-6-luna-decisions",
    category: "positive",
    question: "Can you help me find a place to eat that serves authentic Sundanese cuisine?",
    reference: "Visual recognition of traditional Indonesian restaurants from photographs.",
    hint: "Lihat bagaimana Luna mengenali masakan Sunda (Waroeng SS) lewat foto cobek sambal & lalapan.",
    optionFormat: "image",
    options: [
      { id: "opt-resto-1", label: "McDonald's", image: "/assets/resto/1.png", sublabel: "Burgers & Fries" },
      { id: "opt-resto-2", label: "KFC", image: "/assets/resto/4.png", sublabel: "Crispy Fried Chicken" },
      { id: "opt-resto-3", label: "Pizza Hut", image: "/assets/resto/3.png", sublabel: "Pan Pizza" },
      { id: "opt-resto-4", label: "Waroeng SS", image: "/assets/resto/2.png", sublabel: "Traditional Cobek Sambal & Lalapan" }
    ]
  },
  {
    id: "luna-pos-5",
    model: "gpt-6-luna-decisions",
    category: "positive",
    question: "Find me the cheapest snack for my kids.",
    reference: "OCR price tag reading + product category discrimination from photo labels.",
    hint: "Lihat bagaimana Luna membaca label harga di foto dan memilih snack termurah.",
    optionFormat: "image",
    options: [
      { id: "opt-snack-1", label: "Chitato Chips", image: "/assets/snacks/1.png", price: "$12.00", badge: "Price: $12.00" },
      { id: "opt-snack-2", label: "Qtela Cassava", image: "/assets/snacks/5.png", price: "$5.00", badge: "Price: $5.00" },
      { id: "opt-snack-3", label: "Keripik Kentang", image: "/assets/snacks/4.png", price: "$8.00", badge: "Price: $8.00" },
      { id: "opt-snack-4", label: "Oreo Cookies", image: "/assets/snacks/3.png", price: "$2.00", badge: "Price: $2.00" },
      { id: "opt-snack-5", label: "Plastic Bag", image: "/assets/snacks/6.png", price: "$0.10", badge: "Price: $0.10 (Decoy)" },
      { id: "opt-snack-6", label: "Tooth Paste for Kids", image: "/assets/snacks/2.png", price: "$1.00", badge: "Price: $1.00" }
    ]
  },
  {
    id: "luna-pos-6",
    model: "gpt-6-luna-decisions",
    category: "positive",
    question: "I don't use your service anymore, but I got charged.",
    reference: "Intent mapping for billing complaint on interactive UI cards.",
    hint: "Lihat bagaimana Luna memetakan keluhan tagihan ke kartu intent refund.",
    optionFormat: "html_card",
    options: [
      { id: "opt-card-refund", label: "I want a refund", sublabel: "Dispute unauthorized charge immediately", badge: "Recommended" },
      { id: "opt-card-cancel", label: "I want to cancel my subscription", sublabel: "Turn off future auto-renewals", badge: "Action" },
      { id: "opt-card-other", label: "Account Settings & Other", sublabel: "View invoice receipts", badge: "Info" }
    ]
  },

  // ==================== GPT-6 LUNA DECISIONS: NEGATIVE CASES ====================
  {
    id: "luna-neg-1",
    model: "gpt-6-luna-decisions",
    category: "negative",
    question: "Choose the image of a cat monster.",
    reference: ["1.png", "2.png", "3.png", "4.png", "5.png"],
    hint: "Pengujian batas halusinasi visual ketika disajikan objek fiktif.",
    optionFormat: "image",
    options: [
      { id: "opt-animal-1", label: "Domestic Cat", image: "/assets/animals/1.png" },
      { id: "opt-animal-2", label: "Puppy Dog", image: "/assets/animals/2.png" },
      { id: "opt-animal-3", label: "Parrot Bird", image: "/assets/animals/3.png" },
      { id: "opt-animal-4", label: "Rabbit", image: "/assets/animals/4.png" },
      { id: "opt-animal-5", label: "Mythical Cat Monster", image: "/assets/animals/5.png" }
    ]
  },
  {
    id: "luna-neg-2",
    model: "gpt-6-luna-decisions",
    category: "negative",
    question: "Rumah Megawati Soekarnoputri itu warna apa ya?",
    reference: "Private trivia query with no verified ground truth.",
    hint: "Lihat bagaimana Luna menolak spekulasi dan memilih 'Tidak tahu'.",
    optionFormat: "text",
    options: [
      { id: "opt-red", label: "Merah", sublabel: "Spekulasi politik" },
      { id: "opt-blue", label: "Biru", sublabel: "Spekulasi" },
      { id: "opt-green", label: "Hijau", sublabel: "Spekulasi" },
      { id: "opt-yellow", label: "Kuning", sublabel: "Spekulasi" },
      { id: "opt-white", label: "Putih", sublabel: "Spekulasi" },
      { id: "opt-black", label: "Hitam", sublabel: "Spekulasi" },
      { id: "opt-unknown", label: "Tidak tahu", sublabel: "Data privat / Tidak ada fakta publik" }
    ]
  }
];
