/* =====================================================================
   26/11 Mumbai Memorial — data
   Sources (checked Nov 2026):
   - Maharashtra Police, "List of Martyrs of Maharashtra Police 1964–2021"
     (names, ranks, units)
   - Bombay High Court, State of Maharashtra v. Mohammed Ajmal Amir Kasab,
     Confirmation Case No. 2 of 2010, Table 2 (where each person fell)
   - Gallantry awards announced 26 Jan 2009 (Ashok Chakra / Kirti Chakra)
   - Wikipedia, "2008 Mumbai attacks" (timeline, site tolls)
   Per-site tolls differ between official and press sources; the most
   commonly cited figures are used here.
   ===================================================================== */

const SITES = [
  {
    id: "cst",
    name: "Chhatrapati Shivaji Terminus",
    short: "CST Station",
    lat: 18.9398, lng: 72.8355,
    time: "26 Nov, ~21:30",
    toll: "58",
    note: "Two gunmen opened fire on passengers in the main hall of India's busiest railway station."
  },
  {
    id: "leopold",
    name: "Leopold Cafe, Colaba",
    short: "Leopold Cafe",
    lat: 18.9227, lng: 72.8317,
    time: "26 Nov, ~21:40",
    toll: "10",
    note: "Gunmen fired into the crowded cafe before walking on towards the Taj."
  },
  {
    id: "taj",
    name: "Taj Mahal Palace Hotel",
    short: "Taj Hotel",
    lat: 18.9217, lng: 72.8332,
    time: "26 Nov, ~21:45 – 29 Nov, 08:00",
    toll: "31",
    note: "A siege of nearly 60 hours. The heritage dome burned through the night of 26 November."
  },
  {
    id: "oberoi",
    name: "Oberoi–Trident Hotel, Nariman Point",
    short: "Oberoi–Trident",
    lat: 18.9268, lng: 72.8205,
    time: "26 Nov, ~22:00 – 28 Nov, 15:00",
    toll: "30",
    note: "Guests and staff were held hostage until NSG commandos cleared the hotel."
  },
  {
    id: "nariman",
    name: "Nariman House (Chabad House), Colaba",
    short: "Nariman House",
    lat: 18.9165, lng: 72.8270,
    time: "26 Nov, ~21:20 – 28 Nov, 17:00",
    toll: "7",
    note: "A Jewish outreach centre. NSG commandos were heli-dropped onto the roof."
  },
  {
    id: "cama-in",
    name: "Cama & Albless Hospital (inside)",
    short: "Cama Hospital",
    lat: 18.9426, lng: 72.8328,
    time: "26 Nov, after 22:00",
    toll: "7",
    note: "Nurses and staff locked wards and moved patients, including pregnant women, to safety."
  },
  {
    id: "cama-out",
    name: "Rang Bhavan Lane, outside Cama Hospital",
    short: "Rang Bhavan Lane",
    lat: 18.9441, lng: 72.8318,
    time: "26 Nov, late night",
    toll: "9",
    note: "The police vehicle carrying the ATS chief and his team was ambushed in this lane."
  },
  {
    id: "chowpatty",
    name: "Vinoli Chowpatty, Girgaum",
    short: "Girgaum Chowpatty",
    lat: 18.9545, lng: 72.8130,
    time: "27 Nov, ~01:00",
    toll: "1",
    note: "Police stopped the hijacked car at a roadblock. One gunman was killed; the other was captured alive."
  },
  {
    id: "wadibunder",
    name: "Taxi blast, Wadi Bunder (Mazgaon)",
    short: "Wadi Bunder",
    lat: 18.9600, lng: 72.8410,
    time: "26 Nov, ~22:20",
    toll: "3",
    note: "A bomb left in a taxi exploded."
  },
  {
    id: "vileparle",
    name: "Taxi blast, Vile Parle",
    short: "Vile Parle",
    lat: 19.0990, lng: 72.8440,
    time: "26 Nov, ~22:40",
    toll: "2",
    note: "A second taxi bomb exploded near the airport."
  },
  {
    id: "landing",
    name: "Landing point, Badhwar Park / Machimar Nagar",
    short: "Landing point",
    lat: 18.9150, lng: 72.8215,
    time: "26 Nov, ~20:30",
    toll: "—",
    note: "Ten men came ashore in inflatable dinghies and split up across South Mumbai."
  }
];

