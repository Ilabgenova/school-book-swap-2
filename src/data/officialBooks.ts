export interface OfficialBook {
  id: string;
  title: string;
  author?: string;
  subject: string;
  publisher: string;
  isbn?: string;
  price?: number;
  availableFromPreviousYear: boolean;
  externalPurchaseUrl?: string;
  grade: string;
  program: string;
  isSummerReading?: boolean;
}

export interface BookListing {
  id: string;
  type: "sale" | "exchange" | "donation";
  price?: number;
  condition: "new" | "asNew" | "used";
  sellerId: string;
  sellerRating: number;
  sellerName: string;
  sellerCompletedExchanges: number;
}

// DP Subject Groups for subject selection
export const dpSubjectGroups = {
  group1: {
    name: "Studies in Language and Literature",
    subjects: ["English A: Language and Literature", "English A: Literature", "Italian A: Language and Literature"]
  },
  group2: {
    name: "Language Acquisition",
    subjects: ["Italian B", "Spanish B", "French B", "German B", "Italian ab initio"]
  },
  group3: {
    name: "Individuals and Societies",
    subjects: ["History", "Geography", "Economics", "Business Management", "Psychology"]
  },
  group4: {
    name: "Sciences",
    subjects: ["Physics", "Chemistry", "Biology", "Computer Science", "Environmental Systems and Societies"]
  },
  group5: {
    name: "Mathematics",
    subjects: ["Mathematics: Analysis and Approaches HL", "Mathematics: Analysis and Approaches SL", "Mathematics: Applications and Interpretation HL", "Mathematics: Applications and Interpretation SL"]
  },
  group6: {
    name: "The Arts",
    subjects: ["Visual Arts", "Music", "Theatre", "Film"]
  },
  core: {
    name: "DP Core",
    subjects: ["Theory of Knowledge (TOK)", "Extended Essay", "CAS"]
  }
};

