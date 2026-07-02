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
  schoolYear?: string;
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

// ============================================================
// School-year configuration
// ============================================================
// "Last year" = the list students may already own and can resell now.
// "New year" = the upcoming list; NOT yet available. When uploaded, set
// NEW_SCHOOL_YEAR_AVAILABLE = true and populate `newYearBooks`.
export const LAST_SCHOOL_YEAR = "2025-2026";
export const NEW_SCHOOL_YEAR = "2026-2027";
export const NEW_SCHOOL_YEAR_AVAILABLE = true;

// 2026-2027 book reference list (imported from admin XLSX).
export const newYearBooks: OfficialBook[] = [
  { id: "nmyp1-0", title: "¡Venga, vamos! 1", author: "Ramos, C.; Santos, M.; Santos, M. J.", subject: "Spanish", publisher: "De Agostini", isbn: "9788851159184", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-1", title: "Vacaciones en Misiones", author: "Fernando Andrés Ceravolo", subject: "Spanish", publisher: "CIDEB", isbn: "9788853021342", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-2", title: "To be purchased in September", subject: "English LA", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-3", title: "快乐汉语 HAPPY CHINESE | Kuaile Hanyu Vol.1 - Student's Book (Second Edition、 English edition)", author: "LI Xiaoqi", subject: "Mandarin Chinese", publisher: "People's Education Press", isbn: "9787107278945", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-4", title: "Prima aktiv ∙ Deutsch für Jugendliche A1: Band 1 Kursbuch und Arbeitsbuch im Paket", author: "Jin, Friederike; Kothari, Anjali; Jentges, Sabine", subject: "German", publisher: "Cornelsen Verlag", isbn: "9783061229726", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-5", title: "(the textbook will be determined in the month of September)", subject: "Italian B (Language Aquisition for non-native italian speakers)", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-6", title: "Qui êtes-vous, Monsieur Eiffel ?", author: "Adriana Kritter", subject: "French", publisher: "Didier", isbn: "9782278096053", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-7", title: "Paris découverte en poche (valido per 3 anni)", author: "Rossella Bruneri, Martine Pelon", subject: "French", publisher: "Pearson/ Lang edizioni", isbn: "9788861616509", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-8", title: "Un libro di lettura sarà comunicato tra settembre e ottobre dall'insegnante", subject: "Italiano per madrelingua", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-9", title: "Mi trasformerò in meraviglia", author: "Elisa Golinelli, Sabina Minuto", subject: "Italian per madrelingua", publisher: "Palumbo editore", isbn: "9788868899790", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-10", title: "L’Odissea raccontata ai bambini", author: "Rosa Navarro Durán", subject: "Italian per madrelingua", publisher: "Mondadori", isbn: "978880478477", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-11", title: "Le parole che scegli", author: "Marta Meneghini, Antonietta Lorenzi, Luisa Benucci", subject: "Italian per madrelingua", publisher: "Loescher Editore", isbn: "9788858361054", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-12", title: "L'avventura più grande 1 continua", author: "Linda Cavadini, Loretta De Martin, Agnese Pianigiani", subject: "Italian per madrelingua", publisher: "Edizioni scolastiche Bruno Mondadori", isbn: "9791221601008", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-13", title: "Books for English depend on the section and they will be advised in September.", subject: "English LL", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-14", title: "National Geographic Student World Atlas, 7th edition july 2025", author: "National Geographic Kids 2025", subject: "Geography", publisher: "National Geographic Kids", isbn: "101426376499139781426376498", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-15", title: "Medieval British and World History 410-1509 (Knowing History)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt, Series edited by Robert Peal", subject: "History", publisher: "Collins", isbn: "9780008492045", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-16", title: "PDF will be given", subject: "Sciences", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-17", title: "Cambridge Checkpoint Lower Secondary Science student's book 7, 3rd Edition (da usare MYP1 e MYP2)", author: "Peter Riley", subject: "General", publisher: "Hodder Education", isbn: "9781398300187", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-18", title: "Mathematics 7 MYP2 - third edition (da usare in MYP1 e MYP2)", author: "Michael Haese, Sandra Haese, Mark Humphries, Edward Kemp, Pamela Vollmar", subject: "Mathematics", publisher: "Haese mathematics", isbn: "9781922416308", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-19", title: "RealM@t. Aritmetica 1 + Geometria 1 + Matematica e realtà 1 +E-book cl. 1", author: "Miglio-Solmi", subject: "Mathematics", publisher: "Edizioni Capitello", isbn: "9788842653332", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-20", title: "Canson XL schizzo. 90g/m (120 fogli) (potete acquistarlo presso Crob Art in via San Bernardo 97 R, Genova. Tel: 010 247 1283)", subject: "Art", publisher: "", isbn: "3148957871353", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-21", title: "PDF will be given", subject: "Art", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-22", title: "Keyboard: • Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia. • Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). • La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe. Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-23", title: "PDF will be given", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp1-24", title: "SPHERO MINI robot (https://sphero.com/products/sphero-mini)", subject: "Design", publisher: "", availableFromPreviousYear: false, grade: "MYP 1", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-25", title: "Prima aktiv ∙ Deutsch für Jugendliche A1: Band 2 Kursbuch und Arbeitsbuch im Paket", author: "Jin, Friederike; Kothari, Anjali; Jentges, Sabine", subject: "German", publisher: "Cornelsen Verlag", isbn: "9783061226053", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-26", title: "快乐汉语 Happy Chinese [Kuaile Hanyu] Textbook / Student's Book 2", author: "AAVV", subject: "Mandarin Chinese", publisher: "Peoples Education Press", isbn: "9787107171277", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-27", title: "Josephine Baker fait son entrée au Panthéon", author: "Marie-Noëlle Cocton", subject: "French", publisher: "Didier", isbn: "9782278108664", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-28", title: "Paris découverte en poche (già in possesso da MYP1)", author: "Rossella Bruneri, Martine Pelon", subject: "French", publisher: "Pearson/ Lang edizioni", isbn: "9788861616509", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-29", title: "To be purchased in September", subject: "English", publisher: "", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-30", title: "¡Venga, vamos! 2", author: "Ramos, C.; Santos, M; Santos, M. J.", subject: "Spanish", publisher: "De Agostini", isbn: "9788851159191", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-31", title: "Misterio en Buenos Aires", author: "Fernando Andrés Ceravolo", subject: "Spanish", publisher: "CIDEB", isbn: "9788853018434", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-32", title: "L'avventura più grande 2 continua", author: "Linda Cavadini, Loretta De Martin, Agnese Pianigiani", subject: "Italian per madrelingua", publisher: "Edizioni scolastiche Bruno Mondadori", isbn: "9791221601022", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-33", title: "Il sognalibro, La letteratura", author: "S. Damele, T. Franzi", subject: "Italian per madrelingua", publisher: "Loescher", isbn: "9788858357040", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-34", title: "Nessuno verrà a prenderti", author: "Manlio Castagna", subject: "Italian per madrelingua", publisher: "Mondadori", isbn: "9788804798064", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-35", title: "Si può dire", author: "Anna Degani, Anna Maria Mandelli, Pier Giorgio Viberti", subject: "Italian per madrelingua", publisher: "SEI EDITRICE", isbn: "9788805078271", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-36", title: "La “Commedia” di Dante Alighieri", author: "Stefano Motta", subject: "Italian per madrelingua", publisher: "Alfa Edizioni", isbn: "9788883750328", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-37", title: "To be purchased in September", subject: "English", publisher: "", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-38", title: "Knowing History - Modern British and World History 1760-1900: (Second edition)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt, Series edited by Robert Peal", subject: "History", publisher: "Collins", isbn: "9780008492069", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-39", title: "Early Modern British and World History 1509-1760 (Knowing History)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt, Series edited by Robert Peal", subject: "History", publisher: "Collins", isbn: "9780008492052", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-40", title: "National Geographic Student World Atlas, 6th Edition Paperback", author: "Chris Bickel, National Geographic (July 5, 2022)", subject: "Geography", publisher: "National Geographic Kids", isbn: "9781426373435", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-41", title: "Cambridge Checkpoint Lower Secondary Science student's book 8, Third edition", author: "Peter Riley", subject: "Sciences", publisher: "Hodder Education", isbn: "9781398302099", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-42", title: "Mathematics 7 MYP2 - third edition (già in possesso da MYP1)", author: "Michael Haese, Sandra Haese, Mark Humphries, Edward Kemp, Pamela Vollmar", subject: "Mathematics", publisher: "Haese mathematics", isbn: "9781921972454", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-43", title: "RealM@t Aritmetica 2 + Geometria 2 + Matematica e realtà 2 +E-book cl. 2", author: "Miglio-Solmi", subject: "Mathematics", publisher: "Edizioni Capitello", isbn: "9788842653349", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-44", title: "Keyboard: • Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia. • Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). • La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe. Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-45", title: "Libro in PDF da stampare - nuovo quaderno grande morbido da etichettare con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-46", title: "Canson XL schizzo. 90g/m (120 fogli) solo se non lo possedete già", author: "Canson: Per l'acquisto rivolgervi a Crob Art: Via di San Bernardo, 16123 Genova 010 247 1283.", subject: "Art", publisher: "", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-47", title: "L'insegnante fornirá delle dispense dove necessario", subject: "Art", publisher: "", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp2-48", title: "SPHERO MINI robot", author: "https://sphero.com/products/sphero-mini", subject: "Design", publisher: "YES", availableFromPreviousYear: false, grade: "MYP 2", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-49", title: "Marie Curie ma grand-mère", author: "Jérémie Dres", subject: "French", publisher: "Didier", isbn: "9782278094417", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-50", title: "Paris découverte en poche (già in possesso da MYP1)", author: "Rossella Bruneri, Martine Pelon", subject: "French", publisher: "Pearson/ Lang edizioni", isbn: "9788861616509", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-51", title: "¡Venga, vamos! 3", author: "Ramos, C.; Santos, M; Santos, M. J.", subject: "Spanish", publisher: "De Agostini", isbn: "9788851159207", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-52", title: "El collar visigodo", author: "Dolores Villa Vázquez", subject: "Spanish", publisher: "CIDEB", isbn: "9788853014252", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-53", title: "To be communicated in September", subject: "English", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-54", title: "标准教程 HSK Standard Course 2 - Textbook", author: "JIANG Liping", subject: "Mandarin Chinese", publisher: "Beijing University Press", isbn: "9787561937266", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-55", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B (Language Aquisition for non-native italian speakers)", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-56", title: "Ein tolles Team A2.1 Kursbuch", author: "Giorgio Motta", subject: "German B", publisher: "Hueber", isbn: "21319201810031920181003740345373468754758210711084906928848536723347583533092170992362262934368184853672334758353303192018100x0", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-57", title: "Ein tolles Team A2.1 Arbeitsbuch", author: "Giorgio Motta", subject: "German B", publisher: "Hueber", isbn: "213192118105x12581569799926464418859494495184288741248859494495184288741241877416510156408566057741431921181051", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-58", title: "To be communicated in September", subject: "English LL", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-59", title: "Il sognalibro, La letteratura", author: "S. Damele, T. Franzi", subject: "Italian per madrelingua", publisher: "Loescher", isbn: "9788858357040", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-60", title: "Si può dire", author: "Anna Degani, Anna Maria Mandelli, Pier Giorgio Viberti", subject: "Italian per madrelingua", publisher: "SEI EDITRICE", isbn: "9788805078271", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-61", title: "L’amico ritrovato", author: "Fred Uhlman", subject: "Italian per madrelingua", publisher: "Loescher (se non disponibile questa edizione, va bene anche edizione diversa)", isbn: "9788820131524", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-62", title: "Renzo e Lucia: un amore contrastato", author: "Paola Cataldo", subject: "Italian per madrelingua", publisher: "Loescher", isbn: "9788882440473", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-63", title: "Prima e dopo l'esame - speciale nuovo esame di stato e orientamento", author: "T. Franzi - S. Damele", subject: "Italian per madrelingua", publisher: "Loescher", isbn: "9788858330807", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-64", title: "Prepararsi alla prova invalsi", author: "Marta Meneghini, Antonietta Lorenzi", subject: "Italian per madrelingua", publisher: "Loescher", isbn: "9788858330708", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-65", title: "Alisei 3 I continenti europei. Volume + Atlante + Atlante della sostenibilità + Libro digitale + Libro digitale liquido + MyApp + Piattaforma KmZero", author: "Corbellini Giancarlo", subject: "Geography", publisher: "Edizioni scolastiche Bruno Mondadori, Pearson", isbn: "9788869107481", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-66", title: "Incontra la storia. Volume 3 Fatti e persone del Novecento e di oggi + Quaderno delle competenze 3 + Strumenti compensativi 3", author: "Vittoria Calvani", subject: "History", publisher: "Mondadori Education", isbn: "9788824762083", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-67", title: "Knowing History - Twentieth Century British and World History 1900-2020: (Second edition)", author: "Robert Peal, Robert Selth and Laura Aitken-Burt", subject: "History", publisher: "Collins", isbn: "9780008492076", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-68", title: "Esperienza STEAM. Con e-book. Con espansione online vol.3", author: "Stefano Zanoli", subject: "Sciences", publisher: "Mondadori Education", isbn: "9791220412742", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-69", title: "RealM@t Aritmetica 3 + Geometria 3 + Matematica e realtà 3 +E-book cl. 3", author: "Miglio - Solmi", subject: "Mathematics", publisher: "Edizioni Il Capitello", isbn: "9788842653356", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-70", title: "Keyboard: • Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia. • Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). • La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe. Quaderno grande morbido (no anelli) a quadretti o righe come si preferisce. Da etichettare la copertina con nome e cognome.", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-71", title: "Libro in PDF da stampare e nuovo quaderno grande morbido da etichettare con nome e cogome .", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-72", title: "PDF verra' fornito a settembre", subject: "Art", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-73", title: "Canson XL schizzo. 90g/m (120 foglic) solo se non lo possedete già", subject: "Art", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp3-74", title: "Dispense in PDF da stampare o.da visualizzare in formato digitale", subject: "Design", publisher: "", availableFromPreviousYear: false, grade: "MYP 3", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-75", title: "标准教程 HSK Standard Course 3 - Textbook", author: "Liping JIANG", subject: "Mandarin Chinese", publisher: "Beijing University Press", isbn: "9787561938188", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-76", title: "El faro de los acantilados", author: "José Luis Martín Nogales", subject: "Spanish", publisher: "editorial ANAYA", isbn: "9788467840483", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-77", title: "Mentes curiosas volumen 2 + HUB Yung+HUB kit (valido per due anni)", author: "Trinidad Fernandez Gonzalez, Marco Morretta,Antonino Giannopolo", subject: "Spanish", publisher: "Rizzoli Languages", isbn: "9788838349485", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-78", title: "MMotive. KompaktKurs DaF A1-B1 Kursbuch https://www.amazon.it/gp/product/3190018782/ref=ox_sc_act_title_2?smid=A2S1BY3849YLP9&psc=1", author: "Puchta/Kreen", subject: "German B", publisher: "Hueber", isbn: "9783190018789", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-79", title: "Motive. KompaktKurs DaF A1-B1 Arbeitsbuch https://www.amazon.it/gp/product/3190418780/ref=ox_sc_act_title_1?smid=A2S1BY3849YLP9&psc=1", author: "Puchta/Kreen", subject: "German B", publisher: "Hueber", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-80", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B (Language Aquisition for non-native italian speakers)", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-81", title: "#français 2 Livre de l'élève et cahier (libro rosa) VALIDO PER DUE ANNI", author: "Colette Berger, Gabrie Frémiaux, Carole Poirey, Anita Walther", subject: "French", publisher: "DeA Scuola/ Cideb", isbn: "9788853020680", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-82", title: "Oscar et la dame rose", author: "Éric-Emmanuel Schmidt", subject: "French", publisher: "Magnard", isbn: "9782210754904", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-83", title: "Mille pagine di letteratura. Vol. unico. Dalle origini a oggi (il testo sarà in uso per due anni)", author: "Roncoroni, Cappellini, Sada", subject: "Italian A", publisher: "Carlo Signorelli Editore", isbn: "9788843423958", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-84", title: "Nel nome del figlio. Hamnet", author: "Maggie O' Farrell", subject: "Italian A", publisher: "GUANDA", isbn: "9788823536708", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-85", title: "Altri libri di lettura saranno comunicati nel corso dell'anno", subject: "Italian A", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-86", title: "Dispense a cura del docente", subject: "Italian A", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-87", title: "Stories of Ourselves: volume 1 (valido per due anni)", author: "Various", subject: "English", publisher: "Cambridge", isbn: "9781108462297", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-88", title: "Of Mice and Men", author: "John Steinbeck", subject: "English", publisher: "Penguin", isbn: "9780141396033", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-89", title: "The other books for English depend on the section. Books per section will be advised in September.", subject: "English", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-90", title: "NO BOOK", subject: "Individuals and Societies", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-91", title: "Cambridge IGCSE Biology: Coursebook (fourth ed)", author: "Mary jones and Geoff Jones", subject: "Biology", publisher: "Cambridge University Press", isbn: "9781108936767", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-92", title: "MYP Physics: a Concept Based Approach", author: "William Heathcote", subject: "Physics", publisher: "Oxford University Press", isbn: "9780198375555", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-93", title: "MYP Chemistry Years 4&5 - a concept base approach", author: "Gary Horner", subject: "Chemistry", publisher: "Oxford University Press", isbn: "9780198369967", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-94", title: "Mathematics for the International Student 10E 3rd Edition (Questo libro sarà valido per 2 anni - This books will be used for 2 years)", author: "Haese, Haese, Humphries, Kemp, Vollmar", subject: "Mathematics", publisher: "Haese Mathematics", isbn: "9781922416384", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-95", title: "Graphing Calculator: Casio FX-CG50, If you inherit it or already have it, the TI-84 Plus CE-T/Python edition is fine as well", author: "Casio OR Texas Instruments", subject: "Mathematics", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-96", title: "PDF", subject: "Arts", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-97", title: "Canson XL schizzo. 90g/m (120 fogli)", author: "art store (Crob Art/ Carto and Shop...)", subject: "Arts", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-98", title: "Keyboard: • Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia. • Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). • La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe. fascetta di plastica", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp4-99", title: "Computer Core i5, minimum 8G RAM, 500 ssd", subject: "Design", publisher: "", availableFromPreviousYear: false, grade: "MYP 4", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-100", title: "Juntos", author: "Carla Polettini, José Pérez Navarro", subject: "Spanish", publisher: "Zanichelli", isbn: "9788808922281", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-101", title: "#français 2 Livre de l'élève et cahier (libro rosa)", author: "Colette Berger, Gabrie Frémiaux, Carole Poirey, Anita Walther", subject: "French", publisher: "DeA Scuola/ Cideb", isbn: "9788853020680", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-102", title: "Kiffe-kiffe demain", author: "Faiza Guène", subject: "French", publisher: "Le livre de Poche", isbn: "9782253113751", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-103", title: "MYP 4 and MYP5 Language Acquisition (Phases 5 and 6)", author: "Kevin Morley and Alexei Gafan", subject: "English Language Acquisition", publisher: "OUP", isbn: "9781382010832", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-104", title: "Ein tolles Team B1.2 Kursbuch", author: "Girgio Motta", subject: "German B", publisher: "Hueber", isbn: "9783195018104", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-105", title: "Ein tolles Team B1.2 Arbeitsbuch", author: "Girogio Motta", subject: "German B", publisher: "Hueber", isbn: "9783195118101", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-106", title: "Marianela", author: "Benito Pérez Galdós", subject: "Spanish", publisher: "Cátedra", isbn: "9788420660967", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-107", title: "标准教程 HSK Standard Course 3 - Textbook", author: "Liping JIANG", subject: "Mandarin Chinese", publisher: "Beijing University Press", isbn: "9787561938188", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-108", title: "Text books will be chosen at the beginning of the school year", subject: "Italian B (Language Aquisition for non-native italian speakers)", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-109", title: "English Language and Literature students - the adoption of this textbook will be confirmed in September", author: "Gillian Ashworth", subject: "English Language and Literature", publisher: "Hodder", isbn: "9781471841668", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-110", title: "Saranno fornite dalla docente dispense in PDF da stampare", subject: "Italian A", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-111", title: "Michael Kohlhaas", author: "Heinrich Von Kleist", subject: "Italian A", publisher: "Mondadori", isbn: "9788804742395", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-112", title: "NO BOOK", subject: "Individuals and Societies", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-113", title: "MYP Physics: a Concept Based Approach (già in uso per myp4/already in use in MYP4)", author: "William Heathcote", subject: "Physics", publisher: "Oxford University Press", isbn: "9780198375555", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-114", title: "Cambridge IGCSE Biology: Coursebook (fourth ed) (already in use in MYP4)", author: "Mary jones and Geoff Jones", subject: "Biology", publisher: "Cambridge University Press", isbn: "9781108936767", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-115", title: "MYP Chemistry Years 4&5 - a concept base approach", author: "Gary Horner", subject: "Chemistry", publisher: "Oxford University Press", isbn: "9780198369967", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-116", title: "Mathematics for the International Student 10E - 3rd Edition (Già in possesso da MYP4/already adopted in MYP4 )", author: "Haese, Haese, Humphries, Kemp, Vollmar", subject: "Mathematics", publisher: "Hease Mathematics", isbn: "9781922416384", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-117", title: "Graphing Calculator: Casio FX-CG50, If you inherit it or already have it, the TI-84 Plus CE-T/Phyton edition is fine as well", author: "Texas Instruments OR Casio", subject: "Mathematics", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-118", title: "PDF verranno forniti da settembre", subject: "Art", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-119", title: "Canson XL schizzo. 90g/m (120 fogli)", author: "art store", subject: "Arts", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-120", title: "Keyboard: • Tastiera a quattro ottave (49 tasti) con ingresso cuffie e custodia. • Negozio: Storti in Via Fiasella 25R, Genova. Chiedere la dimensione standard per le scuole medie (esempio MEDELI MC37A). • La tastiera e la custodia vanno etichettate perché non potranno essere lasciate in classe.", subject: "Music", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "nmyp5-121", title: "Computer Core i5, minimum 8G RAM, 500 ssd", subject: "Design", publisher: "", availableFromPreviousYear: false, grade: "MYP 5", program: "MYP", schoolYear: "2026-2027" },
  { id: "ndp1-122", title: "La metamorfosi e tutti i racconti pubblicati in vita", author: "Franz Kafka", subject: "Italian Literature SL/HL", publisher: "Feltrinelli", isbn: "9788807900730", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-123", title: "Lettere a Lucilio", author: "Seneca", subject: "Italian Literature HL", publisher: "BUR", isbn: "9788817120135", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-124", title: "L'acquisto di ulteriori testi potrebbe essere richiesto nel corso dell'anno scolastico.", subject: "Italian Literature SL/HL", publisher: "", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-125", title: "Il mare colore del vino", author: "Leonardo Sciascia", subject: "Italian A Language and Literature SL/HL", publisher: "Adelphi", isbn: "9788845925634", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-126", title: "L'atlante delle donne", author: "Joni Seager", subject: "Italian A Language and Literature SL/HL", publisher: "ADD Editore", isbn: "9788867832620", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-127", title: "Antigone", author: "Sofocle", subject: "Italian A Language and Literature SL/HL", publisher: "Mondadori", isbn: "9788804671121", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-128", title: "Bestiario", author: "Julio Cortázar", subject: "Italian A Language and Literature HL", publisher: "Einaudi", isbn: "9788806222604", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-129", title: "L'acquisto di ulteriori testi e materiali sarà richiesto nel corso dell'anno scolastico.", subject: "Italian A Language and Literature SL/HL", publisher: "", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-130", title: "Macbeth (2009 edition): Oxford School Shakespeare", author: "Shakespeare", subject: "English A Lit & Lang. HL ONLY", publisher: "Oxford School Shakespeare", isbn: "9780198324003", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-131", title: "The Thing Around Your Neck", author: "C. N. Adichie", subject: "English A Lit. & Language SL/HL", publisher: "Harper UK", isbn: "9780007306213", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-132", title: "The Stranger", author: "Albert Camus", subject: "English A Lit. & Language HL ONLY", publisher: "vintage", isbn: "9780679720201", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-133", title: "Chronicle of a Death Foretold (another edition is also fine: Vintage ISBN 9781400034710)", author: "G. G. Marquez", subject: "English A Lit. & Language SL/HL", publisher: "Penguin", isbn: "9780241968628", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-134", title: "PDFs to be dowloaded/printed during the year", author: "PDFs to be printed (the files will be made available at the beginning of the year)", subject: "English A Lit. & Language SL/HL", publisher: "", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-135", title: "English B for the IB Diploma NEW edition (July 2018)", author: "Philpot, Brad", subject: "English B: HL", publisher: "Cambridge univ. press", isbn: "9781108434812", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-136", title: "Born a Crime", author: "Trevor Noah", subject: "English B: HL", publisher: "Random House", isbn: "9780525509028", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-137", title: "The Bean trees", author: "Barbara Kingsolver", subject: "English B: HL", publisher: "Abacus", isbn: "9780349114170", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-138", title: "French B course companion 2nd edition. Aprile 2018 (valido per 2 anni)", author: "Christine Trumper, John Israel", subject: "French B (SL/HL))", publisher: "Oxford University Press", isbn: "9780198422372", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-139", title: "Spanish B- valido per 2anni", author: "Ana Balbuena Laura Martn Cisneros", subject: "Spanish B", publisher: "Oxford University Press", isbn: "9780198422464", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-140", title: "Marianela", author: "Benito Pérez Galdós", subject: "Spanish B", publisher: "Catedra", isbn: "9788437620619", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-141", title: "Mit uns ! B2 Arbeitsbuch", author: "Anna Breitsameter, Anna Hila", subject: "German B SL/HL", publisher: "Hueber", isbn: "9783193110608", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-142", title: "Mit uns ! B2 Kursbuch", author: "Anna Breitsameter, Anna Hila", subject: "German B SL/HL", publisher: "Hueber", isbn: "9783193010605", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-143", title: "鼓舞 Gu Wu for Secondary Mandarin Chinese: Student Book & CD-ROM", author: "Kwun Shun Shih,Yan Wang", subject: "Mandarin Ab Initio", publisher: "‎ OUP Oxford", isbn: "9780198408321", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-144", title: "Gramm.it for english-speakers. Livello A1-C1", author: "Gabriella Iacovoni, Nadia Persiani, Barbara Fiorentino", subject: "Italian Ab Initio", publisher: "Bonacci", isbn: "9788875734305", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-145", title: "Paper 1: Access to History for the IB Diploma: Protest and change: Feminism in the USA (1960-1979) and Revolution in Tunisia (1989-2015)", author: "Serene Williams, Kristen Kelly, Else Mokleyby Saoud", subject: "History SL/HL", publisher: "Hachette Learning", isbn: "9781036014728", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-146", title: "Paper 2: Access to History for the IB Diploma: Conflict (from 750 CE onwards)", author: "Andy Dailey, Kareem Almusharaf", subject: "History SL/HL", publisher: "Hachette Learning", isbn: "9781036014742", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-147", title: "Paper 3: Access to History for the IB Diploma: Social movements in the Americas (1945-2020)", author: "Vivienne Sanders", subject: "History HL", publisher: "Hachette Learning", isbn: "9781036014810", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-148", title: "Paper 3: Access to History for the IB Diploma: Political developments in the USA and Canada (1960-2020)", author: "Vivienne Sanders", subject: "History HL", publisher: "Hachette Learning", isbn: "9781036014827", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-149", title: "Oxford IB Diploma Programme: IB Economics Course Book (2020 edition)", author: "Blink J., Dorton I.", subject: "Economics SL/HL", publisher: "Oxford University Press", isbn: "9781382004961", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-150", title: "Oxford Resources for IB: DP Psychology Course Book", author: "Alexey Popov", subject: "Psychology SL/HL", publisher: "Oxford University Press", isbn: "9781382056663", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-151", title: "Physics for the IB Diploma Coursebook with Digital Access (2Years) / (7th Edition)", author: "K.A. Tsokos", subject: "Physics HL", publisher: "Cambridge University Press", isbn: "9781009071888978", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-152", title: "Physics for the IB Diploma Programme", author: "Emma Mitchell", subject: "Physics SL", publisher: "Pearson Education Limited", isbn: "9781292427713", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-153", title: "Oxford Resources for IB DP Chemistry: Course book (2023 edition)", author: "Sergey Bylikin, Gary Horner, Elisa Jimenez Grant, David Tarcy", subject: "Chemistry SL/HL", publisher: "Oxford University Press", isbn: "9781382016469", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-154", title: "Pearson Biology HL for the IB Diploma (3rd edition)", author: "Damon, McGonegal, Ward", subject: "Biology HL", publisher: "Pearson", isbn: "9781292427744", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-155", title: "Pearson Biology SL for the IB Diploma (3rd edition)", author: "Damon, McGonegal, Ward", subject: "Biology SL", publisher: "Pearson", isbn: "9781292427737", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-156", title: "Oxford Resources for IB DP Environmental Systems and Societies: Course Book 2024 version", author: "Gillian Williams and Jill Rutherford", subject: "ESS", publisher: "Oxford University Press", isbn: "9781382044011", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-157", title: "Maths: Applications and Interpretation Standard Level Print and eBook", author: "Ibrahim Wazir, Tim Garry, Jim Nakamoto, Kevin Frederick, Stephen Lumb, Byran Landman", subject: "Mathematics Applications and interpretation SL", publisher: "Pearson Education Limited", isbn: "9780435193454", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-158", title: "Mathematics: Analysis and Approaches Standard Level Course Companion", author: "Paul La Rondie, Jill Stevens, Natasha Awada, Jennifer Chang Wathall, Ellen Thompson, Laurie Buchanan, Ed Kemp", subject: "Mathematics Analysis and Approaches SL", publisher: "Oxford University Press", isbn: "9780198427100", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-159", title: "Mathematics: Analysis and Approaches Higher Level Course Companion", author: "Marlene Torres Skoumal, Rose Harrison, Josip Harcet, Jennifer Chang Wathall, Lorraine Heinrichs", subject: "Mathematics Analysis and Approaches HL", publisher: "Oxford University Press", isbn: "9780198427162", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-160", title: "Graphing Calculator: Casio FX-CG50, If you inherit it or already have it, the TI-84 Plus CE-T is fine as well", author: "Casio or Texas Instruments", subject: "All Mathematics", publisher: "", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-161", title: "“Visual Arts” - Course Companion 2025 EDITION", author: "Nathaniel Katz, Jayson Paterson, Simon Poppy", subject: "Visual Arts", publisher: "Oxford Resources for IB - Diploma Programme", isbn: "9781382060660", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp1-162", title: "NO BOOK", subject: "TOK", publisher: "", availableFromPreviousYear: false, grade: "DP 1", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-163", title: "Kitchen", author: "Yoshimoto", subject: "Italian Literature SL/HL", publisher: "Feltrinelli", isbn: "9788807884603", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-164", title: "Accabadora", author: "Murgia", subject: "Italian Literature SL/HL", publisher: "Einaudi", isbn: "9788806221898", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-165", title: "Siddharta", author: "Hesse", subject: "Italian Literature only HL", publisher: "Adelphi", isbn: "9788845901843", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-166", title: "L'acquisto di ulteriori testi potrebbe essere richiesto nel corso dell'anno scolastico.", subject: "Italian Literature SL/HL", publisher: "", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-167", title: "Lessico famigliare", author: "Natalia Ginzburg", subject: "Italian A Language and Literature - SL/HL", publisher: "Einaudi", isbn: "9788806219291", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-168", title: "Bestiario", author: "Julio Cortázar", subject: "Italian A Language and Literature - SL/HL", publisher: "Einaudi", isbn: "9788806222604", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-169", title: "Danilo Dolci Verso un mondo nuovo, Mediterraneo", author: "Diego Di Masi, Alessio Surian, Emiliano Martino, Lorenzo Martino", subject: "Italian A Language and Literature - HL", publisher: "Becco Giallo", isbn: "9788833143699", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-170", title: "L'acquisto di ulteriori testi potrebbe essere richiesto nel corso dell'anno scolastico.", subject: "Italian A Language and Literature SL/HL", publisher: "", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-171", title: "French B course companion 2nd edition. Aprile 2018 (già in possesso)", author: "Christine Trumper, John Israel", subject: "French B", publisher: "Oxford University", isbn: "9780198422372", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-172", title: "Tristana", author: "Benito Pérez Galdòs", subject: "Spanish B", publisher: "Alianza Editorial", isbn: "9788420660967", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-173", title: "San Manuel Bueno, Martir", author: "Unamuno", subject: "Spanish B", publisher: "Alianza Editorial", isbn: "9788420608464", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-174", title: "Spanish B", author: "Ana Balbuena, Laura Martìn Cisneros", subject: "Spanish B", publisher: "Oxford University Press", isbn: "9780198422464", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-175", title: "Mit uns ! B2 Arbeitsbuch", author: "Anna Breitsameter, Anna Hila", subject: "German B", publisher: "Hueber", isbn: "9783193110602", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-176", title: "Mit uns ! B2 Kursbuch", author: "Anna Breitsameter, Anna Hila", subject: "German B", publisher: "Hueber", isbn: "9783193010605", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-177", title: "鼓舞 Gu Wu for Secondary Mandarin Chinese: Student Book & CD-ROM", author: "Kwun Shun Shih,Yan Wang", subject: "Mandarin Ab Initio", publisher: "‎ OUP Oxford", isbn: "9780198408321", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-178", title: "Oxford IB Diploma Programme Paperback - Authoritarian States - course companion", author: "Brian Gray Mariam Habibi, Sanjay Perera...", subject: "History SL/HL", publisher: "Oxford University Press 1st Edition 2015", isbn: "9780198310228", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-179", title: "World History - The Cold War Superpower tensions and rivalries 2nd Edition 2017 Pearson", author: "Keely Rogers, Jo Thomas", subject: "History SL/HL", publisher: "Pearson 2nd Edition 2017", isbn: "9781447982364", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-180", title: "History for the IB Diploma Paper 3 The Peoples Republic of China (1949-2005)", author: "Allan Tod", subject: "History HL", publisher: "Cambridge University Press", isbn: "9781316503775", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-181", title: "Oxford Resources for IB: DP Psychology Course Book", author: "Alexey Popov", subject: "Psychology SL/HL", publisher: "Oxford University Press", isbn: "9781382056663", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-182", title: "Oxford IB Diploma Programme: IB Economics Course Book (2020 edition)", author: "Blink J., Dorton I.", subject: "Economics SL/HL", publisher: "Oxford University Press", isbn: "9781382004961", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-183", title: "Physics for the IB Diploma Coursebook with Digital Access (2Years) / (7th Edition)", author: "K.A. Tsokos", subject: "Physics", publisher: "Cambridge University Press", isbn: "9781009071888", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-184", title: "Pearson Biology HL for the IB Diploma (3rd edition)", author: "Damon, McGonegal, Ward", subject: "Biology HL", publisher: "Pearson", isbn: "9781292427744", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-185", title: "Pearson Biology SL for the IB Diploma (3rd edition)", author: "Damon, McGonegal, Ward", subject: "Biology SL", publisher: "Pearson", isbn: "9781292427737", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-186", title: "Oxford Resources for IB DP Chemistry: Course book (2023 edition)", author: "Sergey Bylikin, Gary Horner, Elisa Jimenez Grant, David Tarcy", subject: "Chemistry SL/HL", publisher: "Oxford University Press", isbn: "9781382016469", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-187", title: "Oxford Resources for IB DP Environmental Systems and Societies: Course Book 2024 version", author: "Gillian Williams and Jill Rutherford", subject: "ESS", publisher: "Oxford University Press", isbn: "9781382044011", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-188", title: "Maths: Applications and Interpretation Standard Level Print and eBook", author: "Ibrahim Wazir, Tim Garry, Jim Nakamoto, Kevin Frederick, Stephen Lumb, Byran Landman", subject: "Mathematics Applications and interpretation SL", publisher: "Pearson Education Limited", isbn: "9780435193454", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-189", title: "Mathematics: Analysis and Approaches Standard Level Course Companion", author: "Paul La Rondie, Jill Stevens, Natasha Awada, Jennifer Chang Wathall, Ellen Thompson, Laurie Buchanan, Ed Kemp", subject: "Mathematics Analysis and Approaches SL", publisher: "Oxford University Press", isbn: "9780198427100", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-190", title: "Mathematics: Analysis and Approaches Higher Level Course Companion", author: "Marlene Torres Skoumal, Rose Harrison, Josip Harcet, Jennifer Chang Wathall, Lorraine Heinrichs", subject: "Mathematics Analysis and Approaches HL", publisher: "Oxford University Press", isbn: "9780198427162", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-191", title: "TI-84 Plus CE-T Graphing Display Calculator", author: "Texas Instruments", subject: "All Mathematics", publisher: "", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-192", title: "“Visual Arts” - Course Companion 2025 EDITION", author: "Nathaniel Katz, Jayson Paterson, Simon Poppy", subject: "Visual Arts", publisher: "Oxford Resources for IB - Diploma Programme", isbn: "9781382060660", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
  { id: "ndp2-193", title: "NO BOOK", subject: "TOK", publisher: "", availableFromPreviousYear: false, grade: "DP 2", program: "DP", schoolYear: "2026-2027" },
];

// Backwards-compatible alias
export const lastYearBooks = officialBooks;

// Empty summer reading list (none in 2025-2026 source file)
export const summerReadingBooks: OfficialBook[] = [];

// Mock listings placeholder (no live data without DB query)
export const mockListings: Record<string, BookListing[]> = {};

// ============================================================
// Sellable-item filter
// ============================================================
// The catalog mixes real textbooks with non-resellable items (PDFs,
// photocopies, downloads, sketchbook paper, "to be communicated"
// placeholders, calculators, etc.). Only real books are sellable, plus
// two explicit exceptions: Keyboard and Sphero (Mini) robot.
const ALLOWED_NON_BOOK = /\b(keyboard|tastiera|sphero)\b/i;

const EXCLUDED_PATTERNS: RegExp[] = [
  /^\s*pdf\b/i,
  /pdf\s+will\s+be\s+given/i,
  /libro\s+in\s+pdf/i,
  /pdf\s+da\s+stampare/i,
  /pdfs?\s+to\s+be\s+(downloaded|dowloaded|printed)/i,
  /^\s*no\s+book/i,
  /text\s*books?\s+will\s+be\s+chosen/i,
  /books?\s+for\s+english\s+depend/i,
  /books?\s+will\s+be\s+communicated/i,
  /to\s+be\s+communicated/i,
  /to\s+be\s+decided/i,
  /more\s+info\s+in\s+september/i,
  /depending\s+on\s+sections/i,
  /the\s+other\s+books\s+for\s+english/i,
  /un\s+libro\s+di\s+lettura\s+sar[àa]\s+comunicato/i,
  /l[''`]?acquisto\s+di\s+ulteriori/i,
  /l[''`]?insegnante\s+forni/i,
  /dispens[ea]/i,
  /quaderno/i,
  /canson/i,
  /graphing\s+calculator/i,
  /\bti[-\s]?84\b/i,
  /casio\s+fx/i,
  /worksheet/i,
  /photocop/i,
];

export function isSellableItem(book: OfficialBook): boolean {
  const title = book.title || "";
  if (ALLOWED_NON_BOOK.test(title)) return true;
  if (EXCLUDED_PATTERNS.some((re) => re.test(title))) return false;
  return true;
}

// ============================================================
// Selling helpers (last-year list only, for now)
// ============================================================
// Books from the user's PREVIOUS grade that are reusable somewhere in the
// 2026-2027 list AND not needed by the same student in their NEW grade →
// candidates to LIST for other families.
export function getSellableBooks(
  previousGrade: string,
  _previousProgram: string,
  newGrade?: string
): OfficialBook[] {
  const candidates = officialBooks
    .filter((b) => b.grade === previousGrade)
    .filter(isSellableItem);
  if (!NEW_SCHOOL_YEAR_AVAILABLE) return candidates;
  const keepIsbns = new Set(
    newGrade
      ? newYearBooks.filter((b) => b.grade === newGrade && b.isbn).map((b) => b.isbn!.replace(/[^0-9]/g, ""))
      : []
  );
  const reusableIsbns = new Set(
    newYearBooks.filter((b) => b.isbn).map((b) => b.isbn!.replace(/[^0-9]/g, ""))
  );
  return candidates.filter((b) => {
    const isbn = (b.isbn || "").replace(/[^0-9]/g, "");
    if (!isbn) return false; // avoid uncertain matches → not shown as reusable
    if (keepIsbns.has(isbn)) return false; // needed next year → keep
    return reusableIsbns.has(isbn);
  });
}

// Books from previous grade that the same student still needs in their NEW grade.
export function getBooksToKeep(
  previousGrade: string,
  _previousProgram: string,
  newGrade?: string
): OfficialBook[] {
  if (!NEW_SCHOOL_YEAR_AVAILABLE || !newGrade) return [];
  const newIsbns = new Set(
    newYearBooks.filter((b) => b.grade === newGrade && b.isbn).map((b) => b.isbn!.replace(/[^0-9]/g, ""))
  );
  return officialBooks
    .filter((b) => b.grade === previousGrade)
    .filter(isSellableItem)
    .filter((b) => {
      const isbn = (b.isbn || "").replace(/[^0-9]/g, "");
      return isbn && newIsbns.has(isbn);
    });
}

// For a reusable book, tell where it appears in the new year list (grade/subject).
export function getReuseTarget(book: OfficialBook): { grade: string; subject: string } | null {
  const isbn = (book.isbn || "").replace(/[^0-9]/g, "");
  if (!isbn) return null;
  const hit = newYearBooks.find((b) => (b.isbn || "").replace(/[^0-9]/g, "") === isbn);
  return hit ? { grade: hit.grade, subject: hit.subject } : null;
}

export function getPriceRange(_bookId: string): { min: number; max: number } | null {
  return null;
}

export function getAmazonListUrl(grade: string, _program: string): string {
  return `https://www.amazon.it/s?k=${encodeURIComponent(grade + " IB textbooks")}`;
}

export function getSubjectsForGrade(grade: string): string[] {
  return Array.from(
    new Set(
      officialBooks
        .filter((b) => b.grade === grade)
        .filter(isSellableItem)
        .map((b) => b.subject)
    )
  ).sort();
}

// ============================================================
// Cross-year matcher (used once the new list is uploaded).
// Primary match: ISBN. Secondary: normalized title+author when neither
// side has a valid ISBN. Different editions are intentionally NOT
// matched (different ISBNs => no match).
// ============================================================
export interface BookMatch {
  lastYear: OfficialBook;
  newYear: OfficialBook;
  matchedBy: "isbn" | "title-author";
}

const normalize = (s?: string) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const isValidIsbn = (isbn?: string) => {
  if (!isbn) return false;
  const digits = isbn.replace(/[^0-9]/g, "");
  return digits.length === 10 || digits.length === 13;
};

export function matchBooksAcrossYears(
  lastList: OfficialBook[] = officialBooks,
  newList: OfficialBook[] = newYearBooks
): BookMatch[] {
  const matches: BookMatch[] = [];
  const newByIsbn = new Map<string, OfficialBook>();
  for (const nb of newList) {
    if (isValidIsbn(nb.isbn)) newByIsbn.set(nb.isbn!.replace(/[^0-9]/g, ""), nb);
  }
  for (const lb of lastList) {
    if (isValidIsbn(lb.isbn)) {
      const hit = newByIsbn.get(lb.isbn!.replace(/[^0-9]/g, ""));
      if (hit) { matches.push({ lastYear: lb, newYear: hit, matchedBy: "isbn" }); continue; }
      continue; // ISBN present but no ISBN match → don't fuzzy match (avoid edition mix-ups)
    }
    const nt = normalize(lb.title);
    const na = normalize(lb.author);
    const hit = newList.find(
      (nb) => !isValidIsbn(nb.isbn) && normalize(nb.title) === nt && normalize(nb.author) === na
    );
    if (hit) matches.push({ lastYear: lb, newYear: hit, matchedBy: "title-author" });
  }
  return matches;
}