/* The 17 security personnel who fell (15 police and Home Guards, 2 NSG). */
const HEROES = [
  { name: "Hemant Kamalakar Karkare", photo: "images/heroes/karkare.jpg", rank: "Joint Commissioner of Police, IPS", force: "Chief, Anti-Terrorism Squad", site: "cama-out", award: "Ashok Chakra", state: "Maharashtra" },
  { name: "Ashok Marutrao Kamte", photo: "images/heroes/kamte.jpg", rank: "Additional Commissioner of Police, IPS", force: "Mumbai Police", site: "cama-out", award: "Ashok Chakra", state: "Maharashtra" },
  { name: "Vijay Sahadev Salaskar", photo: "images/heroes/salaskar.jpg", rank: "Police Inspector", force: "Mumbai Police", site: "cama-out", award: "Ashok Chakra", state: "Maharashtra" },
  { name: "Tukaram Gopal Omble", photo: "images/heroes/omble.jpg", rank: "Assistant Sub-Inspector", force: "Mumbai Police", site: "chowpatty", award: "Ashok Chakra", state: "Maharashtra",
    story: "Unarmed but for a lathi, he held the gunman's rifle barrel and took the bullets so the rest of his team could capture him alive." },
  { name: "Major Sandeep Unnikrishnan", photo: "images/heroes/unnikrishnan.jpg", rank: "Major", force: "51 Special Action Group, NSG", site: "taj", award: "Ashok Chakra", state: "Karnataka",
    story: "Led his commandos into the Taj. His last words to his team are remembered as: \"Don't come up, I will handle them.\"" },
  { name: "Gajender Singh Bisht", rank: "Havildar", force: "National Security Guard", site: "nariman", award: "Ashok Chakra", state: "Uttarakhand",
    story: "Fell leading the assault on Nariman House after commandos were dropped onto its roof." },
  { name: "Shashank Chandrasen Shinde", photo: "images/heroes/shashank-shinde.jpg", rank: "Police Inspector", force: "Government Railway Police, CST", site: "cst", award: "Kirti Chakra", state: "Maharashtra",
    story: "On duty at CST, he confronted the gunmen to protect the passengers around him." },
  { name: "Ambadas Ramchandra Pawar", photo: "images/heroes/ambadas-pawar.jpg", rank: "Police Constable", force: "Mumbai Police", site: "cst", award: "Kirti Chakra", state: "Maharashtra" },
  { name: "Mukesh Bhikaji Jadhav", photo: "images/heroes/mukesh-jadhav.jpg", rank: "Home Guard", force: "Maharashtra Home Guards", site: "cst", award: "Kirti Chakra", state: "Maharashtra" },
  { name: "Arun Raghunath Chitte", photo: "images/heroes/arun-chitte.jpg", rank: "Police Constable (Driver)", force: "Mumbai Police", site: "cama-out", award: "Kirti Chakra", state: "Maharashtra" },
  { name: "Prakash Pandurang More", photo: "images/heroes/prakash-more.jpg", rank: "Police Sub-Inspector", force: "L.T. Marg Police Station", site: "cama-in", award: "", state: "Maharashtra" },
  { name: "Vijay Madhukar Khandekar", photo: "images/heroes/vijay-khandekar.jpg", rank: "Police Constable", force: "Mumbai Police", site: "cama-in", award: "", state: "Maharashtra" },
  { name: "Bapurao Sahebrao Durgude", photo: "images/heroes/bapurao-durgude.jpg", rank: "Police Sub-Inspector", force: "Mumbai Police", site: "cama-out", award: "", state: "Maharashtra" },
  { name: "Balasaheb Chandrakant Bhosale", photo: "images/heroes/balasaheb-bhosale.jpg", rank: "Assistant Sub-Inspector", force: "Mumbai Police", site: "cama-out", award: "", state: "Maharashtra" },
  { name: "Jaywant Hanumant Patil", photo: "images/heroes/jaywant-patil.jpg", rank: "Police Constable", force: "Mumbai Police", site: "cama-out", award: "", state: "Maharashtra" },
  { name: "Yogesh Shivaji Patil", photo: "images/heroes/yogesh-patil.jpg", rank: "Police Constable", force: "Mumbai Police", site: "cama-out", award: "", state: "Maharashtra" },
  { name: "Rahul Subhash Shinde", photo: "images/heroes/rahul-shinde.jpg", rank: "Police Constable", force: "SRPF Group X, Solapur", site: "taj", award: "", state: "Maharashtra",
    story: "Among the first to enter the Taj that night, guarding guests as the attack began." }
];

