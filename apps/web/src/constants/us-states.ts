export interface USStateOption {
  name: string;
  code: string;
  flag: string;
}

/**
 * States where Sniffles Health has licensed providers.
 * Update this list as new states are onboarded.
 */
export const SERVICED_STATES = new Set([
  "CA",
  "FL",
  "TX",
  "NY",
  "IL",
  "PA",
  "OH",
  "GA",
  "NC",
  "NJ",
]);

export const UNSUPPORTED_STATE_MESSAGE =
  "We currently do not support consultations in your selected state.";

export function isServicedState(code?: string | null) {
  console.log("Checking if state is serviced:", code);
  return code ? SERVICED_STATES.has(code) : false;
}

export const US_STATES: USStateOption[] = [
  { name: "Alabama", code: "AL", flag: "https://flagcdn.com/w40/us-al.png" },
  { name: "Alaska", code: "AK", flag: "https://flagcdn.com/w40/us-ak.png" },
  { name: "Arizona", code: "AZ", flag: "https://flagcdn.com/w40/us-az.png" },
  { name: "Arkansas", code: "AR", flag: "https://flagcdn.com/w40/us-ar.png" },
  { name: "California", code: "CA", flag: "https://flagcdn.com/w40/us-ca.png" },
  { name: "Colorado", code: "CO", flag: "https://flagcdn.com/w40/us-co.png" },
  {
    name: "Connecticut",
    code: "CT",
    flag: "https://flagcdn.com/w40/us-ct.png",
  },
  { name: "Delaware", code: "DE", flag: "https://flagcdn.com/w40/us-de.png" },
  { name: "Florida", code: "FL", flag: "https://flagcdn.com/w40/us-fl.png" },
  { name: "Georgia", code: "GA", flag: "https://flagcdn.com/w40/us-ga.png" },
  { name: "Hawaii", code: "HI", flag: "https://flagcdn.com/w40/us-hi.png" },
  { name: "Idaho", code: "ID", flag: "https://flagcdn.com/w40/us-id.png" },
  { name: "Illinois", code: "IL", flag: "https://flagcdn.com/w40/us-il.png" },
  { name: "Indiana", code: "IN", flag: "https://flagcdn.com/w40/us-in.png" },
  { name: "Iowa", code: "IA", flag: "https://flagcdn.com/w40/us-ia.png" },
  { name: "Kansas", code: "KS", flag: "https://flagcdn.com/w40/us-ks.png" },
  { name: "Kentucky", code: "KY", flag: "https://flagcdn.com/w40/us-ky.png" },
  { name: "Louisiana", code: "LA", flag: "https://flagcdn.com/w40/us-la.png" },
  { name: "Maine", code: "ME", flag: "https://flagcdn.com/w40/us-me.png" },
  { name: "Maryland", code: "MD", flag: "https://flagcdn.com/w40/us-md.png" },
  {
    name: "Massachusetts",
    code: "MA",
    flag: "https://flagcdn.com/w40/us-ma.png",
  },
  { name: "Michigan", code: "MI", flag: "https://flagcdn.com/w40/us-mi.png" },
  { name: "Minnesota", code: "MN", flag: "https://flagcdn.com/w40/us-mn.png" },
  {
    name: "Mississippi",
    code: "MS",
    flag: "https://flagcdn.com/w40/us-ms.png",
  },
  { name: "Missouri", code: "MO", flag: "https://flagcdn.com/w40/us-mo.png" },
  { name: "Montana", code: "MT", flag: "https://flagcdn.com/w40/us-mt.png" },
  { name: "Nebraska", code: "NE", flag: "https://flagcdn.com/w40/us-ne.png" },
  { name: "Nevada", code: "NV", flag: "https://flagcdn.com/w40/us-nv.png" },
  {
    name: "New Hampshire",
    code: "NH",
    flag: "https://flagcdn.com/w40/us-nh.png",
  },
  { name: "New Jersey", code: "NJ", flag: "https://flagcdn.com/w40/us-nj.png" },
  { name: "New Mexico", code: "NM", flag: "https://flagcdn.com/w40/us-nm.png" },
  { name: "New York", code: "NY", flag: "https://flagcdn.com/w40/us-ny.png" },
  {
    name: "North Carolina",
    code: "NC",
    flag: "https://flagcdn.com/w40/us-nc.png",
  },
  {
    name: "North Dakota",
    code: "ND",
    flag: "https://flagcdn.com/w40/us-nd.png",
  },
  { name: "Ohio", code: "OH", flag: "https://flagcdn.com/w40/us-oh.png" },
  { name: "Oklahoma", code: "OK", flag: "https://flagcdn.com/w40/us-ok.png" },
  { name: "Oregon", code: "OR", flag: "https://flagcdn.com/w40/us-or.png" },
  {
    name: "Pennsylvania",
    code: "PA",
    flag: "https://flagcdn.com/w40/us-pa.png",
  },
  {
    name: "Rhode Island",
    code: "RI",
    flag: "https://flagcdn.com/w40/us-ri.png",
  },
  {
    name: "South Carolina",
    code: "SC",
    flag: "https://flagcdn.com/w40/us-sc.png",
  },
  {
    name: "South Dakota",
    code: "SD",
    flag: "https://flagcdn.com/w40/us-sd.png",
  },
  { name: "Tennessee", code: "TN", flag: "https://flagcdn.com/w40/us-tn.png" },
  { name: "Texas", code: "TX", flag: "https://flagcdn.com/w40/us-tx.png" },
  { name: "Utah", code: "UT", flag: "https://flagcdn.com/w40/us-ut.png" },
  { name: "Vermont", code: "VT", flag: "https://flagcdn.com/w40/us-vt.png" },
  { name: "Virginia", code: "VA", flag: "https://flagcdn.com/w40/us-va.png" },
  { name: "Washington", code: "WA", flag: "https://flagcdn.com/w40/us-wa.png" },
  {
    name: "West Virginia",
    code: "WV",
    flag: "https://flagcdn.com/w40/us-wv.png",
  },
  { name: "Wisconsin", code: "WI", flag: "https://flagcdn.com/w40/us-wi.png" },
  { name: "Wyoming", code: "WY", flag: "https://flagcdn.com/w40/us-wy.png" },
  {
    name: "Washington D.C.",
    code: "DC",
    flag: "https://flagcdn.com/w40/us-dc.png",
  },
  { name: "Puerto Rico", code: "PR", flag: "https://flagcdn.com/w40/pr.png" },
];
