export interface OfficialBook {
  id: string;
  title: string;
  subject: string;
  publisher: string;
  isbn?: string;
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
  sellerRating: number;
  sellerName: string;
  sellerCompletedExchanges: number;
}

// School Year 2025-2026 Official Book List
export const officialBooks: OfficialBook[] = [
  // PYP 1
  { id: "pyp1-1", title: "Mathematics - Primary 1", subject: "Mathematics", publisher: "Cambridge", isbn: "978-1-108-74621-0", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108746210", grade: "PYP 1", program: "PYP" },
  { id: "pyp1-2", title: "English Language Arts - Grade 1", subject: "English", publisher: "Oxford", isbn: "978-0-19-836472-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198364721", grade: "PYP 1", program: "PYP" },
  { id: "pyp1-3", title: "Science Discovery - Level 1", subject: "Science", publisher: "Pearson", isbn: "978-0-13-469852-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0134698523", grade: "PYP 1", program: "PYP" },
  { id: "pyp1-4", title: "Amici Italiani 1", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-6845-2", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.it/dp/8820168452", grade: "PYP 1", program: "PYP" },
  { id: "pyp1-5", title: "Art Adventures - Primary", subject: "Art", publisher: "McGraw Hill", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0078962501", grade: "PYP 1", program: "PYP" },

  // PYP 2
  { id: "pyp2-1", title: "Mathematics - Primary 2", subject: "Mathematics", publisher: "Cambridge", isbn: "978-1-108-74622-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108746227", grade: "PYP 2", program: "PYP" },
  { id: "pyp2-2", title: "English Language Arts - Grade 2", subject: "English", publisher: "Oxford", isbn: "978-0-19-836473-8", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198364738", grade: "PYP 2", program: "PYP" },
  { id: "pyp2-3", title: "Science Discovery - Level 2", subject: "Science", publisher: "Pearson", isbn: "978-0-13-469853-0", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0134698530", grade: "PYP 2", program: "PYP" },
  { id: "pyp2-4", title: "Amici Italiani 2", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-6846-9", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.it/dp/8820168469", grade: "PYP 2", program: "PYP" },
  { id: "pyp2-5", title: "Music Makers - Level 2", subject: "Music", publisher: "ABRSM", isbn: "978-1-84849-215-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1848492154", grade: "PYP 2", program: "PYP" },

  // PYP 3
  { id: "pyp3-1", title: "Mathematics - Primary 3", subject: "Mathematics", publisher: "Cambridge", isbn: "978-1-108-74623-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108746234", grade: "PYP 3", program: "PYP" },
  { id: "pyp3-2", title: "English Language Arts - Grade 3", subject: "English", publisher: "Oxford", isbn: "978-0-19-836474-5", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198364745", grade: "PYP 3", program: "PYP" },
  { id: "pyp3-3", title: "Science Discovery - Level 3", subject: "Science", publisher: "Pearson", isbn: "978-0-13-469854-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0134698547", grade: "PYP 3", program: "PYP" },
  { id: "pyp3-4", title: "Amici Italiani 3", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-6847-6", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820168476", grade: "PYP 3", program: "PYP" },
  { id: "pyp3-5", title: "Geography Explorer 3", subject: "Geography", publisher: "Collins", isbn: "978-0-00-827456-2", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0008274562", grade: "PYP 3", program: "PYP" },

  // PYP 4
  { id: "pyp4-1", title: "Mathematics - Primary 4", subject: "Mathematics", publisher: "Cambridge", isbn: "978-1-108-74624-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108746241", grade: "PYP 4", program: "PYP" },
  { id: "pyp4-2", title: "English Language Arts - Grade 4", subject: "English", publisher: "Oxford", isbn: "978-0-19-836475-2", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198364752", grade: "PYP 4", program: "PYP" },
  { id: "pyp4-3", title: "Science Discovery - Level 4", subject: "Science", publisher: "Pearson", isbn: "978-0-13-469855-4", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/dp/0134698554", grade: "PYP 4", program: "PYP" },
  { id: "pyp4-4", title: "Italiano per Crescere 4", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-6848-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820168483", grade: "PYP 4", program: "PYP" },
  { id: "pyp4-5", title: "History Through Time 4", subject: "History", publisher: "Hodder", isbn: "978-1-47185-621-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471856217", grade: "PYP 4", program: "PYP" },

  // PYP 5
  { id: "pyp5-1", title: "Mathematics - Primary 5", subject: "Mathematics", publisher: "Cambridge", isbn: "978-1-108-74625-8", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108746258", grade: "PYP 5", program: "PYP" },
  { id: "pyp5-2", title: "English Language Arts - Grade 5", subject: "English", publisher: "Oxford", isbn: "978-0-19-836476-9", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198364769", grade: "PYP 5", program: "PYP" },
  { id: "pyp5-3", title: "Science Discovery - Level 5", subject: "Science", publisher: "Pearson", isbn: "978-0-13-469856-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0134698561", grade: "PYP 5", program: "PYP" },
  { id: "pyp5-4", title: "Italiano per Crescere 5", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-6849-0", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.it/dp/8820168490", grade: "PYP 5", program: "PYP" },
  { id: "pyp5-5", title: "World Cultures 5", subject: "Social Studies", publisher: "Pearson", isbn: "978-0-13-445612-8", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0134456128", grade: "PYP 5", program: "PYP" },

  // MYP 1
  { id: "myp1-1", title: "MYP Mathematics 1", subject: "Mathematics", publisher: "Hodder", isbn: "978-1-47185-701-6", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471857016", grade: "MYP 1", program: "MYP" },
  { id: "myp1-2", title: "MYP English Language & Literature 1", subject: "English", publisher: "Cambridge", isbn: "978-1-108-72654-0", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108726540", grade: "MYP 1", program: "MYP" },
  { id: "myp1-3", title: "MYP Sciences 1", subject: "Science", publisher: "Pearson", isbn: "978-0-13-598741-2", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0135987412", grade: "MYP 1", program: "MYP" },
  { id: "myp1-4", title: "Nuovo Contatto A1", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-7012-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820170127", grade: "MYP 1", program: "MYP" },
  { id: "myp1-5", title: "MYP Individuals & Societies 1", subject: "Humanities", publisher: "Oxford", isbn: "978-0-19-839561-9", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/dp/0198395619", grade: "MYP 1", program: "MYP" },
  { id: "myp1-6", title: "MYP Design 1", subject: "Design", publisher: "Hodder", isbn: "978-1-47185-721-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471857214", grade: "MYP 1", program: "MYP" },

  // MYP 2
  { id: "myp2-1", title: "MYP Mathematics 2", subject: "Mathematics", publisher: "Hodder", isbn: "978-1-47185-702-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471857023", grade: "MYP 2", program: "MYP" },
  { id: "myp2-2", title: "MYP English Language & Literature 2", subject: "English", publisher: "Cambridge", isbn: "978-1-108-72655-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108726557", grade: "MYP 2", program: "MYP" },
  { id: "myp2-3", title: "MYP Sciences 2", subject: "Science", publisher: "Pearson", isbn: "978-0-13-598742-9", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0135987429", grade: "MYP 2", program: "MYP" },
  { id: "myp2-4", title: "Nuovo Contatto A2", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-7013-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820170134", grade: "MYP 2", program: "MYP" },
  { id: "myp2-5", title: "MYP Individuals & Societies 2", subject: "Humanities", publisher: "Oxford", isbn: "978-0-19-839562-6", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198395626", grade: "MYP 2", program: "MYP" },

  // MYP 3
  { id: "myp3-1", title: "MYP Mathematics 3", subject: "Mathematics", publisher: "Hodder", isbn: "978-1-47185-703-0", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471857030", grade: "MYP 3", program: "MYP" },
  { id: "myp3-2", title: "MYP English Language & Literature 3", subject: "English", publisher: "Cambridge", isbn: "978-1-108-72656-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108726564", grade: "MYP 3", program: "MYP" },
  { id: "myp3-3", title: "MYP Biology 3", subject: "Biology", publisher: "Pearson", isbn: "978-0-13-598743-6", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0135987436", grade: "MYP 3", program: "MYP" },
  { id: "myp3-4", title: "MYP Chemistry 3", subject: "Chemistry", publisher: "Pearson", isbn: "978-0-13-598753-5", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/dp/0135987535", grade: "MYP 3", program: "MYP" },
  { id: "myp3-5", title: "Nuovo Contatto B1", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-7014-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820170141", grade: "MYP 3", program: "MYP" },

  // MYP 4
  { id: "myp4-1", title: "MYP Mathematics 4&5 Standard", subject: "Mathematics", publisher: "Hodder", isbn: "978-1-47185-704-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471857047", grade: "MYP 4", program: "MYP" },
  { id: "myp4-2", title: "MYP English Language & Literature 4&5", subject: "English", publisher: "Cambridge", isbn: "978-1-108-72657-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108726571", grade: "MYP 4", program: "MYP" },
  { id: "myp4-3", title: "MYP Physics 4&5", subject: "Physics", publisher: "Pearson", isbn: "978-0-13-598763-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0135987634", grade: "MYP 4", program: "MYP" },
  { id: "myp4-4", title: "MYP Biology 4&5", subject: "Biology", publisher: "Pearson", isbn: "978-0-13-598744-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0135987443", grade: "MYP 4", program: "MYP" },
  { id: "myp4-5", title: "Nuovo Contatto B2", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-7015-8", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820170158", grade: "MYP 4", program: "MYP" },

  // MYP 5
  { id: "myp5-1", title: "MYP Mathematics 4&5 Extended", subject: "Mathematics", publisher: "Hodder", isbn: "978-1-47185-705-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1471857054", grade: "MYP 5", program: "MYP" },
  { id: "myp5-2", title: "MYP English Language & Literature 4&5", subject: "English", publisher: "Cambridge", isbn: "978-1-108-72657-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108726571", grade: "MYP 5", program: "MYP" },
  { id: "myp5-3", title: "MYP Chemistry 4&5", subject: "Chemistry", publisher: "Pearson", isbn: "978-0-13-598754-2", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0135987542", grade: "MYP 5", program: "MYP" },
  { id: "myp5-4", title: "MYP Global Politics", subject: "Politics", publisher: "Oxford", isbn: "978-0-19-839570-1", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/dp/0198395701", grade: "MYP 5", program: "MYP" },
  { id: "myp5-5", title: "Nuovo Contatto C1", subject: "Italian", publisher: "Loescher", isbn: "978-88-201-7016-5", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.it/dp/8820170165", grade: "MYP 5", program: "MYP" },

  // DP 1
  { id: "dp1-1", title: "IB Mathematics: Analysis & Approaches HL", subject: "Mathematics", publisher: "Oxford", isbn: "978-0-19-842711-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198427111", grade: "DP 1", program: "DP" },
  { id: "dp1-2", title: "IB English A: Language & Literature", subject: "English", publisher: "Cambridge", isbn: "978-1-108-70494-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108704944", grade: "DP 1", program: "DP" },
  { id: "dp1-3", title: "IB Physics Course Book", subject: "Physics", publisher: "Oxford", isbn: "978-0-19-839210-6", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198392106", grade: "DP 1", program: "DP" },
  { id: "dp1-4", title: "IB Chemistry Course Book", subject: "Chemistry", publisher: "Oxford", isbn: "978-0-19-839213-7", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198392137", grade: "DP 1", program: "DP" },
  { id: "dp1-5", title: "IB Biology Course Book", subject: "Biology", publisher: "Oxford", isbn: "978-0-19-839215-1", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/dp/0198392151", grade: "DP 1", program: "DP" },
  { id: "dp1-6", title: "IB Italian B", subject: "Italian", publisher: "Cambridge", isbn: "978-1-108-44062-5", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108440625", grade: "DP 1", program: "DP" },

  // DP 2
  { id: "dp2-1", title: "IB Mathematics: Analysis & Approaches HL", subject: "Mathematics", publisher: "Oxford", isbn: "978-0-19-842711-1", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198427111", grade: "DP 2", program: "DP" },
  { id: "dp2-2", title: "IB English A: Language & Literature", subject: "English", publisher: "Cambridge", isbn: "978-1-108-70494-4", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/1108704944", grade: "DP 2", program: "DP" },
  { id: "dp2-3", title: "IB History Course Book", subject: "History", publisher: "Oxford", isbn: "978-0-19-839240-3", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198392403", grade: "DP 2", program: "DP" },
  { id: "dp2-4", title: "IB Economics Course Book", subject: "Economics", publisher: "Oxford", isbn: "978-0-19-842718-0", availableFromPreviousYear: true, externalPurchaseUrl: "https://amazon.com/dp/0198427180", grade: "DP 2", program: "DP" },
  { id: "dp2-5", title: "IB TOK Course Book", subject: "TOK", publisher: "Oxford", isbn: "978-0-19-849782-4", availableFromPreviousYear: false, externalPurchaseUrl: "https://amazon.com/dp/0198497824", grade: "DP 2", program: "DP" },
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

// Mock listings data
export const mockListings: Record<string, BookListing[]> = {
  "pyp1-1": [
    { id: "l1", type: "sale", price: 15, condition: "asNew", sellerRating: 4.8, sellerName: "Maria R.", sellerCompletedExchanges: 12 },
    { id: "l2", type: "sale", price: 12, condition: "used", sellerRating: 4.5, sellerName: "Giovanni P.", sellerCompletedExchanges: 8 },
  ],
  "pyp1-2": [
    { id: "l3", type: "donation", condition: "used", sellerRating: 5.0, sellerName: "Laura B.", sellerCompletedExchanges: 15 },
  ],
  "pyp1-3": [
    { id: "l4", type: "exchange", condition: "asNew", sellerRating: 4.2, sellerName: "Marco T.", sellerCompletedExchanges: 5 },
  ],
  "pyp2-1": [
    { id: "l5", type: "sale", price: 18, condition: "new", sellerRating: 4.9, sellerName: "Sofia L.", sellerCompletedExchanges: 20 },
  ],
  "pyp3-2": [
    { id: "l6", type: "sale", price: 10, condition: "used", sellerRating: 4.0, sellerName: "Andrea M.", sellerCompletedExchanges: 3 },
    { id: "l7", type: "donation", condition: "used", sellerRating: 4.7, sellerName: "Elena F.", sellerCompletedExchanges: 9 },
  ],
  "myp1-1": [
    { id: "l8", type: "sale", price: 25, condition: "asNew", sellerRating: 4.6, sellerName: "Roberto C.", sellerCompletedExchanges: 7 },
  ],
  "myp2-2": [
    { id: "l9", type: "exchange", condition: "used", sellerRating: 4.3, sellerName: "Giulia V.", sellerCompletedExchanges: 4 },
  ],
  "dp1-1": [
    { id: "l10", type: "sale", price: 35, condition: "asNew", sellerRating: 5.0, sellerName: "Alessandro B.", sellerCompletedExchanges: 18 },
    { id: "l11", type: "sale", price: 30, condition: "used", sellerRating: 4.4, sellerName: "Chiara N.", sellerCompletedExchanges: 6 },
  ],
  "sr-pyp-1": [
    { id: "l12", type: "donation", condition: "used", sellerRating: 4.8, sellerName: "Francesca D.", sellerCompletedExchanges: 11 },
  ],
  "sr-myp-3": [
    { id: "l13", type: "sale", price: 8, condition: "used", sellerRating: 4.1, sellerName: "Luca P.", sellerCompletedExchanges: 2 },
  ],
};

// Helper to get Amazon list URL for a grade
export const getAmazonListUrl = (grade: string): string => {
  // In a real app, this would return actual Amazon affiliate list URLs
  return `https://amazon.com/hz/wishlist/school-books-${grade.toLowerCase().replace(' ', '-')}`;
};
