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

// School Year 2025-2026 Official Book List (previous year)
export const officialBooks: OfficialBook[] = [
  { id: "pyp-1", title: "Primary English 1", author: "Celtic Publishing", subject: "English", publisher: "", isbn: "9788847232617", availableFromPreviousYear: true, grade: "PYP 1", program: "PYP" },
  { id: "pyp-2", title: "Primary English 2", author: "Celtic Publishing", subject: "English", publisher: "", isbn: "9788847232624", availableFromPreviousYear: true, grade: "PYP 2", program: "PYP" },
  { id: "pyp-3", title: "Grammar Time 1", author: "Sandy Jarvis", subject: "English", publisher: "", isbn: "9781405866972", availableFromPreviousYear: true, grade: "PYP 1", program: "PYP" },
  { id: "pyp-4", title: "Grammar Time 2", author: "Sandy Jarvis", subject: "English", publisher: "", isbn: "9781405866989", availableFromPreviousYear: true, grade: "PYP 1", program: "PYP" },
  { id: "pyp-5", title: "Grammar Time 3", author: "Sandy Jarvis", subject: "English", publisher: "", isbn: "9781405866996", availableFromPreviousYear: true, grade: "PYP 1", program: "PYP" },
  { id: "pyp-6", title: "The Boy, the Mole, the Fox and the Horse", author: "Charlie Mackesy", subject: "Assemblies", publisher: "", isbn: "9781529105100", availableFromPreviousYear: true, grade: "PYP 1", program: "PYP" },
  { id: "pyp-7", title: "Little Citizens,  CLIL and agenda 2030", author: "Letizia Cinganotto e Marina Screpanti", subject: "CLIL", publisher: "", isbn: "9788891918994", availableFromPreviousYear: true, grade: "PYP 1", program: "PYP" },
  { id: "myp1-1", title: "RealM@t. Aritmetica 1 + Geometria 1 + Matematica e realtà 1 +E-book cl. 1", author: "Miglio-Solmi", subject: "Mathematics", publisher: "", isbn: "9788842653332", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-2", title: "Mathematics 7 MYP2 - third edition  (da usare in MYP1 e MYP2)", author: "Michael Haese, Sandra Haese, Mark Humphries, Edward Kemp, Pamela Vollmar", subject: "Mathematics", publisher: "", isbn: "9781922416308", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-3", title: "Cambridge Checkpoint Lower Secondary Science student's book 7, 3rd Edition (da usare MYP1 e MYP2)", author: "Peter Riley", subject: "Science", publisher: "", isbn: "9781398300187", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-4", title: "Qui êtes-vous, Monsieur Eiffel ?", author: "Adriana Kritter", subject: "French", publisher: "", isbn: "9782278096053", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-5", title: "Paris découverte en poche (valido per 3 anni)", author: "Rossella Bruneri, Martine Pelon", subject: "French", publisher: "", isbn: "9788861616509", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-6", title: "Un libro di lettura sarà comunicato tra settembre e ottobre dall'insegnante", subject: "Italian A", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-7", title: "Mi trasformerò in meraviglia (libro valido per due anni)", author: "Elisa Golinelli, Sabina Minuto", subject: "Italian A", publisher: "", isbn: "9788868899790", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-8", title: "L’Odissea raccontata ai bambini", author: "Rosa Navarro Durán", subject: "Italian A", publisher: "", isbn: "978880478477", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-9", title: "Si può dire (libro valido per tre anni)", author: "Anna Degani, Anna Maria Mandelli, Pier Giorgio Viberti", subject: "Italian A", publisher: "", isbn: "9788805078325", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-10", title: "L'avventura più grande 1 continua", author: "Linda Cavadini, Loretta De Martin, Agnese Pianigiani", subject: "Italian A", publisher: "", isbn: "9791221601008", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-11", title: "¡Venga, vamos! 1", author: "Ramos, C.; Santos, M.; Santos, M. J.", subject: "Spanish", publisher: "", isbn: "9788851159184", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-12", title: "Knowing History - Medieval British and World History 410-1509: (Second edition)", author: "Laura Aitken-Burt, Robert Selth and Robert Peal", subject: "History", publisher: "", isbn: "9780008492045", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-13", title: "National Geographic Student World Atlas, 6th edition july 2022", author: "Chris Bickel, National Geographic (July 5, 2022)", subject: "Geography", publisher: "", isbn: "9781426373435", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-14", title: "Books for English depend on the section and they will be advised in September.", subject: "English", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-15", title: "PDF will be given", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-16", title: "Keyboard: •	Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia.  •	Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). •	La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe.  Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-17", title: "PDF will be given", subject: "Art", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-18", title: "Canson XL schizzo. 90g/m (120 fogli) (potete acquistarlo presso Crob Art in via San Bernardo 97 R, Genova. Tel: 010 247 1283)", subject: "Art", publisher: "", isbn: "3148957871353 (EAN)", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-19", title: "PDF will be given", subject: "Design", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-20", title: "SPHERO MINI robot (https://sphero.com/products/sphero-mini)", subject: "Design", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-21", title: "快乐汉语 HAPPY CHINESE | Kuaile Hanyu Vol.1 - Student's Book (Second Edition、 English edition)", author: "LI  Xiaoqi", subject: "Chinese", publisher: "", isbn: "9787107278945", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-22", title: "Prima aktiv ∙ Deutsch für Jugendliche A1: Band 1 Kursbuch und Arbeitsbuch im Paket", author: "Jin, Friederike; Kothari, Anjali; Jentges, Sabine", subject: "German", publisher: "", isbn: "9783061229726", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp1-23", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B", publisher: "", availableFromPreviousYear: true, grade: "MYP 1", program: "MYP" },
  { id: "myp2-1", title: "Mathematics 7 MYP2 - third edition  (già in possesso da MYP1)", author: "Michael Haese, Sandra Haese, Mark Humphries, Edward Kemp, Pamela Vollmar", subject: "Mathematics", publisher: "", isbn: "9781921972454", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-2", title: "RealM@t Aritmetica 2 + Geometria 2 + Matematica e realtà 2 +E-book cl. 2", author: "Miglio-Solmi", subject: "Mathematics", publisher: "", isbn: "9788842653349", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-3", title: "Josephine Baker fait son entrée au Panthéon", author: "Marie-Noëlle Cocton", subject: "French", publisher: "", isbn: "9782278108664", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-4", title: "Paris découverte en poche  (già in possesso da MYP1)", author: "Rossella Bruneri, Martine Pelon", subject: "French", publisher: "", isbn: "9788861616509", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-5", title: "Cambridge Checkpoint Lower Secondary Science student's book 7, Third Edition (già in possesso MYP1)", author: "Peter Riley", subject: "Science", publisher: "", isbn: "9781398300187", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-6", title: "Cambridge Checkpoint Lower Secondary Science student's book 8, Third edition", author: "Peter Riley", subject: "Science", publisher: "", isbn: "9781398302099", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-7", title: "La “Commedia” di Dante Alighieri", author: "Stefano Motta", subject: "Italian A", publisher: "", isbn: "9788883750199", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-8", title: "L'avventura più grande 2 continua", author: "Linda Cavadini, Loretta De Martin, Agnese Pianigiani", subject: "Italian A", publisher: "", isbn: "9791221601022", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-9", title: "Il sognalibro, La letteratura", author: "S. Damele, T. Franzi", subject: "Italian A", publisher: "", isbn: "9788858357040", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-10", title: "Nessuno verrà a prenderti", author: "Manlio Castagna", subject: "Italian A", publisher: "", isbn: "9788804798064", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-11", title: "Si può dire", author: "Anna Degani, Anna Maria Mandelli, Pier Giorgio Viberti", subject: "Italian A", publisher: "", isbn: "9788805078271", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-12", title: "Autori e lettori - mito ed epica  (Gli studenti sono già in possesso di questo libro)", author: "R. Zordan", subject: "Italian A", publisher: "", isbn: "9788891534620", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-13", title: "¡Venga, vamos! 2", author: "Ramos, C.; Santos, M; Santos, M. J.", subject: "Spanish", publisher: "", isbn: "9788851159191", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-14", title: "To be communicated in September", subject: "English", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-15", title: "Knowing History - Early Modern British and World History 1509-1760: (Second edition)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt, Series edited by Robert Peal", subject: "History", publisher: "", isbn: "9780008492052", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-16", title: "Knowing History - Modern British and World History 1760-1900: (Second edition)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt, Series edited by Robert Peal", subject: "History", publisher: "", isbn: "9780008492069", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-17", title: "National Geographic Student World Atlas, 6th Edition Paperback", author: "Chris Bickel, National Geographic (July 5, 2022)", subject: "Geography", publisher: "", isbn: "9781426373435", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-18", title: "Keyboard: •	Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia.  •	Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). •	La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe.  Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-19", title: "Libro in PDF da stampare - nuovo quaderno grande morbido da etichettare con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-20", title: "PDF da stampare a settembre", subject: "Art", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-21", title: "Canson XL schizzo. 90g/m (120 fogli) solo se non lo possedete già", author: "Canson: Per l'acquisto rivolgervi a Crob Art: Via di San Bernardo, 16123 Genova 010 247 1283.", subject: "Art", publisher: "", isbn: "3148957871353", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-22", title: "L'insegnante fornirá delle dispense dove necessario", subject: "Design", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-23", title: "SPHERO MINI robot", author: "https://sphero.com/products/sphero-mini", subject: "Design", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-24", title: "快乐汉语 Happy Chinese [Kuaile Hanyu] Textbook / Student's Book 2", author: "AAVV", subject: "Chinese", publisher: "", isbn: "‎ 9787107171277", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-25", title: "\"Prima aktiv ∙ Deutsch für Jugendliche A1: Band 2 Kursbuch und Arbeitsbuch im Paket", author: "Jin, Friederike; Kothari, Anjali; Jentges, Sabine\"", subject: "German", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp2-26", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B", publisher: "", availableFromPreviousYear: true, grade: "MYP 2", program: "MYP" },
  { id: "myp3-1", title: "RealM@t Aritmetica 3 + Geometria 3 + Matematica e realtà 3 +E-book cl. 3", author: "Miglio - Solmi", subject: "Mathematics", publisher: "", isbn: "9788842653356", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-2", title: "Marie Curie ma grand-mère", author: "Jérémie Dres", subject: "French", publisher: "", isbn: "9782278094417", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-3", title: "Paris découverte en poche  (già in possesso da MYP1)", author: "Rossella Bruneri, Martine Pelon", subject: "French", publisher: "", isbn: "9788861616509", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-4", title: "Esperienza STEAM. Con e-book. Con espansione online vol.3", author: "Stefano Zanoli", subject: "Science", publisher: "", isbn: "9791220412742", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-5", title: "*Come un libro", author: "S. Damele - O. Trioschi", subject: "Italian A", publisher: "", isbn: "9788858313251", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-6", title: "*Si può dire", author: "Anna Degani, Anna Maria Mandelli, Pier Giorgio Viberti", subject: "Italian A", publisher: "", isbn: "9788805078271", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-7", title: "*Autori e Lettori 2", author: "Rosetta Zordan", subject: "Italian A", publisher: "", isbn: "9788891534590", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-8", title: "L’amico ritrovato", author: "Fred Uhlman", subject: "Italian A", publisher: "", isbn: "9788820131524", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-9", title: "Renzo e Lucia: un amore contrastato", author: "Paola Cataldo", subject: "Italian A", publisher: "", isbn: "9788882440473", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-10", title: "Prima e dopo l'esame - speciale nuovo esame di stato e orientamento", author: "T. Franzi - S. Damele", subject: "Italian A", publisher: "", isbn: "9788858330807", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-11", title: "Prepararsi alla prova invalsi", author: "Marta Meneghini, Antonietta Lorenzi", subject: "Italian A", publisher: "", isbn: "9788858330708", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-12", title: "Alisei 3 I continenti europei. Volume + Atlante + Atlante della sostenibilità + Libro digitale + Libro digitale liquido + MyApp + Piattaforma KmZero", author: "Corbellini Giancarlo", subject: "Geography", publisher: "", isbn: "9788869107481", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-13", title: "Incontra la storia. Volume 3 Fatti e persone del Novecento e di oggi + Quaderno delle competenze 3 + Strumenti compensativi 3", author: "Vittoria Calvani", subject: "History", publisher: "", isbn: "9788824762083", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-14", title: "Knowing History - Twentieth Century British and World History 1900-2020: (Second edition)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt", subject: "History", publisher: "", isbn: "9780008492076", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-15", title: "¡Venga, vamos! 3", author: "Ramos, C.; Santos, M; Santos, M. J.", subject: "Spanish", publisher: "", isbn: "9788851159207", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-16", title: "DELE Escolar A2-B1", author: "Nitzia Tudela, Ernesto Puertas", subject: "Spanish", publisher: "", isbn: "9788853626073", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-17", title: "To be communicated in September", subject: "English", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-18", title: "Keyboard: •	Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia.  •	Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). •	La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe.  Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-19", title: "Libro in PDF da stampare e nuovo quaderno grande morbido da etichettare con nome e cogome .", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-20", title: "PDF da stampare a settembre", subject: "Art", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-21", title: "Canson XL schizzo. 90g/m (120 foglic) solo se non lo possedete già", subject: "Art", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-22", title: "Dispense in PDF da stampare a Settembre", subject: "Design", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-23", title: "标准教程 HSK Standard Course 2 - Textbook", author: "JIANG Liping", subject: "Chinese", publisher: "", isbn: "‎ 9787561937266", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp3-24", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B", publisher: "", availableFromPreviousYear: true, grade: "MYP 3", program: "MYP" },
  { id: "myp4-1", title: "Mathematics for the International Student 10E  3rd Edition  (Questo libro sarà valido per 2 anni - This books will be used for 2 years)", author: "Haese, Haese, Humphries, Kemp, Vollmar", subject: "Mathematics", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-2", title: "Graphing Calculator. Choose between: TI-84 Plus CE-T OR Casio FX-CG50", author: "Texas Instruments OR Casio", subject: "Mathematics", publisher: "", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-3", title: "Ein tolles Team! A 2.2 Kursbuch", author: "Giorgio Motta", subject: "German", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-4", title: "Ein tolles Team! A 2.2 Arbeitsbuch", author: "Giorgio Motta", subject: "German", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-5", title: "NO BOOK", subject: "Humanities", publisher: "", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-6", title: "Juntos B  (questo libro sarà valido per 2 anni )", author: "Polettini, C., Pérez Navarro, J.", subject: "Spanish", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-7", title: "#français 2  Livre de l'élève et cahier (libro rosa) VALIDO PER DUE ANNI", author: "Colette Berger, Gabrie Frémiaux, Carole Poirey, Anita Walther", subject: "French", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-8", title: "Le Comte de Montecristo", author: "Alexandre Dumas", subject: "French", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-9", title: "Cambridge IGCSE Biology: Coursebook (fourth ed)", author: "Mary jones and Geoff Jones", subject: "Biology", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-10", title: "MYP Physics: a Concept Based Approach", author: "William Heathcote", subject: "Physics", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-11", title: "MYP Chemistry Years 4&5 - a concept base approach", author: "Gary Horner", subject: "Chemistry", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-12", title: "PDF", subject: "Art", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-13", title: "Canson XL schizzo. 90g/m (120 fogli)", author: "art store", subject: "Art", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-14", title: "标准教程 HSK Standard Course 3 - Textbook", author: "Liping JIANG", subject: "Chinese", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-15", title: "Una frase, un verso appena... XX secoli di letteratura 1 (il testo sarà in uso per due anni)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-16", title: "Una frase, un verso appena... XX secoli di letteratura 2 (il testo sarà in uso per due anni)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-17", title: "Una frase, un verso appena... XX secoli di letteratura 3 (il testo sarà in uso per due anni)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-18", title: "Marianela/ Libro di lettura valido per due anni", author: "Benito Pérez Galdós", subject: "Spanish", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-19", title: "Keyboard: •	Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia.  •	Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). •	La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe.  Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-20", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B", publisher: "", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-21", title: "Stories of Ourselves: volume 1 (valido per due anni)", author: "Various", subject: "English", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-22", title: "Of Mice and Men", author: "John Steinbeck", subject: "English", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp4-23", title: "The other books for English depend on the section. Books per section will be advised in September.", subject: "English", publisher: "", availableFromPreviousYear: true, grade: "MYP 4", program: "MYP" },
  { id: "myp5-1", title: "Mathematics for the International Student 10E - 3rd Edition  (Già in possesso da MYP4)", author: "Haese, Haese, Humphries, Kemp, Vollmar", subject: "Mathematics", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-2", title: "Graphing Calculator. Choose between: TI-84 Plus CE-T OR Casio FX-CG50", author: "Texas Instruments OR Casio", subject: "Mathematics", publisher: "", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-3", title: "Juntos", author: "Carla Polettini, José Pérez Navarro", subject: "Spanish", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-4", title: "#français 2  Livre de l'élève et cahier (libro rosa)  (Già in possesso da MYP4)", author: "Colette Berger, Gabrie Frémiaux, Carole Poirey, Anita Walther", subject: "French", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-5", title: "La tresse", author: "Laetitia Colombani", subject: "French", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-6", title: "Books will be communicated in September depending on sections", subject: "English", publisher: "", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-7", title: "Dabei B1.2 Kursbuch", author: "Anna Breitsameter, Klaus Lill, Christiane Seuthe, Margarethe Thomasen", subject: "German", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-8", title: "Dabei B1.2 Arbeitsbuch", author: "Anna Breitsameter, Christiane Seuthe, Veronika Kirschstein", subject: "German", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-9", title: "Tutta la letteratura che serve 1 (già in possesso da MYP4)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-10", title: "Tutta la letteratura che serve 2 (già in possesso da MYP4)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-11", title: "Tutta la letteratura che serve 3 (già in possesso da MYP4)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-12", title: "NO BOOK", subject: "Humanities", publisher: "", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-13", title: "Marianela", author: "Benito Pérez Galdós", subject: "Spanish", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-14", title: "PDF", subject: "Art", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-15", title: "Canson XL schizzo. 90g/m (120 fogli)", author: "art store", subject: "Art", publisher: "", isbn: "YES", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-16", title: "Cambridge IGCSE Biology: Coursebook (fourth ed)", author: "Mary jones and Geoff Jones", subject: "Biology", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-17", title: "MYP Chemistry Years 4&5 - a concept base approach", author: "Gary Horner", subject: "Chemistry", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-18", title: "标准教程 HSK Standard Course 3 - Textbook", author: "Liping JIANG", subject: "Chinese", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-19", title: "Keyboard: •	Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia.  •	Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). •	La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe.  Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-20", title: "MYP Physics: a Concept Based Approach  (già in uso per myp4)", author: "William Heathcote", subject: "Physics", publisher: "", isbn: "NO", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "myp5-21", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B", publisher: "", availableFromPreviousYear: true, grade: "MYP 5", program: "MYP" },
  { id: "diplomadp1-1", title: "Physics for the IB Diploma Coursebook with Digital Access (2Years) / (7th Edition)", author: "K.A. Tsokos", subject: "Physics", publisher: "", isbn: "9781009071888", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-2", title: "Maths: Applications and Interpretation Standard Level Print and eBook", author: "Ibrahim Wazir, Tim Garry, Jim Nakamoto, Kevin Frederick, Stephen Lumb, Byran Landman", subject: "Mathematics", publisher: "", isbn: "9780435193454", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-3", title: "Mathematics: Analysis and Approaches Standard Level Course Companion", author: "Paul La Rondie, Jill Stevens, Natasha Awada, Jennifer Chang Wathall, Ellen Thompson, Laurie Buchanan, Ed Kemp", subject: "Mathematics", publisher: "", isbn: "9780198427100", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-4", title: "Mathematics: Analysis and Approaches Higher Level Course Companion", author: "Marlene Torres Skoumal, Rose Harrison, Josip Harcet, Jennifer Chang Wathall, Lorraine Heinrichs", subject: "Mathematics", publisher: "", isbn: "9780198427162", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-5", title: "TI-84 Plus CE-T Graphing Display Calculator", author: "Texas Instruments", subject: "Mathematics", publisher: "", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-6", title: "La petite fille de Monsieur Linh", author: "Philippe Claudel", subject: "French", publisher: "", isbn: "9782253115540", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-7", title: "French B course companion 2nd edition. Aprile 2018 (valido per 2 anni)", author: "Christine Trumper, John Israel", subject: "French", publisher: "", isbn: "9780198422372", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-8", title: "Spanish B- valido per 2anni", author: "Ana Balbuena Laura Martn  Cisneros", subject: "Spanish", publisher: "", isbn: "9780198422464", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-9", title: "Tristana", author: "Benito Pérez Galdós", subject: "Spanish", publisher: "", isbn: "9788420660967", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-10", title: "Oxford IB Diploma Programme - Rights and Protest - course companion", author: "Mark Rogers, Peter Clinton", subject: "History SL and HL", publisher: "", isbn: "9780198310198", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-11", title: "Oxford IB Diploma Programme Paperback - Authoritarian States - course companion", author: "Brian Gray Mariam Habibi, Sanjay Perera...", subject: "History SL and HL", publisher: "", isbn: "9780198310228", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-12", title: "The Cold War  Superpower tensions and rivalries 2nd Edition 2017 Pearson", author: "Keely Rogers, Jo Thomas", subject: "History SL and HL", publisher: "", isbn: "9781447982364", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-13", title: "History for the IB Paper 3 Impact of the World Wars on South East Asia", author: "Mary Dicken", subject: "History HL", publisher: "", isbn: "9781108406925", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-14", title: "History for the IB Diploma Paper 3 The People's Repubblic of China 1949-2005", author: "Allan Todd", subject: "History HL", publisher: "", isbn: "9781009190183", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-15", title: "Marina", author: "Carlos Ruiz Zafón", subject: "Spanish", publisher: "", isbn: "9788408004349", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-16", title: "NO BOOK", subject: "Theory of Knowledge (TOK)", publisher: "", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-17", title: "Oxford Resources for IB DP Chemistry: Course book (2023 edition)", author: "Sergey Bylikin, Gary Horner, Elisa Jimenez Grant, David Tarcy", subject: "Chemistry", publisher: "", isbn: "9781382016469", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-18", title: "La metamorfosi e tutti i racconti pubblicati in vita", author: "Franz Kafka", subject: "Italian A", publisher: "", isbn: "9788807900730", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-19", title: "Le città invisibili", author: "Italo Calvino", subject: "Italian A", publisher: "", isbn: "9788804772118", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-20", title: "Lettere a Lucilio", author: "Seneca", subject: "Italian A", publisher: "", isbn: "9788817120135", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-21", title: "L'acquisto di ulteriori testi potrebbe essere richiesto nel corso dell'anno scolastico.", subject: "Italian A", publisher: "", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-22", title: "Oxford Resources for IB: DP Psychology Course Book", author: "Alexey Popov", subject: "Psychology", publisher: "", isbn: "9781382056663", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-23", title: "Macbeth (2009 edition): Oxford School Shakespeare", author: "Shakespeare", subject: "English A", publisher: "", isbn: "9780198324003", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-24", title: "The Thing Around Your Neck", author: "C. N. Adichie", subject: "English A", publisher: "", isbn: "9780007306213", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-25", title: "The Stranger", author: "Albert Camus", subject: "English A", publisher: "", isbn: "9780679720201", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-26", title: "Chronicle of a Death Foretold (another edition is also fine: Vintage ISBN 9781400034710)", author: "G. G. Marquez", subject: "English A", publisher: "", isbn: "9780241968628", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-27", title: "PDFs to be dowloaded/printed during the year", subject: "English A", publisher: "", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-28", title: "English B for the IB Diploma  NEW edition (July 2018)", author: "Philpot, Brad", subject: "English", publisher: "", isbn: "9781108434812", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-29", title: "The Bean Trees", author: "Barbara Kingsolver", subject: "English", publisher: "", isbn: "9780061097317", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-30", title: "1984 (only this edition please, blue cover with eye)", author: "George Orwell", subject: "English", publisher: "", isbn: "9788899279974", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-31", title: "Pearson Biology HL for the IB Diploma (3rd edition)", author: "Damon, McGonegal, Ward", subject: "Biology HL", publisher: "", isbn: "9788899279977", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-32", title: "Pearson Biology SL for the IB Diploma (3rd edition)", author: "Damon, McGonegal, Ward", subject: "Biology SL", publisher: "", isbn: "9781292427737", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-33", title: "Oxford IB Diploma Programme: IB Economics Course Book (2020 edition)", author: "Blink J., Dorton I.", subject: "Economics HL & SL", publisher: "", isbn: "9781382004961", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-34", title: "To be decided, more info in September", subject: "Visual Arts", publisher: "", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-35", title: "Il mare colore del vino", author: "Leonardo Sciascia", subject: "Italian A", publisher: "", isbn: "9788845925634", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-36", title: "L'atlante delle donne", author: "Joni Seager", subject: "Italian A", publisher: "", isbn: "9788867832620", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-37", title: "Troiane", author: "Euripide", subject: "Italian A", publisher: "", isbn: "9788817172400", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-38", title: "L'acquisto di ulteriori testi e materiali sarà richiesto nel corso dell'anno scolastico.", subject: "Italian A", publisher: "", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp1-39", title: "鼓舞  Gu Wu for Secondary Mandarin Chinese: Student Book & CD-ROM", author: "Kwun Shun Shih,Yan Wang", subject: "Chinese", publisher: "", isbn: "9780198408321", availableFromPreviousYear: true, grade: "DP 1", program: "DP" },
  { id: "diplomadp2-1", title: "La tresse", author: "Laetitia Colombani", subject: "French", publisher: "", isbn: "9782253906568", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-2", title: "French B course companion 2nd edition. Aprile 2018", author: "Christine Trumper, John Israel", subject: "French", publisher: "", isbn: "9780198422372", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-3", title: "Maths: Applications and Interpretation Standard Level Print and eBook", author: "Ibrahim Wazir, Tim Garry, Jim Nakamoto, Kevin Frederick, Stephen Lumb, Byran Landman", subject: "Mathematics", publisher: "", isbn: "9780435193454", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-4", title: "Mathematics: Analysis and Approaches Standard Level Course Companion", author: "Paul La Rondie, Jill Stevens, Natasha Awada, Jennifer Chang Wathall, Ellen Thompson, Laurie Buchanan, Ed Kemp", subject: "Mathematics", publisher: "", isbn: "9780198427100", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-5", title: "Mathematics: Analysis and Approaches Higher Level Course Companion", author: "Marlene Torres Skoumal, Rose Harrison, Josip Harcet, Jennifer Chang Wathall, Lorraine Heinrichs", subject: "Mathematics", publisher: "", isbn: "9780198427162", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-6", title: "TI-84 Plus CE-T Graphing Display Calculator", author: "Texas Instruments", subject: "Mathematics", publisher: "", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-7", title: "Oxford IB Diploma Programme Paperback - Authoritarian States - course companion", author: "Brian Gray Mariam Habibi, Sanjay Perera...", subject: "History SL and HL", publisher: "", isbn: "9780198310228", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-8", title: "World History - The Cold War  Superpower tensions and rivalries 2nd Edition 2017 Pearson", author: "Keely Rogers, Jo Thomas", subject: "History SL and HL", publisher: "", isbn: "9781447982364", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-9", title: "Oxford IB Diploma Programme - Rights and Protest - course companion", author: "Mark Rogers, Peter Clinton", subject: "History SL and HL", publisher: "", isbn: "9780198310198", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-10", title: "Kitchen", author: "Yoshimoto", subject: "Italian A", publisher: "", isbn: "9788807884603", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-11", title: "Accabadora", author: "Murgia", subject: "Italian A", publisher: "", isbn: "9788806221898", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-12", title: "Siddharta", author: "Hesse", subject: "Italian A", publisher: "", isbn: "9788845901843", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-13", title: "L'acquisto di ulteriori testi potrebbe essere richiesto nel corso dell'anno scolastico.", subject: "Italian A", publisher: "", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-14", title: "Marianela", author: "Benito Pérez Galdòs", subject: "Spanish", publisher: "", isbn: "9788420660967", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-15", title: "San Manuel Bueno, Martir", author: "Unamuno", subject: "Spanish", publisher: "", isbn: "9788420608464", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-16", title: "Mit uns ! B2 Arbeitsbuch", author: "Anna Breitsameter, Anna Hila", subject: "German", publisher: "", isbn: "9783193110602", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-17", title: "Mit uns ! B2 Kursbuch", author: "Anna Breitsameter, Anna Hila", subject: "German", publisher: "", isbn: "9783193010605", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-18", title: "Spanish B", author: "Ana Balbuena, Laura Martìn Cisneros", subject: "Spanish", publisher: "", isbn: "9780198422464", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-19", title: "Physics for the IB Diploma Coursebook with Digital Access (2Years) / (7th Edition)", author: "K.A. Tsokos", subject: "Physics", publisher: "", isbn: "9781009071888", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-20", title: "Oxford Resources for IB DP Biology: Course book (2023 edition)", author: "Andrew Allot , David Mindorff", subject: "Biology", publisher: "", isbn: "9781382016339", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-21", title: "Oxford Resources for IB DP Chemistry: Course book (2023 edition)", author: "Sergey Bylikin, Gary Horner, Elisa Jimenez Grant, David Tarcy", subject: "Chemistry", publisher: "", isbn: "9781382016469", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-22", title: "Pearson Psychology for the IB Diploma", author: "Christian Bryan, Peter Giddens, Christos Halkiopoulos", subject: "Psychology", publisher: "", isbn: "9781292210995", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-23", title: "Lessico familiare", author: "Natalia Ginzburg", subject: "Italian A", publisher: "", isbn: "9788806219291", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-24", title: "L'acquisto di ulteriori testi potrebbe essere richiesto nel corso dell'anno scolastico.", subject: "Italian A", publisher: "", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-25", title: "Design technology SL & HL: testprep workbook", author: "Ahire, Bhakti Mahendra", subject: "Design Technology", publisher: "", isbn: "9781913121013", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-26", title: "Business Management for the IB Diploma Coursebook with Digital Access 3rd edition", author: "Stimpson, Malli-Charchalaki, Smith", subject: "Business Management", publisher: "", isbn: "9781009053570", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-27", title: "鼓舞  Gu Wu for Secondary Mandarin Chinese: Student Book & CD-ROM", author: "Kwun Shun Shih,Yan Wang", subject: "Chinese", publisher: "", isbn: "9780198408321", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-28", title: "The Stranger", author: "Albert Camus", subject: "English A", publisher: "", isbn: "9780679720201", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
  { id: "diplomadp2-29", title: "Oxford Resources for IB DP Environmental Systems and Societies: Course Book  2024 version", author: "Gillian Williams and Jill Rutherford", subject: "Environmental Systems and Societies", publisher: "", isbn: "9781382044011", availableFromPreviousYear: true, grade: "DP 2", program: "DP" },
];

// Empty summer reading list (none in 2025-2026 source file)
export const summerReadingBooks: OfficialBook[] = [];

// Mock listings placeholder (no live data without DB query)
export const mockListings: Record<string, BookListing[]> = {};

// Returning-student helpers: books from previous grade that the student can sell
// or should keep (kept simple: a grade-to-next mapping)
const NEXT_GRADE: Record<string, string> = {
  "PYP 1": "PYP 2", "PYP 2": "PYP 3", "PYP 3": "PYP 4", "PYP 4": "PYP 5", "PYP 5": "MYP 1",
  "MYP 1": "MYP 2", "MYP 2": "MYP 3", "MYP 3": "MYP 4", "MYP 4": "MYP 5", "MYP 5": "DP 1",
  "DP 1": "DP 2",
};

export function getSellableBooks(previousGrade: string, _previousProgram: string): OfficialBook[] {
  const next = NEXT_GRADE[previousGrade];
  const previousBooks = officialBooks.filter((b) => b.grade === previousGrade);
  if (!next) return previousBooks;
  const nextIsbns = new Set(
    officialBooks.filter((b) => b.grade === next).map((b) => b.isbn).filter(Boolean)
  );
  // Sellable = previous-year book NOT reused in the next grade
  return previousBooks.filter((b) => !b.isbn || !nextIsbns.has(b.isbn));
}

export function getBooksToKeep(previousGrade: string, _previousProgram: string): OfficialBook[] {
  const next = NEXT_GRADE[previousGrade];
  if (!next) return [];
  const previousBooks = officialBooks.filter((b) => b.grade === previousGrade);
  const nextIsbns = new Set(
    officialBooks.filter((b) => b.grade === next).map((b) => b.isbn).filter(Boolean)
  );
  // Keep = previous-year book reused in the next grade
  return previousBooks.filter((b) => b.isbn && nextIsbns.has(b.isbn));
}
