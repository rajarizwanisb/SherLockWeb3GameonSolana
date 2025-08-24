export interface DetectiveCase {
  id: string;
  title: string;
  difficulty: 'Novice' | 'Intermediate' | 'Expert' | 'Master';
  description: string;
  story: string[];
  clues: string[];
  solution: string;
  reward: number;
  mint_address: string;
  is_owned: boolean;
  is_solved: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category?: string;
  is_user_created?: boolean;
}

export const DEMO_CASES: DetectiveCase[] = [
  {
    id: 'case_001',
    title: 'The Missing Antique Clock',
    difficulty: 'Novice',
    description: 'A valuable antique clock has vanished from a locked study. The only clues are a broken window latch and muddy footprints.',
    story: [
      'You arrive at the Victorian mansion to investigate the theft of a 200-year-old grandfather clock.',
      'The study door was locked, but the window latch appears to have been tampered with from the inside.',
      'The homeowner, Mrs. Whitmore, insists only three people had access: her nephew, the gardener, and the cleaning lady.',
      'Fresh mud tracks lead from the garden to the study window, but it rained heavily last night.',
    ],
    clues: [
      'The window latch was broken from the inside, not outside',
      'Muddy footprints match the gardener\'s boots, but he has an alibi',
      'The nephew has gambling debts and knew about the clock\'s value',
      'The cleaning lady noticed the nephew was in the study yesterday evening',
      'The clock\'s key was missing from Mrs. Whitmore\'s desk drawer',
    ],
    solution: 'The nephew stole the clock. He broke the latch from inside to make it look like an outside job, then used the gardener\'s boots to create false tracks. He had access to the key and knew the clock\'s value.',
    reward: 0.5,
    mint_address: 'So1ana1Case001NFT1Address123',
    is_owned: true,
    is_solved: false,
    rarity: 'Common',
    category: 'Traditional'
  },
  {
    id: 'case_002',
    title: 'The Phantom NFT Heist',
    difficulty: 'Expert',
    description: 'A rare CryptoPunk NFT worth 500 SOL disappeared from a secured wallet. The owner claims their private key was never compromised.',
    story: [
      'A prominent crypto collector contacts you about their stolen CryptoPunk #1337.',
      'The NFT was transferred out of their hardware wallet without their knowledge.',
      'The transaction occurred at 3:47 AM when the owner was asleep.',
      'The receiving wallet has no transaction history and was created just minutes before the theft.',
    ],
    clues: [
      'The victim used the same password for multiple crypto services',
      'Their computer shows signs of clipboard malware',
      'A phishing email about "wallet security updates" was received 3 days ago',
      'The victim\'s social media shows them at a crypto conference last week',
      'Screenshots of the NFT were posted on Twitter with metadata intact',
    ],
    solution: 'The victim fell for a social engineering attack at the crypto conference. A fake "security researcher" scanned their QR code wallet address and later used a clipboard malware to replace addresses during transactions.',
    reward: 2.5,
    mint_address: 'So1ana1Case002NFT1Address456',
    is_owned: false,
    is_solved: false,
    rarity: 'Epic',
    category: 'Crypto'
  },
  {
    id: 'case_003',
    title: 'The Corporate Data Breach',
    difficulty: 'Intermediate',
    description: 'Sensitive client data was leaked from a tech company. The breach appears to have come from inside the organization.',
    story: [
      'TechCorp Industries has suffered a data breach affecting 10,000 customer records.',
      'The data was leaked to a competitor, giving them an unfair advantage.',
      'All evidence points to an inside job, but the IT department found no unauthorized access.',
      'Three employees had access to the customer database: the CTO, lead developer, and database administrator.',
    ],
    clues: [
      'The leaked data was exported during normal business hours',
      'The CTO recently sold a large amount of company stock',
      'The lead developer was passed over for a promotion last month',
      'The database admin has been working remotely and has financial troubles',
      'Unusual database queries were made from the CTO\'s computer',
      'The CTO\'s computer was left unlocked during a meeting yesterday',
    ],
    solution: 'The lead developer accessed the database from the CTO\'s unlocked computer while they were in a meeting. They were motivated by being passed over for promotion and wanted to damage the company.',
    reward: 1.5,
    mint_address: 'So1ana1Case003NFT1Address789',
    is_owned: true,
    is_solved: true,
    rarity: 'Rare',
    category: 'Corporate'
  },
  {
    id: 'case_004',
    title: 'The Ransomware Mystery',
    difficulty: 'Expert',
    description: 'A hospital\'s entire network was encrypted by ransomware, but no ransom note was left. This isn\'t about money.',
    story: [
      'City General Hospital\'s systems were completely encrypted overnight.',
      'Strangely, no ransom note was found anywhere in the system.',
      'Patient care was severely impacted, but no patient data appears to have been stolen.',
      'The IT team noticed the attack started from a single workstation in the radiology department.',
    ],
    clues: [
      'The ransomware used a custom encryption not seen before',
      'A disgruntled former IT employee was fired 2 weeks ago for security violations',
      'The radiology department recently installed new medical imaging software',
      'The attack coincided with the hospital\'s annual board meeting',
      'Security cameras show the fired employee\'s car in the parking lot the night before',
      'The new imaging software came from a company owned by the former employee\'s brother',
    ],
    solution: 'The former IT employee planted malware in the imaging software through his brother\'s company. This was revenge for being fired, not a money-motivated attack.',
    reward: 3.0,
    mint_address: 'So1ana1Case004NFT1Address101112',
    is_owned: false,
    is_solved: false,
    rarity: 'Legendary',
    category: 'Cyber'
  },
  {
    id: 'case_005',
    title: 'The Social Media Stalker',
    difficulty: 'Intermediate',
    description: 'A celebrity is being stalked by someone who knows their every move, despite having high security. The stalker must be getting inside information.',
    story: [
      'Pop star Luna Martinez is being stalked by someone who shows up everywhere she goes.',
      'Her security team has found no breaches in their protocols.',
      'The stalker knows details about Luna\'s private schedule that only her inner circle should know.',
      'Recent incidents include the stalker appearing at a private restaurant reservation and at her gym.',
    ],
    clues: [
      'Luna\'s assistant recently started dating someone new',
      'The stalker\'s letters reference specific conversations Luna had with her manager',
      'Luna\'s Instagram location data is turned off, but someone is tracking her movements',
      'The assistant\'s new boyfriend works for a private investigation firm',
      'Luna\'s manager has been acting nervous and avoiding eye contact',
      'Financial records show the manager has gambling debts to dangerous people',
    ],
    solution: 'The manager is being blackmailed by loan sharks and forced to provide Luna\'s schedule information. The stalker is actually working for the people the manager owes money to.',
    reward: 1.2,
    mint_address: 'So1ana1Case005NFT1Address131415',
    is_owned: true,
    is_solved: false,
    rarity: 'Rare',
    category: 'Social'
  },
  {
    id: 'case_006',
    title: 'The DeFi Protocol Hack',
    difficulty: 'Master',
    description: 'A decentralized finance protocol lost $50M in a sophisticated attack. The code was audited and the attack vector is unclear.',
    story: [
      'YieldFarm Protocol suffered a massive exploit draining 50 million dollars.',
      'The smart contract code was audited by three different firms.',
      'The attack used a complex series of flash loans and arbitrage opportunities.',
      'The exploiter\'s wallet was funded through multiple privacy coins.',
    ],
    clues: [
      'The attack occurred exactly 24 hours after a protocol upgrade',
      'One of the auditing firms has a developer who recently quit',
      'The exploiter had intimate knowledge of the protocol\'s internal mechanics',
      'Social media shows the quit developer making cryptic posts about "revenge"',
      'The attack used an undocumented feature in the smart contract',
      'The exploiter\'s funds were mixed through a tornado cash-like service',
    ],
    solution: 'The former auditing firm developer left a backdoor in the smart contract code during the audit. They waited until after the upgrade to exploit it, using their insider knowledge.',
    reward: 5.0,
    mint_address: 'So1ana1Case006NFT1Address161718',
    is_owned: false,
    is_solved: false,
    rarity: 'Legendary',
    category: 'Crypto'
  },
  {
    id: 'case_007',
    title: 'The Locked Room Murder',
    difficulty: 'Expert',
    description: 'A wealthy businessman was found dead in his locked study. No weapon was found and no one could have entered or left.',
    story: [
      'Millionaire Richard Blackwood was found dead in his private study.',
      'The room was locked from the inside with no other entrances.',
      'The windows are barred and there\'s no fireplace or ventilation large enough for a person.',
      'The victim appears to have been poisoned, but no poison was found in the room.',
    ],
    clues: [
      'The victim was diabetic and injected insulin daily',
      'His insulin pen was found on the desk, recently used',
      'The housekeeper prepared his afternoon tea as usual',
      'A family member has been managing his medications',
      'The victim had recently changed his will, cutting out his nephew',
      'The nephew is a chemistry student with access to laboratory equipment',
    ],
    solution: 'The nephew replaced the insulin in the victim\'s pen with a lethal injection. The victim unknowingly administered the poison himself, creating the "locked room" mystery.',
    reward: 2.8,
    mint_address: 'So1ana1Case007NFT1Address192021',
    is_owned: true,
    is_solved: false,
    rarity: 'Epic',
    category: 'Traditional'
  },
  {
    id: 'case_008',
    title: 'The Insider Trading Algorithm',
    difficulty: 'Expert',
    description: 'A trading algorithm is making impossible predictions about stock movements. Someone is feeding it insider information.',
    story: [
      'HedgeFund Pro\'s AI trading algorithm has a 95% success rate on pharmaceutical stocks.',
      'The algorithm somehow predicts FDA drug approvals before they\'re announced.',
      'Regulatory investigators can find no obvious insider trading violations.',
      'The fund\'s returns are attracting unwanted SEC attention.',
    ],
    clues: [
      'The algorithm developer\'s sister works at the FDA',
      'The developer recently bought a $2 million house despite a modest salary',
      'The sister has been accessing files outside her normal responsibilities',
      'Encrypted messages were found on the developer\'s personal phone',
      'The algorithm\'s predictions correlate with the sister\'s file access times',
      'Both siblings have been seen meeting at a coffee shop regularly',
    ],
    solution: 'The algorithm developer is receiving insider information from his sister at the FDA. She accesses approval documents early and passes the information through encrypted channels.',
    reward: 2.2,
    mint_address: 'So1ana1Case008NFT1Address222324',
    is_owned: false,
    is_solved: false,
    rarity: 'Epic',
    category: 'Corporate'
  },
  {
    id: 'case_009',
    title: 'The Deepfake Blackmail',
    difficulty: 'Intermediate',
    description: 'A politician is being blackmailed with compromising videos that they swear are fake. The videos look completely real.',
    story: [
      'Senator Williams is being blackmailed with videos showing illegal activity.',
      'The senator insists the videos are deepfakes, but they appear authentic.',
      'The blackmailer wants the senator to vote against cybersecurity legislation.',
      'The videos were sent from an anonymous email account through multiple proxies.',
    ],
    clues: [
      'The videos show the senator in locations they\'ve never visited',
      'A tech company opposing the cybersecurity bill has deepfake technology',
      'The senator\'s campaign manager has financial ties to the tech company',
      'The videos contain subtle artifacts consistent with AI generation',
      'The campaign manager recently accessed the senator\'s photo archives',
      'The tech company\'s CEO made public statements against the legislation',
    ],
    solution: 'The campaign manager is working with the tech company to create deepfake videos and blackmail the senator into opposing legislation that would hurt the company\'s business.',
    reward: 1.8,
    mint_address: 'So1ana1Case009NFT1Address252627',
    is_owned: true,
    is_solved: false,
    rarity: 'Rare',
    category: 'Cyber'
  },
  {
    id: 'case_010',
    title: 'The Influencer Conspiracy',
    difficulty: 'Novice',
    description: 'A popular influencer\'s engagement suddenly skyrocketed, but their authentic followers are complaining about spam comments and fake interactions.',
    story: [
      'Fashion influencer @StyleQueen suddenly gained 100K followers in one week.',
      'Her engagement rates are now suspiciously high, but comments seem artificial.',
      'Real followers are complaining about the drop in content quality.',
      'Her recent brand deals are worth significantly more due to inflated metrics.',
    ],
    clues: [
      'The new followers have generic usernames and no profile pictures',
      'Comments are repetitive and use similar language patterns',
      'The influencer\'s manager recently hired a new social media agency',
      'The agency specializes in "rapid growth solutions"',
      'Bank records show payments to a company known for selling fake followers',
      'The influencer seems unaware of the artificial boost',
    ],
    solution: 'The manager hired a disreputable agency that used bot farms to inflate the influencer\'s metrics without her knowledge, hoping to secure better brand deals.',
    reward: 0.8,
    mint_address: 'So1ana1Case010NFT1Address282930',
    is_owned: true,
    is_solved: false,
    rarity: 'Common',
    category: 'Social'
  }
];