// School Year 2025-2026 Official Book List - Real Data
export const officialBooks: OfficialBook[] = [
  // ==================== MYP 1 ====================
  { id: "myp1-1", title: "Pearson MYP English Language Acquisition (Proficient) 2nd", author: "Irina Birajdar, Ingrid Perera, Rebecca Grieve, Danielle Steyn", subject: "English", publisher: "Pearson", isbn: "9781292958514", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958514", grade: "MYP 1", program: "MYP" },
  { id: "myp1-2", title: "Pearson MYP English Language Acquisition (Capable) 2nd Edition", author: "Saranya Srinivasan, Ingrid Perera, Rebecca Greive", subject: "English", publisher: "Pearson", isbn: "9781292958521", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958521", grade: "MYP 1", program: "MYP" },
  { id: "myp1-3", title: "MYP Geography for years 1-3, Hodder", author: "A Dharani, R Zeller", subject: "Geography", publisher: "Hodder", isbn: "9781510425804", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425804", grade: "MYP 1", program: "MYP" },
  { id: "myp1-4", title: "MYP History: a concept-based approach years 1-3, Hodder", author: "Jo Thomas", subject: "History", publisher: "Hodder", isbn: "9781471841521", price: 49.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841521", grade: "MYP 1", program: "MYP" },
  { id: "myp1-5", title: "Mathematics for MYP 1, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing, Aidan Sproat-Clements, Talei Kunkel", subject: "Mathematics", publisher: "Hodder", isbn: "9781471880919", price: 46.68, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471880919", grade: "MYP 1", program: "MYP" },
  { id: "myp1-6", title: "MYP Biology years 1-3, Hodder", author: "Andrew Davis, Patricia Deo", subject: "Science", publisher: "Hodder", isbn: "9781510425781", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425781", grade: "MYP 1", program: "MYP" },
  { id: "myp1-7", title: "MYP Chemistry years 1-3, Hodder", author: "Annie Termaat & Gary Horner", subject: "Science", publisher: "Hodder", isbn: "9781510425750", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425750", grade: "MYP 1", program: "MYP" },
  { id: "myp1-8", title: "MYP Physics years 1-3, Hodder", author: "William Heathcote", subject: "Science", publisher: "Hodder", isbn: "9781510425798", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425798", grade: "MYP 1", program: "MYP" },
  { id: "myp1-9", title: "Forte! 1 – Italian for school students", author: "L. Maddii, M.C. Borgogni", subject: "Italian", publisher: "Edilingua", isbn: "9788899358570", price: 28.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788899358570", grade: "MYP 1", program: "MYP" },
  { id: "myp1-10", title: "Forte! 2 – Italian for school students", author: "L. Maddii, M.C. Borgogni", subject: "Italian", publisher: "Edilingua", isbn: "9788899358624", price: 28.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788899358624", grade: "MYP 1", program: "MYP" },
  { id: "myp1-11", title: "Letture in gioco 2", author: "A Anelli, D Viola", subject: "Italian", publisher: "La Spiga Edizioni", isbn: "9788846838766", price: 8.10, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788846838766", grade: "MYP 1", program: "MYP" },
  { id: "myp1-12", title: "Parola chiave A2", author: "F. Ferraris", subject: "Italian", publisher: "Mondadori Education", isbn: "9788800357128", price: 12.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788800357128", grade: "MYP 1", program: "MYP" },
  { id: "myp1-13", title: "Forte! 3 – Italian for school students", author: "L. Maddii, M.C. Borgogni, S.Servetti", subject: "Italian", publisher: "Edilingua", isbn: "9789606632570", price: 28.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9789606632570", grade: "MYP 1", program: "MYP" },
  { id: "myp1-14", title: "Promessi sposi", author: "A. Manzoni adapted by E. Lovato", subject: "Italian", publisher: "Eli", isbn: "9788853628206", price: 11.20, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788853628206", grade: "MYP 1", program: "MYP" },
  { id: "myp1-15", title: "Letture in gioco 1", author: "A Anelli, D Viola", subject: "Italian", publisher: "La Spiga Edizioni", isbn: "9788846838759", price: 8.10, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788846838759", grade: "MYP 1", program: "MYP" },
  { id: "myp1-16", title: "NUOVO CONTATTO A1/A2", author: "BOZZONE COSTA R., GHEZZI C., PIANTONI M.", subject: "Italian", publisher: "Loescher", isbn: "9788820136901", price: 26.90, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788820136901", grade: "MYP 1", program: "MYP" },
  { id: "myp1-17", title: "IB MYP Global contexts 1-3", author: "SECOND EDITION Talei Kunkel, Danielle Trynoski et al.", subject: "Multi-subject", publisher: "Hodder", isbn: "9781398393677", price: 35.75, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781398393677", grade: "MYP 1", program: "MYP" },
  
  // ==================== MYP 2 ====================
  { id: "myp2-1", title: "MYP Geography for years 1-3, Hodder", author: "A Dharani, R Zeller", subject: "Geography", publisher: "Hodder", isbn: "9781510425804", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425804", grade: "MYP 2", program: "MYP" },
  { id: "myp2-2", title: "MYP History: a concept-based approach years 1-3, Hodder", author: "Jo Thomas", subject: "History", publisher: "Hodder", isbn: "9781471841521", price: 49.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841521", grade: "MYP 2", program: "MYP" },
  { id: "myp2-3", title: "Mathematics for MYP 2, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing, Aidan Sproat-Clements, Talei Kunkel", subject: "Mathematics", publisher: "Hodder", isbn: "9781471880957", price: 46.68, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471880957", grade: "MYP 2", program: "MYP" },
  { id: "myp2-4", title: "MYP Biology years 1-3, Hodder", author: "Andrew Davis, Patricia Deo", subject: "Science", publisher: "Hodder", isbn: "9781510425781", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425781", grade: "MYP 2", program: "MYP" },
  { id: "myp2-5", title: "MYP Chemistry years 1-3, Hodder", author: "Annie Termaat & Gary Horner", subject: "Science", publisher: "Hodder", isbn: "9781510425750", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425750", grade: "MYP 2", program: "MYP" },
  { id: "myp2-6", title: "MYP Physics years 1-3, Hodder", author: "William Heathcote", subject: "Science", publisher: "Hodder", isbn: "9781510425798", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425798", grade: "MYP 2", program: "MYP" },
  { id: "myp2-7", title: "Pearson MYP English Language Acquisition (Proficient) 2nd", author: "Irina Birajdar, Ingrid Perera, Rebecca Grieve, Danielle Steyn", subject: "English", publisher: "Pearson", isbn: "9781292958514", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958514", grade: "MYP 2", program: "MYP" },
  { id: "myp2-8", title: "Pearson MYP English Language Acquisition (Capable) 2nd Edition", author: "Saranya Srinivasan, Ingrid Perera, Rebecca Greive", subject: "English", publisher: "Pearson", isbn: "9781292958521", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958521", grade: "MYP 2", program: "MYP" },
  { id: "myp2-9", title: "Forte! 2 – Italian for school students", author: "L. Maddii, M.C. Borgogni", subject: "Italian", publisher: "Edilingua", isbn: "9788899358624", price: 28.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788899358624", grade: "MYP 2", program: "MYP" },
  { id: "myp2-10", title: "Forte! 3 – Italian for school students", author: "L. Maddii, M.C. Borgogni, S.Servetti", subject: "Italian", publisher: "Edilingua", isbn: "9789606632570", price: 28.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9789606632570", grade: "MYP 2", program: "MYP" },
  { id: "myp2-11", title: "Parola chiave A2", author: "F. Ferraris", subject: "Italian", publisher: "Mondadori Education", isbn: "9788800357128", price: 12.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788800357128", grade: "MYP 2", program: "MYP" },
  { id: "myp2-12", title: "Letture in gioco 2", author: "A Anelli, D Viola", subject: "Italian", publisher: "La Spiga Edizioni", isbn: "9788846838766", price: 8.10, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788846838766", grade: "MYP 2", program: "MYP" },
  { id: "myp2-13", title: "NUOVO CONTATTO A1/A2", author: "BOZZONE COSTA R., GHEZZI C., PIANTONI M.", subject: "Italian", publisher: "Loescher", isbn: "9788820136901", price: 26.90, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788820136901", grade: "MYP 2", program: "MYP" },
  { id: "myp2-14", title: "Promessi sposi", author: "A. Manzoni adapted by E. Lovato", subject: "Italian", publisher: "Eli", isbn: "9788853628206", price: 11.20, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788853628206", grade: "MYP 2", program: "MYP" },
  { id: "myp2-15", title: "Letture in gioco 3", author: "A Anelli, D Viola", subject: "Italian", publisher: "La Spiga Edizioni", isbn: "9788846838773", price: 8.10, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788846838773", grade: "MYP 2", program: "MYP" },
  { id: "myp2-16", title: "NUOVO Contatto B1", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian", publisher: "Loescher", isbn: "9788820136925", price: 29.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788820136925", grade: "MYP 2", program: "MYP" },
  { id: "myp2-17", title: "IB MYP Global contexts 1-3", author: "SECOND EDITION Talei Kunkel, Danielle Trynoski et al.", subject: "Multi-subject", publisher: "Hodder", isbn: "9781398393677", price: 35.75, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781398393677", grade: "MYP 2", program: "MYP" },

  // ==================== MYP 3 ====================
  { id: "myp3-1", title: "MYP Geography for years 1-3, Hodder", author: "A Dharani, R Zeller", subject: "Geography", publisher: "Hodder", isbn: "9781510425804", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425804", grade: "MYP 3", program: "MYP" },
  { id: "myp3-2", title: "MYP History: a concept-based approach years 1-3, Hodder", author: "Jo Thomas", subject: "History", publisher: "Hodder", isbn: "9781471841521", price: 49.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841521", grade: "MYP 3", program: "MYP" },
  { id: "myp3-3", title: "Mathematics for MYP 3, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing, Aidan Sproat-Clements, Talei Kunkel", subject: "Mathematics", publisher: "Hodder", isbn: "9781471880995", price: 46.68, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471880995", grade: "MYP 3", program: "MYP" },
  { id: "myp3-4", title: "MYP Biology years 1-3, Hodder", author: "Andrew Davis, Patricia Deo", subject: "Science", publisher: "Hodder", isbn: "9781510425781", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425781", grade: "MYP 3", program: "MYP" },
  { id: "myp3-5", title: "MYP Chemistry years 1-3, Hodder", author: "Annie Termaat & Gary Horner", subject: "Science", publisher: "Hodder", isbn: "9781510425750", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425750", grade: "MYP 3", program: "MYP" },
  { id: "myp3-6", title: "MYP Physics years 1-3, Hodder", author: "William Heathcote", subject: "Science", publisher: "Hodder", isbn: "9781510425798", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425798", grade: "MYP 3", program: "MYP" },
  { id: "myp3-7", title: "Pearson MYP English Language Acquisition (Proficient) 2nd", author: "Irina Birajdar, Ingrid Perera, Rebecca Grieve, Danielle Steyn", subject: "English", publisher: "Pearson", isbn: "9781292958514", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958514", grade: "MYP 3", program: "MYP" },
  { id: "myp3-8", title: "Pearson MYP English Language Acquisition (Capable) 2nd Edition", author: "Saranya Srinivasan, Ingrid Perera, Rebecca Greive", subject: "English", publisher: "Pearson", isbn: "9781292958521", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958521", grade: "MYP 3", program: "MYP" },
  { id: "myp3-9", title: "Letture in gioco 3", author: "A Anelli, D Viola", subject: "Italian", publisher: "La Spiga Edizioni", isbn: "9788846838773", price: 8.10, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788846838773", grade: "MYP 3", program: "MYP" },
  { id: "myp3-10", title: "NUOVO Contatto B1", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian", publisher: "Loescher", isbn: "9788820136925", price: 29.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788820136925", grade: "MYP 3", program: "MYP" },
  { id: "myp3-11", title: "Forte! 3 – Italian for school students", author: "L. Maddii, M.C. Borgogni, S.Servetti", subject: "Italian", publisher: "Edilingua", isbn: "9789606632570", price: 28.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9789606632570", grade: "MYP 3", program: "MYP" },
  { id: "myp3-12", title: "Promessi sposi", author: "A. Manzoni adapted by E. Lovato", subject: "Italian", publisher: "Eli", isbn: "9788853628206", price: 11.20, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788853628206", grade: "MYP 3", program: "MYP" },
  { id: "myp3-13", title: "NUOVO Contatto B2", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian", publisher: "Loescher", isbn: "9788820136949", price: 29.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788820136949", grade: "MYP 3", program: "MYP" },
  { id: "myp3-14", title: "IB MYP Global contexts 1-3", author: "SECOND EDITION Talei Kunkel, Danielle Trynoski et al.", subject: "Multi-subject", publisher: "Hodder", isbn: "9781398393677", price: 35.75, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781398393677", grade: "MYP 3", program: "MYP" },

  // ==================== MYP 4 ====================
  { id: "myp4-1", title: "MYP Geography years 4&5, Hodder", author: "A Dharani, R Zeller", subject: "Geography", publisher: "Hodder", isbn: "9781510425828", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425828", grade: "MYP 4", program: "MYP" },
  { id: "myp4-2", title: "MYP History years 4 & 5: a concept-based approach, Hodder", author: "Jo Thomas", subject: "History", publisher: "Hodder", isbn: "9781471841538", price: 49.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841538", grade: "MYP 4", program: "MYP" },
  { id: "myp4-3", title: "Mathematics for MYP 4&5 standard, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing", subject: "Mathematics", publisher: "Hodder", isbn: "9781471841538", price: 49.63, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841538", grade: "MYP 4", program: "MYP" },
  { id: "myp4-4", title: "Mathematics for MYP 4&5 extended, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing", subject: "Mathematics", publisher: "Hodder", isbn: "9781510425880", price: 49.63, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425880", grade: "MYP 4", program: "MYP" },
  { id: "myp4-5", title: "MYP Biology years 4&5, Hodder", author: "Andrew Davis, Patricia Deo", subject: "Science", publisher: "Hodder", isbn: "9781510425811", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425811", grade: "MYP 4", program: "MYP" },
  { id: "myp4-6", title: "MYP Chemistry years 4&5, Hodder", author: "Annie Termaat & Gary Horner", subject: "Science", publisher: "Hodder", isbn: "9781510425774", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425774", grade: "MYP 4", program: "MYP" },
  { id: "myp4-7", title: "MYP Physics years 4&5, Hodder", author: "William Heathcote", subject: "Science", publisher: "Hodder", isbn: "9781510425835", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425835", grade: "MYP 4", program: "MYP" },
  { id: "myp4-8", title: "Pearson MYP English Language Acquisition (Proficient) 2nd", author: "Irina Birajdar, Ingrid Perera, Rebecca Grieve, Danielle Steyn", subject: "English", publisher: "Pearson", isbn: "9781292958514", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958514", grade: "MYP 4", program: "MYP" },
  { id: "myp4-9", title: "Pearson MYP English Language Acquisition (Capable) 2nd Edition", author: "Saranya Srinivasan, Ingrid Perera, Rebecca Greive", subject: "English", publisher: "Pearson", isbn: "9781292958521", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958521", grade: "MYP 4", program: "MYP" },
  { id: "myp4-10", title: "NUOVO Contatto B2", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian", publisher: "Loescher", isbn: "9788820136949", price: 29.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788820136949", grade: "MYP 4", program: "MYP" },
  { id: "myp4-11", title: "NUOVO Contatto C1", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian", publisher: "Loescher", isbn: "9788858308530", price: 30.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788858308530", grade: "MYP 4", program: "MYP" },
  { id: "myp4-12", title: "Promessi sposi", author: "A. Manzoni adapted by E. Lovato", subject: "Italian", publisher: "Eli", isbn: "9788853628206", price: 11.20, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788853628206", grade: "MYP 4", program: "MYP" },
  { id: "myp4-13", title: "IB MYP Global contexts 4-5", author: "SECOND EDITION Talei Kunkel, Danielle Trynoski et al.", subject: "Multi-subject", publisher: "Hodder", isbn: "9781398393707", price: 35.75, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781398393707", grade: "MYP 4", program: "MYP" },

  // ==================== MYP 5 ====================
  { id: "myp5-1", title: "MYP Geography years 4&5, Hodder", author: "A Dharani, R Zeller", subject: "Geography", publisher: "Hodder", isbn: "9781510425828", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425828", grade: "MYP 5", program: "MYP" },
  { id: "myp5-2", title: "MYP History years 4 & 5: a concept-based approach, Hodder", author: "Jo Thomas", subject: "History", publisher: "Hodder", isbn: "9781471841538", price: 49.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841538", grade: "MYP 5", program: "MYP" },
  { id: "myp5-3", title: "Mathematics for MYP 4&5 standard, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing", subject: "Mathematics", publisher: "Hodder", isbn: "9781471841538", price: 49.63, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471841538", grade: "MYP 5", program: "MYP" },
  { id: "myp5-4", title: "Mathematics for MYP 4&5 extended, Hodder", author: "Marlene Torres-Skoumal, Rose Harrison, Clara Huizing", subject: "Mathematics", publisher: "Hodder", isbn: "9781510425880", price: 49.63, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425880", grade: "MYP 5", program: "MYP" },
  { id: "myp5-5", title: "MYP Biology years 4&5, Hodder", author: "Andrew Davis, Patricia Deo", subject: "Science", publisher: "Hodder", isbn: "9781510425811", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425811", grade: "MYP 5", program: "MYP" },
  { id: "myp5-6", title: "MYP Chemistry years 4&5, Hodder", author: "Annie Termaat & Gary Horner", subject: "Science", publisher: "Hodder", isbn: "9781510425774", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425774", grade: "MYP 5", program: "MYP" },
  { id: "myp5-7", title: "MYP Physics years 4&5, Hodder", author: "William Heathcote", subject: "Science", publisher: "Hodder", isbn: "9781510425835", price: 51.28, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510425835", grade: "MYP 5", program: "MYP" },
  { id: "myp5-8", title: "Pearson MYP English Language Acquisition (Proficient) 2nd", author: "Irina Birajdar, Ingrid Perera, Rebecca Grieve, Danielle Steyn", subject: "English", publisher: "Pearson", isbn: "9781292958514", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958514", grade: "MYP 5", program: "MYP" },
  { id: "myp5-9", title: "Pearson MYP English Language Acquisition (Capable) 2nd Edition", author: "Saranya Srinivasan, Ingrid Perera, Rebecca Greive", subject: "English", publisher: "Pearson", isbn: "9781292958521", price: 37.47, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781292958521", grade: "MYP 5", program: "MYP" },
  { id: "myp5-10", title: "NUOVO Contatto C1", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian", publisher: "Loescher", isbn: "9788858308530", price: 30.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788858308530", grade: "MYP 5", program: "MYP" },
  { id: "myp5-11", title: "Promessi sposi", author: "A. Manzoni adapted by E. Lovato", subject: "Italian", publisher: "Eli", isbn: "9788853628206", price: 11.20, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788853628206", grade: "MYP 5", program: "MYP" },
  { id: "myp5-12", title: "IB MYP Global contexts 4-5", author: "SECOND EDITION Talei Kunkel, Danielle Trynoski et al.", subject: "Multi-subject", publisher: "Hodder", isbn: "9781398393707", price: 35.75, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781398393707", grade: "MYP 5", program: "MYP" },

  // ==================== DP 1 ====================
  { id: "dp1-1", title: "IB Biology Course Book, 2023", author: "Andrew Allot, David Mindorff", subject: "Biology", publisher: "Oxford", isbn: "9781382016339", price: 69.99, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382016339", grade: "DP 1", program: "DP" },
  { id: "dp1-2", title: "IB Chemistry Course Book 2023", author: "Bylikin, Horner, Murphy, Tarcy", subject: "Chemistry", publisher: "Oxford", isbn: "9781382016353", price: 69.99, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382016353", grade: "DP 1", program: "DP" },
  { id: "dp1-3", title: "IB Computer Science SL/HL", author: "Kostas Dimitriou, Markos Hatzitaskos", subject: "Computer Science", publisher: "Express Publishing", isbn: "9781471552335", price: 61.80, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471552335", grade: "DP 1", program: "DP" },
  { id: "dp1-4", title: "IB Economics Course Book 3rd edition 2020", author: "J. Blink and D. Dorton", subject: "Economics", publisher: "Oxford", isbn: "9781382004961", price: 59.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382004961", grade: "DP 1", program: "DP" },
  { id: "dp1-5", title: "Language A: language and literature for the IB Diploma", author: "Brad Philpot", subject: "English A: Language and Literature", publisher: "Cambridge", isbn: "9781107658424", price: 42.95, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781107658424", grade: "DP 1", program: "DP" },
  { id: "dp1-6", title: "IB English B Course Companion 2ND Edition", author: "Kevin Morley, Kawther Saad Aldin", subject: "English B", publisher: "Oxford", isbn: "9780198422327", price: 60.62, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198422327", grade: "DP 1", program: "DP" },
  { id: "dp1-7", title: "Environmental Systems and Societies Course Companion, 2nd edition", author: "J. Rutherford and G. Williams", subject: "Environmental Systems and Societies", publisher: "Oxford", isbn: "9780198332565", price: 57.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198332565", grade: "DP 1", program: "DP" },
  { id: "dp1-8", title: "Geography Course Companion", author: "G. Nagle and B. Cooke", subject: "Geography", publisher: "Oxford", isbn: "9780198396031", price: 58.17, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198396031", grade: "DP 1", program: "DP" },
  { id: "dp1-9", title: "IB History - Paper 3: Italy (1815-1871) and Germany (1815-1890)", author: "Mike Wells", subject: "History", publisher: "Cambridge", isbn: "9781316503652", price: 28.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781316503652", grade: "DP 1", program: "DP" },
  { id: "dp1-10", title: "Access to History for the IB Diploma: Causes and effects of 20th-century wars Study and Revision Guide: Paper 2", author: "Andy Dailey, Price, Thomas", subject: "History", publisher: "Hodder", isbn: "9781510432369", price: 22.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510432369", grade: "DP 1", program: "DP" },
  { id: "dp1-11", title: "IB History - Paper 2: Authoritarian States", author: "B. Habibi et al.", subject: "History", publisher: "Cambridge", isbn: "9781107558892", price: 36.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781107558892", grade: "DP 1", program: "DP" },
  { id: "dp1-12", title: "History for the IB Diploma Paper 2 Causes and Effects of 20th Century Wars", author: "WELLS", subject: "History", publisher: "Cambridge", isbn: "9781107560864", price: 36.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781107560864", grade: "DP 1", program: "DP" },
  { id: "dp1-13", title: "Access to History: The Cold War 1941-95", author: "David Williamson", subject: "History", publisher: "Hodder", isbn: "9781510459144", price: 23.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510459144", grade: "DP 1", program: "DP" },
  { id: "dp1-14", title: "NUOVO Contatto C1", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian B", publisher: "Loescher", isbn: "9788858308530", price: 30.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788858308530", grade: "DP 1", program: "DP" },
  { id: "dp1-15", title: "IB Mathematics: applications and interpretation SL", author: "P. Fannon et al.", subject: "Mathematics: Applications and Interpretation SL", publisher: "Hodder", isbn: "9781510462380", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462380", grade: "DP 1", program: "DP" },
  { id: "dp1-16", title: "IB Mathematics: applications and interpretation HL", author: "P. Fannon et al.", subject: "Mathematics: Applications and Interpretation HL", publisher: "Hodder", isbn: "9781510462359", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462359", grade: "DP 1", program: "DP" },
  { id: "dp1-17", title: "IB Mathematics: analysis and approaches SL", author: "Fannon et al.", subject: "Mathematics: Analysis and Approaches SL", publisher: "Hodder", isbn: "9781510462366", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462366", grade: "DP 1", program: "DP" },
  { id: "dp1-18", title: "IB Mathematics: analysis and approaches HL", author: "Fannon et al.", subject: "Mathematics: Analysis and Approaches HL", publisher: "Hodder", isbn: "9781510462373", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462373", grade: "DP 1", program: "DP" },
  { id: "dp1-19", title: "IB Physics Course Book 2023 Edition", author: "Homer, Bowen-Jones", subject: "Physics", publisher: "Oxford", isbn: "9781382016421", price: 64.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382016421", grade: "DP 1", program: "DP" },
  { id: "dp1-20", title: "Psychology for the IB Diploma 2nd", author: "J. Popov and L. Parker", subject: "Psychology", publisher: "Cambridge", isbn: "9781009190534", price: 53.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781009190534", grade: "DP 1", program: "DP" },
  { id: "dp1-21", title: "Español B for the IB diploma Teacher's Resource Book", author: "Sebastian Bianchi, Mike Thacker", subject: "Spanish B", publisher: "Hodder", isbn: "9781510447622", price: 135.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510447622", grade: "DP 1", program: "DP" },
  { id: "dp1-22", title: "Theory of Knowledge 3rd edition", author: "Nicholas Alchin and Carolyn P. Henly", subject: "Theory of Knowledge", publisher: "Hodder", isbn: "9781471804168", price: 52.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471804168", grade: "DP 1", program: "DP" },
  { id: "dp1-23", title: "Visual Arts for the IB Diploma", author: "H. Glanville and J. Gray", subject: "Visual Arts", publisher: "Cambridge", isbn: "9781316638361", price: 38.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781316638361", grade: "DP 1", program: "DP" },
  { id: "dp1-24", title: "Letture in corso 2 – Una storia italiana", author: "Silvana Cantini, Alessandro De Giuli", subject: "Italian A", publisher: "Alma Edizioni", isbn: "9788889237151", price: 14.90, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788889237151", grade: "DP 1", program: "DP" },
  { id: "dp1-25", title: "Qualcosa di scritto", author: "Emanuele Trevi", subject: "Italian A", publisher: "Ponte alle Grazie", isbn: "9788833311555", price: 12.00, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788833311555", grade: "DP 1", program: "DP" },
  { id: "dp1-26", title: "Goffredo Parise, Sillabari", subject: "Italian A", publisher: "Adelphi", isbn: "9788845904387", price: 15.00, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788845904387", grade: "DP 1", program: "DP" },
  { id: "dp1-27", title: "La lunga vita di Marianna Ucrìa", author: "Dacia Maraini", subject: "Italian A", publisher: "BUR", isbn: "9788817103077", price: 12.50, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788817103077", grade: "DP 1", program: "DP" },
  { id: "dp1-28", title: "IB DIPLOMA Business Management Course Book", author: "Martin Mwenda Muchena, Loykie Lomine et. al", subject: "Business Management", publisher: "Oxford", isbn: "9781382016773", price: 62.00, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781382016773", grade: "DP 1", program: "DP" },
  { id: "dp1-29", title: "French B for the IB Diploma 2nd Edition", author: "TRUMPER / ISRAEL", subject: "French B", publisher: "Hodder", isbn: "9781510446564", price: 50.85, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510446564", grade: "DP 1", program: "DP" },
  { id: "dp1-30", title: "IB Global Politics", author: "Murphy, Gleek, Katsaounis", subject: "Global Politics", publisher: "Oxford", isbn: "9780198310150", price: 53.65, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198310150", grade: "DP 1", program: "DP" },
  { id: "dp1-31", title: "Mandarin B", author: "Liu, Cai, Liu, Yan", subject: "Mandarin B", publisher: "Oxford", isbn: "9780198395362", price: 52.55, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198395362", grade: "DP 1", program: "DP" },
  
  // ==================== DP 2 ====================
  { id: "dp2-1", title: "IB Biology Course Book, 2023", author: "Andrew Allot, David Mindorff", subject: "Biology", publisher: "Oxford", isbn: "9781382016339", price: 69.99, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382016339", grade: "DP 2", program: "DP" },
  { id: "dp2-2", title: "IB Chemistry Course Book 2023", author: "Bylikin, Horner, Murphy, Tarcy", subject: "Chemistry", publisher: "Oxford", isbn: "9781382016353", price: 69.99, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382016353", grade: "DP 2", program: "DP" },
  { id: "dp2-3", title: "IB Computer Science SL/HL", author: "Kostas Dimitriou, Markos Hatzitaskos", subject: "Computer Science", publisher: "Express Publishing", isbn: "9781471552335", price: 61.80, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471552335", grade: "DP 2", program: "DP" },
  { id: "dp2-4", title: "IB Economics Course Book 3rd edition 2020", author: "J. Blink and D. Dorton", subject: "Economics", publisher: "Oxford", isbn: "9781382004961", price: 59.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382004961", grade: "DP 2", program: "DP" },
  { id: "dp2-5", title: "Language A: language and literature for the IB Diploma", author: "Brad Philpot", subject: "English A: Language and Literature", publisher: "Cambridge", isbn: "9781107658424", price: 42.95, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781107658424", grade: "DP 2", program: "DP" },
  { id: "dp2-6", title: "IB English B Course Companion 2ND Edition", author: "Kevin Morley, Kawther Saad Aldin", subject: "English B", publisher: "Oxford", isbn: "9780198422327", price: 60.62, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198422327", grade: "DP 2", program: "DP" },
  { id: "dp2-7", title: "Environmental Systems and Societies Course Companion, 2nd edition", author: "J. Rutherford and G. Williams", subject: "Environmental Systems and Societies", publisher: "Oxford", isbn: "9780198332565", price: 57.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198332565", grade: "DP 2", program: "DP" },
  { id: "dp2-8", title: "Geography Course Companion", author: "G. Nagle and B. Cooke", subject: "Geography", publisher: "Oxford", isbn: "9780198396031", price: 58.17, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198396031", grade: "DP 2", program: "DP" },
  { id: "dp2-9", title: "IB History - Paper 3: Italy (1815-1871) and Germany (1815-1890)", author: "Mike Wells", subject: "History", publisher: "Cambridge", isbn: "9781316503652", price: 28.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781316503652", grade: "DP 2", program: "DP" },
  { id: "dp2-10", title: "Access to History for the IB Diploma: Causes and effects of 20th-century wars Study and Revision Guide: Paper 2", author: "Andy Dailey, Price, Thomas", subject: "History", publisher: "Hodder", isbn: "9781510432369", price: 22.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510432369", grade: "DP 2", program: "DP" },
  { id: "dp2-11", title: "IB History - Paper 2: Authoritarian States", author: "B. Habibi et al.", subject: "History", publisher: "Cambridge", isbn: "9781107558892", price: 36.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781107558892", grade: "DP 2", program: "DP" },
  { id: "dp2-12", title: "History for the IB Diploma Paper 2 Causes and Effects of 20th Century Wars", author: "WELLS", subject: "History", publisher: "Cambridge", isbn: "9781107560864", price: 36.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781107560864", grade: "DP 2", program: "DP" },
  { id: "dp2-13", title: "Access to History: The Cold War 1941-95", author: "David Williamson", subject: "History", publisher: "Hodder", isbn: "9781510459144", price: 23.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510459144", grade: "DP 2", program: "DP" },
  { id: "dp2-14", title: "NUOVO Contatto C1", author: "BOZZONE COSTA R, GHEZZI C, PIANTONI M", subject: "Italian B", publisher: "Loescher", isbn: "9788858308530", price: 30.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788858308530", grade: "DP 2", program: "DP" },
  { id: "dp2-15", title: "IB Mathematics: applications and interpretation SL", author: "P. Fannon et al.", subject: "Mathematics: Applications and Interpretation SL", publisher: "Hodder", isbn: "9781510462380", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462380", grade: "DP 2", program: "DP" },
  { id: "dp2-16", title: "IB Mathematics: applications and interpretation HL", author: "P. Fannon et al.", subject: "Mathematics: Applications and Interpretation HL", publisher: "Hodder", isbn: "9781510462359", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462359", grade: "DP 2", program: "DP" },
  { id: "dp2-17", title: "IB Mathematics: analysis and approaches SL", author: "Fannon et al.", subject: "Mathematics: Analysis and Approaches SL", publisher: "Hodder", isbn: "9781510462366", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462366", grade: "DP 2", program: "DP" },
  { id: "dp2-18", title: "IB Mathematics: analysis and approaches HL", author: "Fannon et al.", subject: "Mathematics: Analysis and Approaches HL", publisher: "Hodder", isbn: "9781510462373", price: 58.10, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510462373", grade: "DP 2", program: "DP" },
  { id: "dp2-19", title: "IB Physics Course Book 2023 Edition", author: "Homer, Bowen-Jones", subject: "Physics", publisher: "Oxford", isbn: "9781382016421", price: 64.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781382016421", grade: "DP 2", program: "DP" },
  { id: "dp2-20", title: "Psychology for the IB Diploma 2nd", author: "J. Popov and L. Parker", subject: "Psychology", publisher: "Cambridge", isbn: "9781009190534", price: 53.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781009190534", grade: "DP 2", program: "DP" },
  { id: "dp2-21", title: "Español B for the IB diploma Teacher's Resource Book", author: "Sebastian Bianchi, Mike Thacker", subject: "Spanish B", publisher: "Hodder", isbn: "9781510447622", price: 135.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510447622", grade: "DP 2", program: "DP" },
  { id: "dp2-22", title: "Theory of Knowledge 3rd edition", author: "Nicholas Alchin and Carolyn P. Henly", subject: "Theory of Knowledge", publisher: "Hodder", isbn: "9781471804168", price: 52.50, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781471804168", grade: "DP 2", program: "DP" },
  { id: "dp2-23", title: "Visual Arts for the IB Diploma", author: "H. Glanville and J. Gray", subject: "Visual Arts", publisher: "Cambridge", isbn: "9781316638361", price: 38.00, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781316638361", grade: "DP 2", program: "DP" },
  { id: "dp2-24", title: "Letture in corso 2 – Una storia italiana", author: "Silvana Cantini, Alessandro De Giuli", subject: "Italian A", publisher: "Alma Edizioni", isbn: "9788889237151", price: 14.90, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9788889237151", grade: "DP 2", program: "DP" },
  { id: "dp2-25", title: "La casa in collina", author: "Cesare Pavese", subject: "Italian A", publisher: "Einaudi", isbn: "9788806219352", price: 11.50, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788806219352", grade: "DP 2", program: "DP" },
  { id: "dp2-26", title: "La Storia", author: "Elsa Morante", subject: "Italian A", publisher: "Einaudi", isbn: "9788806219369", price: 16.00, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788806219369", grade: "DP 2", program: "DP" },
  { id: "dp2-27", title: "Mio padre", author: "E. De Luca", subject: "Italian A", publisher: "Feltrinelli", isbn: "9788807886324", price: 9.50, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788807886324", grade: "DP 2", program: "DP" },
  { id: "dp2-28", title: "Se questo è un uomo", author: "Primo Levi", subject: "Italian A", publisher: "Einaudi", isbn: "9788806219314", price: 12.50, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9788806219314", grade: "DP 2", program: "DP" },
  { id: "dp2-29", title: "IB DIPLOMA Business Management Course Book", author: "Martin Mwenda Muchena, Loykie Lomine et. al", subject: "Business Management", publisher: "Oxford", isbn: "9781382016773", price: 62.00, availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/s?k=9781382016773", grade: "DP 2", program: "DP" },
  { id: "dp2-30", title: "French B for the IB Diploma 2nd Edition", author: "TRUMPER / ISRAEL", subject: "French B", publisher: "Hodder", isbn: "9781510446564", price: 50.85, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9781510446564", grade: "DP 2", program: "DP" },
  { id: "dp2-31", title: "IB Global Politics", author: "Murphy, Gleek, Katsaounis", subject: "Global Politics", publisher: "Oxford", isbn: "9780198310150", price: 53.65, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198310150", grade: "DP 2", program: "DP" },
  { id: "dp2-32", title: "Mandarin B", author: "Liu, Cai, Liu, Yan", subject: "Mandarin B", publisher: "Oxford", isbn: "9780198395362", price: 52.55, availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/s?k=9780198395362", grade: "DP 2", program: "DP" },
];

// Summer Reading / Recommended Books
export const summerReadingBooks: OfficialBook[] = [
  // PYP Summer Reading
  { id: "sr-pyp-1", title: "The One and Only Ivan", subject: "Summer Reading", publisher: "HarperCollins", isbn: "978-0-06-199225-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0061992259", grade: "PYP 1-3", program: "PYP", isSummerReading: true },
  { id: "sr-pyp-2", title: "Charlotte's Web", subject: "Summer Reading", publisher: "HarperCollins", isbn: "978-0-06-440055-8", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0064400557", grade: "PYP 1-3", program: "PYP", isSummerReading: true },
  { id: "sr-pyp-3", title: "Wonder", subject: "Summer Reading", publisher: "Knopf", isbn: "978-0-375-86902-0", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0375869026", grade: "PYP 4-5", program: "PYP", isSummerReading: true },
  { id: "sr-pyp-4", title: "Percy Jackson: The Lightning Thief", subject: "Summer Reading", publisher: "Disney Hyperion", isbn: "978-0-7868-3865-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0786838655", grade: "PYP 4-5", program: "PYP", isSummerReading: true },
  
  // MYP Summer Reading
  { id: "sr-myp-1", title: "The Giver", subject: "Summer Reading", publisher: "HMH", isbn: "978-0-544-34025-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0544340256", grade: "MYP 1-2", program: "MYP", isSummerReading: true },
  { id: "sr-myp-2", title: "The Outsiders", subject: "Summer Reading", publisher: "Penguin", isbn: "978-0-14-038572-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/014038572X", grade: "MYP 1-2", program: "MYP", isSummerReading: true },
  { id: "sr-myp-3", title: "To Kill a Mockingbird", subject: "Summer Reading", publisher: "Harper", isbn: "978-0-06-112008-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0061120081", grade: "MYP 3-5", program: "MYP", isSummerReading: true },
  { id: "sr-myp-4", title: "1984", subject: "Summer Reading", publisher: "Signet", isbn: "978-0-451-52493-5", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0451524934", grade: "MYP 3-5", program: "MYP", isSummerReading: true },
  
  // DP Summer Reading
  { id: "sr-dp-1", title: "Brave New World", subject: "Summer Reading", publisher: "Harper", isbn: "978-0-06-085052-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0060850523", grade: "DP 1-2", program: "DP", isSummerReading: true },
  { id: "sr-dp-2", title: "The Great Gatsby", subject: "Summer Reading", publisher: "Scribner", isbn: "978-0-7432-7356-5", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0743273567", grade: "DP 1-2", program: "DP", isSummerReading: true },
  { id: "sr-dp-3", title: "Crime and Punishment", subject: "Summer Reading", publisher: "Penguin", isbn: "978-0-14-044913-6", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0140449132", grade: "DP 1-2", program: "DP", isSummerReading: true },
];

// Mock listings data for demonstration
export const mockListings: Record<string, BookListing[]> = {
  "myp1-5": [
    { id: "l1", type: "sale", price: 30, condition: "asNew", sellerId: "user1", sellerRating: 4.8, sellerName: "Marco R.", sellerCompletedExchanges: 12 },
    { id: "l2", type: "sale", price: 25, condition: "used", sellerId: "user2", sellerRating: 4.5, sellerName: "Sofia B.", sellerCompletedExchanges: 8 },
  ],
  "myp1-6": [
    { id: "l3", type: "donation", condition: "used", sellerId: "user3", sellerRating: 5.0, sellerName: "Elena G.", sellerCompletedExchanges: 15 },
  ],
  "myp2-3": [
    { id: "l4", type: "sale", price: 35, condition: "asNew", sellerId: "user4", sellerRating: 4.9, sellerName: "Luca M.", sellerCompletedExchanges: 20 },
    { id: "l5", type: "sale", price: 28, condition: "used", sellerId: "user5", sellerRating: 4.2, sellerName: "Anna P.", sellerCompletedExchanges: 5 },
    { id: "l6", type: "exchange", condition: "asNew", sellerId: "user6", sellerRating: 4.7, sellerName: "Pietro S.", sellerCompletedExchanges: 9 },
  ],
  "dp1-1": [
    { id: "l7", type: "sale", price: 50, condition: "asNew", sellerId: "user7", sellerRating: 4.9, sellerName: "Francesco L.", sellerCompletedExchanges: 18 },
    { id: "l8", type: "sale", price: 45, condition: "used", sellerId: "user8", sellerRating: 4.6, sellerName: "Giulia T.", sellerCompletedExchanges: 11 },
  ],
  "dp1-19": [
    { id: "l9", type: "sale", price: 48, condition: "asNew", sellerId: "user9", sellerRating: 4.8, sellerName: "Alessandro V.", sellerCompletedExchanges: 14 },
  ],
};

// Helper function to get unique subjects for a specific grade
export const getSubjectsForGrade = (grade: string): string[] => {
  const books = officialBooks.filter(book => book.grade === grade);
  const subjects = [...new Set(books.map(book => book.subject))];
  return subjects.sort();
};

// Helper function to get books for specific subjects
export const getBooksForSubjects = (grade: string, subjects: string[]): OfficialBook[] => {
  return officialBooks.filter(
    book => book.grade === grade && subjects.includes(book.subject)
  );
};

// Helper function to calculate price range for used books
export const getPriceRange = (bookId: string): { min: number; max: number } | null => {
  const listings = mockListings[bookId];
  if (!listings || listings.length === 0) return null;
  
  const prices = listings
    .filter(l => l.type === "sale" && l.price !== undefined)
    .map(l => l.price as number);
  
  if (prices.length === 0) return null;
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Helper function to get Amazon list URL for a specific grade
export const getAmazonListUrl = (grade: string, program: string): string => {
  // Base Amazon affiliate URL - would be customized with actual affiliate links
  return `https://amazon.com/hz/wishlist/ls/SCHOOL_BOOKS_${program}_${grade.replace(" ", "_")}`;
};

// Helper to check if a book should be kept for next year
export const shouldKeepForNextYear = (
  bookIsbn: string, 
  currentGrade: string, 
  program: string
): boolean => {
  // Get the next grade
  const gradeNum = parseInt(currentGrade.split(" ")[1]);
  const nextGrade = `${program} ${gradeNum + 1}`;
  
  // Check if the same book (by ISBN) is needed in the next grade
  const nextYearBooks = officialBooks.filter(b => b.grade === nextGrade);
  return nextYearBooks.some(b => b.isbn === bookIsbn);
};

// Get books that can be sold (not needed next year)
export const getSellableBooks = (currentGrade: string, program: string): OfficialBook[] => {
  const currentBooks = officialBooks.filter(
    b => b.grade === currentGrade && b.program === program
  );
  
  return currentBooks.filter(book => 
    book.isbn && !shouldKeepForNextYear(book.isbn, currentGrade, program)
  );
};

// Get books that should be kept for next year
export const getBooksToKeep = (currentGrade: string, program: string): OfficialBook[] => {
  const currentBooks = officialBooks.filter(
    b => b.grade === currentGrade && b.program === program
  );
  
  return currentBooks.filter(book => 
    book.isbn && shouldKeepForNextYear(book.isbn, currentGrade, program)
  );
};

