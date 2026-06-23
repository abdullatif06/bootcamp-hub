// Fallback registration list, used when NEXT_PUBLIC_REGISTRATION_CSV_URL
// is not set. Once you publish the Google Form responses sheet to web as
// CSV and add the URL to .env.local, this list is ignored and the live
// sheet is used instead.

export type Registrant = {
  name: string;
  email: string;
  phone: string;
  confirmed: string;
  university: string;
  gender: string;
};

export const SEED_REGISTRANTS: Registrant[] = [
  { name: "renas samer adel nassar", email: "renas.esmael2006@icloud.com", phone: "0795276144", confirmed: "Yes", university: "University of Jordan", gender: "Female" },
  { name: "Leen Al-Hasanat", email: "leenhasanat9@gmail.com", phone: "0799149836", confirmed: "Yes", university: "University of Jordan", gender: "Female" },
  { name: "Mohammad Ahmed Zaatar", email: "Mohamadzatarico@gmail.com", phone: "962 779333573", confirmed: "Yes", university: "Applied Science Private University", gender: "Male" },
  { name: "Sadeen Abu Lebbeh", email: "sadeenabulebbeh06@gmail.com", phone: "0781703305", confirmed: "Yes", university: "Applied Science Private University", gender: "Female" },
  { name: "Khairy husni khairy alnatsheh", email: "khairy.alnatsheh206@gmail.com", phone: "0780965400", confirmed: "Yes", university: "Tafila Technical University", gender: "Male" },
  { name: "Leen Salameh", email: "", phone: "0790689834", confirmed: "Yes", university: "ASU", gender: "Female" },
  { name: "Abdelrahman Sami Abdin", email: "", phone: "0779582208", confirmed: "Yes", university: "Al Hussein Technical University (HTU)", gender: "Male" },
  { name: "Fareed Mohammad Damra", email: "", phone: "0796342099", confirmed: "Yes", university: "ZUJ", gender: "Male" },
  { name: "Mohammad alghazzawi", email: "", phone: "0786497722", confirmed: "Yes", university: "ISRA", gender: "Male" },
];
