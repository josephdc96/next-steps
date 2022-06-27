export enum Gender {
  male,
  female,
}

export enum Reasons {
  firstTime,
  followJesus,
  baptism,
  membership,
  discipleship,
  serve,
  joinGroup,
}

export interface NextStepsCard {
  name: string;
  gender: Gender;
  dob: Date;
  phoneNum: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  reasons: Reasons[];
  prayerRequests?: string;
  confidential: boolean;
  whoHelped?: string;
  otherHelp?: string;
  date: Date;
  completed: boolean;
  id?: string;
}

export const GENDER_DISPLAY_RECORD: Record<Gender, string> = {
  [Gender.male]: 'Male',
  [Gender.female]: 'Female',
};

export const REASON_DISPLAY_RECORD: Record<Reasons, string> = {
  [Reasons.firstTime]: 'First Time Here!',
  [Reasons.followJesus]: 'I Want to Follow Jesus',
  [Reasons.baptism]: 'Be Baptized',
  [Reasons.membership]: 'Become a Church Member',
  [Reasons.discipleship]: 'Be Mentored (D1)',
  [Reasons.serve]: 'Serve (Leadership Training)',
  [Reasons.joinGroup]: 'Join Group (Group Connect)',
};

export const REASON_TRANSLATOR: Record<string, Reasons> = {
  firstTime: Reasons.firstTime,
  followJesus: Reasons.followJesus,
  baptism: Reasons.baptism,
  membership: Reasons.membership,
  discipleship: Reasons.discipleship,
  serve: Reasons.serve,
  joinGroup: Reasons.joinGroup,
};

export const States: { label: string; value: string }[] = [
  { label: 'Missouri', value: 'MO' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Guam', value: 'GU' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virgin Islands', value: 'VI' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

export interface FilterValues {
  boxes: string[];
  hosts: string[];
  startDate: Date;
  endDate: Date;
  completed: boolean;
}
