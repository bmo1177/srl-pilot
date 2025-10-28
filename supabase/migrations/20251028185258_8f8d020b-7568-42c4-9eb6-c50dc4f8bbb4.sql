-- Update students table to support both university and personal emails
ALTER TABLE public.students 
  DROP COLUMN IF EXISTS email,
  ADD COLUMN university_email TEXT NOT NULL DEFAULT '',
  ADD COLUMN personal_email TEXT;

-- Insert student data
INSERT INTO public.students (name, university_email, personal_email) VALUES
('Aichouche Walid Aymen', 'walidaymen.aichouche@univ-tiaret.dz', 'darkvally4@gmail.com'),
('Ait Abderrahim Abdelhakim', 'abdelhakim.aitabderrahim@univ-tiaret.dz', 'hakimaitabderrahim18@gmail.com'),
('Belakermi Ahmed Nabil', 'ahmednabil.belakermi@univ-tiaret.dz', 'belakerminabil@gmail.com'),
('Belalia Mohamed Oussama', 'mohamedoussama.belalia@univ-tiaret.dz', NULL),
('Belalia Anis Hossam Eddine', 'anishossameddine.belalia@univ-tiaret.dz', 'anisbelalia1@gmail.com'),
('Belghitar Kheirredine', 'kheirredine.belghitar@univ-tiaret.dz', 'kbrahim817@gmail.com'),
('Bellazereg Imene', 'imene.bellazereg@univ-tiaret.dz', 'raniablm01@gmail.com'),
('Belmorsli Sid Ahmed', 'sidahmed.belmorsli@univ-tiaret.dz', NULL),
('Benhenni Fadoua Wisseme', 'fadouawisseme.benhenni@univ-tiaret.dz', '6fadwayeol@gmail.com'),
('Bouafia Afaf', 'afaf.bouafia@univ-tiaret.dz', 'afafbouafia2001@gmail.com'),
('Boukhdidja Ichrak', 'ichrak.boukhdidja@univ-tiaret.dz', 'boukhdidjaichrak@gmail.com'),
('Boukhors Imen Khadidja', 'imenkhadidja.boukhors@univ-tiaret.dz', 'imenboukhors14@gmail.com'),
('Boumaza Youcef', 'youcef.boumaza@univ-tiaret.dz', 'abboukamal53@gmail.com'),
('Brahim Khalil', 'khalil.brahim@univ-tiaret.dz', 'khaldiaboutaiba@gmail.com'),
('Chaoui Rayen Djillali', 'rayendjillali.chaoui@univ-tiaret.dz', 'chaouirayen@gmail.com'),
('Hamdani Asmaà', 'asmaa.hamdani@univ-tiaret.dz', 'asmahamdani768@gmail.com'),
('Hammadi Aissa', 'aissa.hammadi@univ-tiaret.dz', NULL),
('Hemaid Khadidja', 'khadidja.hemaid@univ-tiaret.dz', 'hemaidnour2006@gmail.com'),
('Kaddour Abderrahmane', 'abderrahmane.kaddour@univ-tiaret.dz', NULL),
('Madani Halla Raounak Hibat Ellah', 'hallaraounakhibatellah.madani@univ-tiaret.dz', 'madanihalla200@gmail.com'),
('Mahrouz Abdelkader', 'abdelkader.mahrouz@univ-tiaret.dz', 'mahrouzaek75@gmail.com'),
('Medmoun Ihab Moâtaz Bellah', 'ihabmoatazbellah.medmoun@univ-tiaret.dz', 'imii99036@gmail.com'),
('Nadri Hanan Fatima Zohra', 'hananfatimazohra.nadri@univ-tiaret.dz', 'fatimanadri19@gmail.com'),
('Naimi Maria-Achouak', 'mariaachouak.naimi@univ-tiaret.dz', 'marianaimi2004@gmail.com'),
('Sadiki Meriem', 'meriem.sadiki@univ-tiaret.dz', 'seddikimer9@gmail.com'),
('Sahnoun Leila', 'leila.sahnoun@univ-tiaret.dz', 'shnnleila147@gmail.com'),
('Serrar Fatma Zohra', 'fatmazohra.serrar@univ-tiaret.dz', 'serrarfatima4@gmail.com'),
('Abdesselem Mustapha El Habib', 'abdesselem.mustaphaelhabib@univ-tiaret.dz', 'ouaredsaleh147@gmail.com')
ON CONFLICT (id) DO NOTHING;