/* Civilians and staff who stood their ground. */
const CIVILIAN_HEROES = [
  { name: "Vishnu Zende", role: "Railway announcer, CST", text: "Kept announcing over the public address system, directing passengers away from the gunmen and towards the exits." },
  { name: "Anjali Kulthe", role: "Nurse, Cama Hospital", text: "Moved about twenty expectant mothers into a pantry and kept them safe while gunmen roamed the hospital. Later identified Kasab in court." },
  { name: "Karambir Singh Kang", photo: "images/heroes/karambir-kang.jpg", role: "General Manager, Taj Hotel", text: "Stayed at his post to evacuate guests even after learning his wife and two sons were trapped on an upper floor. They did not survive." },
  { name: "Mallika Jagad", role: "Banquet manager, Taj Hotel", text: "Aged 24, she locked a banquet hall, kept the lights off and calmed dozens of guests through the night until rescue." },
  { name: "Thomas Varghese", role: "Senior waiter, Taj Hotel", text: "Formed a human chain to lead diners out of the Wasabi restaurant and was the last to leave. He was shot at the exit." },
  { name: "Sandra Samuel", photo: "images/heroes/sandra-samuel.jpg", role: "Nanny, Nariman House", text: "Ran through gunfire to carry two-year-old Moshe Holtzberg out of the building. His parents were killed inside." }
];

const TIMELINE = [
  { when: "23 Nov 2008", title: "The sea route", text: "Ten men leave Karachi by boat, hijack the Indian fishing trawler Kuber and kill its navigator, Amar Singh Solanki." },
  { when: "26 Nov · 20:30", title: "Landing at Colaba", text: "The ten come ashore in inflatable dinghies at Badhwar Park and Machimar Nagar and split into teams." },
  { when: "26 Nov · 21:20", title: "Nariman House", text: "Two gunmen take over the Jewish outreach centre in Colaba." },
  { when: "26 Nov · 21:30", title: "CST station", text: "Two gunmen open fire in the passenger hall of Chhatrapati Shivaji Terminus." },
  { when: "26 Nov · 21:40", title: "Leopold Cafe and the Taj", text: "Gunfire at Leopold Cafe, then the Taj Mahal Palace Hotel is stormed. Minutes later the Oberoi–Trident is attacked." },
  { when: "26 Nov · 22:20–22:40", title: "Taxi bombs", text: "Bombs explode in taxis at Wadi Bunder and Vile Parle." },
  { when: "26 Nov · late night", title: "Rang Bhavan Lane", text: "Hemant Karkare, Ashok Kamte, Vijay Salaskar and their team are ambushed outside Cama Hospital." },
  { when: "27 Nov · ~01:00", title: "Girgaum Chowpatty", text: "At a police roadblock ASI Tukaram Omble holds a gunman's rifle and is killed. Ajmal Kasab is captured alive." },
  { when: "27 Nov · morning", title: "NSG arrives", text: "National Security Guard commandos land in Mumbai. Operation Black Tornado begins." },
  { when: "28 Nov · 15:00", title: "Oberoi–Trident cleared", text: "The last gunmen in the Oberoi–Trident are killed." },
  { when: "28 Nov · 17:00", title: "Nariman House cleared", text: "After heli-borne commandos storm the roof, the siege ends. Havildar Gajender Singh Bisht falls in the assault." },
  { when: "29 Nov · 08:00", title: "The Taj is free", text: "The last gunman in the Taj is killed. Major Sandeep Unnikrishnan has fallen inside. The attack is over after about 60 hours." },
  { when: "21 Nov 2012", title: "Justice", text: "After trial and appeals up to the Supreme Court, Ajmal Kasab is hanged at Yerwada Jail, Pune." }
];

/* Optional media. Drop your own files in and set the paths. */
const CONFIG = {
  audioSrc: "",   // e.g. "audio/tribute.mp3". Empty = soft built-in tribute tone.
  videoSrc: ""    // e.g. "video/tribute.mp4". Empty = built-in candlelight tribute film.
};
