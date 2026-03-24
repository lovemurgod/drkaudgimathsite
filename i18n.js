(function () {
  const STORAGE_KEY = 'site_language';
  const DEFAULT_LANGUAGE = 'kn';
  const SUPPORTED_LANGUAGES = ['en', 'hi', 'kn'];
  const LOCALE_MAP = {
    en: 'en-IN',
    hi: 'hi-IN',
    kn: 'kn-IN'
  };

  const TRANSLATIONS = {
    en: {
      'language.name.en': 'English',
      'language.name.hi': 'Hindi',
      'language.name.kn': 'Kannada',
      'language.label': 'Language',
      'nav.callAmbulanceNow': 'Call Ambulance Now',
      'nav.callNow': 'Call Now',
      'meta.index.title': 'Dr. R. G. Karudagimath Memorial Nursing Home | Badami',
      'meta.index.description': 'Dr. R. G. Karudagimath Memorial Nursing Home, Badami - trusted multispeciality care with 24/7 emergency and ambulance services.',
      'meta.appointment.title': 'Book Appointment | Dr. R. G. Karudagimath Memorial Nursing Home',
      'meta.appointment.description': 'Book an appointment at Dr. R. G. Karudagimath Memorial Nursing Home.',
      'meta.complaint.title': 'Submit Complaint | Dr. R. G. Karudagimath Memorial Nursing Home',
      'meta.complaint.description': 'Submit a complaint to help us improve hospital services.',
      'meta.admin.title': 'Staff Dashboard | Hospital Appointment System',
      'modal.title': 'Choose Your Language',
      'modal.subtitle': 'Please select your preferred language to continue.',
      'modal.emergencyTitle': 'Emergency Ambulance',
      'modal.emergencyNote': 'You can call ambulance directly in any language.',
      'modal.ambulance.en': 'Call Ambulance',
      'modal.ambulance.hi': 'एम्बुलेंस को कॉल करें',
      'modal.ambulance.kn': 'ಆಂಬುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ',
      'appointment.loadingDoctors': 'Loading doctors...',
      'appointment.selectDoctorAndDateFirst': 'Select doctor and date first',
      'appointment.selectDoctor': 'Select Doctor',
      'appointment.selectDoctorFirst': 'Select doctor first',
      'appointment.selectAppointmentDateFirst': 'Select appointment date first',
      'appointment.unavailableSelectedDate': 'Doctor unavailable on selected date',
      'appointment.noScheduleForDoctor': 'No schedule available for selected doctor',
      'appointment.selectValidDate': 'Select a valid appointment date',
      'appointment.noAvailableSlots': 'No available time slots',
      'appointment.selectAppointmentTime': 'Select Appointment Time',
      'appointment.onCall': 'On Call',
      'appointments.initError': 'Unable to initialize booking service. Please try again later.',
      'appointments.loadDoctorsErrorInline': 'Unable to load doctors',
      'appointments.loadDoctorsError': 'Unable to load doctors right now. Please refresh and try again.',
      'appointments.formConfigError': 'Form is not configured correctly. Please contact support.',
      'appointments.requiredFieldsError': 'Please fill all required fields before submitting.',
      'appointments.unavailableDateError': 'Selected doctor is unavailable on this date.',
      'appointments.success': 'Appointment request submitted. Our team will confirm shortly.',
      'appointments.submitError': 'Something went wrong while submitting your request. Please try again.',
      'appointments.scheduleMissing': 'Schedule not available for selected doctor.',
      'appointments.invalidDate': 'Please select a valid appointment date.',
      'appointments.unavailableDay': 'Doctor is unavailable on {{day}}.',
      'appointments.scheduleMissingLong': 'Selected doctor schedule is not available. Please choose another doctor or contact support.',
      'appointments.invalidDateLong': 'Please choose a valid appointment date.',
      'appointments.unavailableDayLong': 'Selected doctor is unavailable on {{day}}. Please choose another day.',
      'appointments.invalidTime': 'Please enter time in a valid format, for example: 10:30 AM or 14:30.',
      'appointments.timeOutsideSchedule': 'Selected doctor is available at {{time}}. Please choose a time within schedule.',
      'complaints.initError': 'Unable to initialize complaint service. Please try again later.',
      'complaints.requiredFieldsError': 'Please fill all required incident fields before submitting.',
      'complaints.success': 'Complaint submitted successfully. Thank you for your feedback.',
      'complaints.submitError': 'Something went wrong while submitting your complaint. Please try again.',
      'admin.status.pending': 'Pending',
      'admin.status.confirmed': 'Confirmed',
      'admin.status.completed': 'Completed',
      'admin.status.cancelled': 'Cancelled',
      'admin.status.noShow': 'No Show',
      'admin.complaintStatus.new': 'New',
      'admin.complaintStatus.investigating': 'Investigating',
      'admin.complaintStatus.resolved': 'Resolved',
      'admin.complaintStatus.rejected': 'Rejected',
      'admin.dbUnavailable': 'Unable to connect to the database.',
      'admin.enterCredentials': 'Please enter username/email and password.',
      'admin.loggingIn': 'Logging in...',
      'admin.login': 'Login',
      'admin.onlyReception': 'Only receptionist accounts can create manual appointments.',
      'admin.fillRequired': 'Please fill all required fields.',
      'admin.manualCreated': 'Manual appointment created successfully.',
      'admin.submitting': 'Submitting...',
      'admin.submit': 'Submit',
      'admin.staffLogin': 'Staff Login',
      'admin.doctorDashboard': 'Doctor Dashboard',
      'admin.managementDashboard': 'Management Dashboard',
      'admin.receptionDashboard': 'Reception Dashboard',
      'admin.myAppointments': 'My Appointments',
      'admin.allDoctors': 'All Doctors',
      'admin.assignedDoctor': 'Assigned Doctor',
      'admin.selectDoctor': 'Select Doctor',
      'admin.update': 'Update',
      'admin.loginInvalid': 'Invalid email or password.',
      'admin.loginNotConfirmed': 'Email is not confirmed for this account.',
      'admin.loginNoRole': 'Your account is not assigned as receptionist, doctor, or management.',
      'admin.loginDoctorMissing': 'Doctor account is missing assigned doctor profile.',
      'admin.loginUnavailable': 'Unable to login right now. Please try again.',
      'admin.onlyOwnAppointments': 'You can update only your own appointments.',
      'admin.createAppointmentError': 'Unable to create appointment. Please try again.',
      'admin.anonymous': 'Anonymous',
      'admin.appointmentStatusAria': 'Appointment Status',
      'admin.complaintStatusAria': 'Complaint Status',
    
      'admin.allStatuses': 'All Statuses',
      'admin.appointments': 'Appointments',
      'admin.appointmentsCaption': 'Hospital appointment list',
      'admin.complaints': 'Complaints',
      'admin.complaintsCaption': 'Hospital complaints list',
      'admin.field.actions': 'Actions',
      'admin.field.date': 'Date',
      'admin.field.details': 'Details',
      'admin.field.doctor': 'Doctor',
      'admin.field.emailOrUsername': 'Email or Username',
      'admin.field.nature': 'Nature',
      'admin.field.notes': 'Notes',
      'admin.field.occurredDate': 'Occurred Date',
      'admin.field.occurredTime': 'Occurred Time',
      'admin.field.password': 'Password',
      'admin.field.patientName': 'Patient Name',
      'admin.field.phone': 'Phone',
      'admin.field.reportedAt': 'Reported At',
      'admin.field.reporter': 'Reporter',
      'admin.field.source': 'Source',
      'admin.field.status': 'Status',
      'admin.field.time': 'Time',
      'admin.filters': 'Filters',
      'admin.logout': 'Logout',
      'admin.manualEntry': 'Manual Appointment Entry',
      'admin.pingManagement': 'Ping Management',
      'admin.pingingManagement': 'Sending alert...',
      'admin.pingManagementSuccess': 'Management has been alerted.',
      'admin.pingManagementError': 'Unable to alert management. Please try again.',
      'admin.managementAlertLabel': 'Management Alert',
      'admin.managementAlertTitle': 'Reception needs management assistance',
      'admin.managementAlertBody': 'Reception has requested immediate support at the front desk.',
      'admin.managementAlertTime': 'Sent at',
      'admin.dismissAlert': 'Dismiss',
      'admin.managementAlertHistory': 'Management Alerts',
      'admin.managementAlertHistoryIntro': 'Review reception pings, update status, and maintain note history.',
      'admin.managementAlertHistoryCaption': 'Management alert history list',
      'admin.managementAlertColumn.alert': 'Alert',
      'admin.managementAlertColumn.sentAt': 'Sent At',
      'admin.managementAlertColumn.status': 'Status',
      'admin.managementAlertColumn.notes': 'Notes',
      'admin.managementAlertDetail': 'Alert Details',
      'admin.managementAlertTypeReceptionPing': 'Reception Ping',
      'admin.managementAlertStatusAria': 'Alert Status',
      'admin.managementAlertStatus.new': 'New',
      'admin.managementAlertStatus.acknowledged': 'Acknowledged',
      'admin.managementAlertStatus.inProgress': 'In Progress',
      'admin.managementAlertStatus.resolved': 'Resolved',
      'admin.managementAlertStatus.rejected': 'Rejected',
      'admin.saveAlertStatus': 'Save Status',
      'admin.savingAlertStatus': 'Saving...',
      'admin.managementAlertStatusSaved': 'Alert status updated.',
      'admin.managementAlertStatusError': 'Unable to update alert status right now.',
      'admin.managementAlertAddNote': 'Add Note',
      'admin.addAlertNote': 'Add Note',
      'admin.savingAlertNote': 'Saving note...',
      'admin.managementAlertNotes': 'Note History',
      'admin.managementAlertNotesEmpty': 'No notes added yet.',
      'admin.managementAlertCommentPlaceholder': 'Add a note for this alert',
      'admin.managementAlertNoteRequired': 'Please enter a note before saving.',
      'admin.managementAlertNoteSaved': 'Note added to alert history.',
      'admin.managementAlertNoteError': 'Unable to save this note right now.',
      'admin.managementAlertLoadError': 'Unable to load management alerts right now.',
      'admin.managementAlertHistoryEmpty': 'No management alerts yet.',
      'admin.openAlert': 'Open',
      'admin.you': 'You',
      'admin.managementTeam': 'Management',
      'admin.staffDashboard': 'Staff Dashboard',
      'appointment.field.appointmentDate': 'Appointment Date *',
      'appointment.field.appointmentTime': 'Appointment Time *',
      'appointment.field.email': 'Email',
      'appointment.field.notes': 'Notes (Optional)',
      'appointment.field.patientName': 'Patient Name *',
      'appointment.field.phoneNumber': 'Phone Number *',
      'appointment.field.selectDoctor': 'Select Doctor *',
      'appointment.helpText': 'We are here to help',
      'appointment.notesPlaceholder': 'Add any symptoms or additional information',
      'appointment.pageIntro': 'Please fill in your details. Our team will contact you to confirm your appointment.',
      'appointment.pageTitle': 'Book an Appointment',
      'appointment.submitRequest': 'Submit Appointment Request',
      'common.allRightsReserved': 'All rights reserved.',
      'common.bookAppointment': 'Book Appointment',
      'common.brandHomeAria': 'Dr. R. G. Karudagimath Memorial Nursing Home home',
      'common.brandName': 'Dr. R. G. Karudagimath Memorial Nursing Home',
      'common.callAmbulanceAria': 'Call ambulance now',
      'common.daysLabel': 'Days:',
      'common.fileComplaint': 'File Complaint',
      'common.footerLogoAlt': 'Dr. R. G. Karudagimath Memorial Nursing Home footer logo',
      'common.home': 'Home',
      'common.hospitalNameBadami': 'Dr. R. G. Karudagimath Memorial Nursing Home, Badami',
      'common.languageSelectorAria': 'Language selector',
      'common.logoAlt': 'Dr. R. G. Karudagimath Memorial Nursing Home logo',
      'common.mainHeaderAria': 'Main header',
      'common.primaryNavigationAria': 'Primary navigation',
      'common.skipToMain': 'Skip to main content',
      'common.timeLabel': 'Time:',
      'complaint.category.billing': 'Billing Issue',
      'complaint.category.cleanliness': 'Cleanliness & Hygiene',
      'complaint.category.clinicalConcern': 'Clinical Concern',
      'complaint.category.facilities': 'Facilities Issue',
      'complaint.category.other': 'Other',
      'complaint.category.select': 'Select complaint category',
      'complaint.category.serviceDelay': 'Service Delay',
      'complaint.category.staffBehaviour': 'Staff Behaviour',
      'complaint.detailsPlaceholder': 'Please describe what happened, where it happened, and who was involved.',
      'complaint.field.details': 'Complaint Details *',
      'complaint.field.email': 'Email (Optional)',
      'complaint.field.incidentDate': 'Incident Occurred Date *',
      'complaint.field.incidentNature': 'Nature of Incident *',
      'complaint.field.incidentTime': 'Incident Occurred Time *',
      'complaint.field.name': 'Name (Optional)',
      'complaint.field.phone': 'Phone (Optional)',
      'complaint.pageIntro': 'Your feedback helps hospital management improve patient care. Personal details are optional.',
      'complaint.pageTitle': 'Submit a Complaint',
      'complaint.submit': 'Submit Complaint',
      'index.complaintCta.button': 'File a Complaint',
      'index.complaintCta.text': 'Had a concern during your visit? Share your complaint directly with management.',
      'index.complaintCta.title': 'Help Us Improve Care',
      'index.contact.ambulanceLabel': 'Ambulance (24/7):',
      'index.contact.emergencyLabel': 'Emergency:',
      'index.contact.emergencyValue': '24/7 Available',
      'index.contact.mapAria': 'Hospital location map',
      'index.contact.mapTitle': 'Map showing Dr. R. G. Karudagimath Memorial Nursing Home location',
      'index.contact.phoneLabel': 'Phone:',
      'index.contact.title': 'Contact Us',
      'index.contact.whatsappAction': 'Chat on WhatsApp',
      'index.contact.whatsappLabel': 'WhatsApp:',
      'index.doctors.title': 'Our Doctors',
      'index.doctors.name.vinayak': 'Dr. Vinayak Mugalakhod',
      'index.doctors.name.ajay': 'Dr. Ajay T. Naik',
      'index.doctors.name.santoshDesai': 'Dr. Santosh B. Desai',
      'index.doctors.name.revanasiddappa': 'Dr. B.H.Revanasiddappa',
      'index.doctors.name.kirankumar': 'Dr. Kirankumar S. Kulageri',
      'index.doctors.name.jayant': 'Dr. Jayant Kumar',
      'index.doctors.name.pradeep': 'Dr. Pradeep Nandi',
      'index.doctors.name.abhinandan': 'Dr. Abhinandan B.',
      'index.doctors.name.santoshMalashetti': 'Dr Santosh Malashetti',
      'index.doctors.name.anirudh': 'Dr. Anirudh A Mallapur',
      'index.doctors.name.vinod': 'Dr. Vinod Akkasali',
      'index.doctors.name.tohid': 'Dr. Tohid Kazi',
      'index.doctors.speciality.mdMedicine': 'MD Medicine',
      'index.doctors.speciality.mdsDental': 'M.D.S Dental',
      'index.doctors.speciality.ophthalmology': 'Ophthalmology',
      'index.doctors.speciality.physiotherapist': 'Physiotherapist',
      'index.doctors.speciality.ent': 'ENT',
      'index.doctors.speciality.skinVd': 'Skin and VD',
      'index.doctors.speciality.psychiatry': 'Psychiatry',
      'index.doctors.speciality.anaesthesiology': 'Anaesthesiology',
      'index.founder.caption': 'Founder: Dr. G. B. Karudagimath',
      'index.founderImageAlt': 'Founder Dr. G. B. Karudagimath',
      'index.hero.eyebrow': 'Badami, Karnataka',
      'index.hero.lead': 'A trusted name in healthcare for generations—delivering structured, safe, and compassionate care for every family in our community.',
      'index.legacy.founderBody': 'Dr. G. B. Karudagimath established this hospital with a clear vision of delivering dependable, ethical, and patient-first medical care. Guided by strong values and decades of medical experience, he laid the foundation for a healthcare institution rooted in compassion, discipline, and clinical excellence. His commitment to structured treatment, transparency, and humane care continues to shape the hospital’s standards and services. Today, his vision remains the guiding force behind the hospital’s mission to serve the community with trust, dignity, and dedication.',
      'index.legacy.founderImageAlt': 'Dr. G. B. Karudagimath, founder of the hospital',
      'index.legacy.successorBody1': 'Dr. Rajashekar G. Karudagimath represents the seamless continuation of a noble medical legacy. As the second-generation leader of Dr. G. B. Karudagimath Multispeciality Hospital, he brings together modern medical expertise and the timeless values on which the institution was founded. With a progressive outlook and deep respect for patient-centered care, he has strengthened the hospital’s commitment to trust, safety, and ethical practice.',
      'index.legacy.successorBody2': 'Under his guidance, the hospital continues to evolve with advanced treatments, updated technology, and compassionate service, while remaining firmly rooted in community welfare. His leadership reflects a rare balance of innovation and integrity, ensuring that every patient receives care that is not only clinically excellent but also deeply humane.',
      'index.legacy.successorImageAlt': 'Dr. Rajashekar G. Karudagimath',
      'index.legacy.successorTitle': 'Continuing the Vision: Dr. Rajashekar G. Karudagimath',
      'index.legacy.title': 'Our Legacy of Trusted Care',
      'index.specialities.title': 'Our Specialities',
      'index.whyUs.ambulance': 'Ambulance Service',
      'index.whyUs.communityTrust': 'Community Trust',
      'index.whyUs.emergency': '24/7 Emergency',
      'index.whyUs.experiencedDoctors': 'Experienced Doctors',
      'index.whyUs.structuredCare': 'Structured Patient Care',
      'index.whyUs.title': 'Why Choose Us',
      'nav.contact': 'Contact',
      'nav.doctors': 'Doctors',
      'nav.legacy': 'Legacy',
      'nav.specialities': 'Specialities',
      'speciality.generalMedicine': 'General Medicine',
      'speciality.generalMedicine.desc': 'Diagnosis and treatment for acute and chronic conditions with coordinated follow-up.',
      'speciality.generalSurgery': 'General Surgery',
      'speciality.generalSurgery.desc': 'Safe surgical consultation and procedures with pre- and post-operative patient care.',
      'speciality.obg': 'OBG Gynecology',
      'speciality.obg.desc': 'Dedicated women\'s health services including antenatal, postnatal, and gynecological care.',
      'speciality.orthopaedics': 'Orthopaedics',
      'speciality.orthopaedics.desc': 'Comprehensive bone, joint, and fracture care with focused rehabilitation support.',
      'speciality.paediatrics': 'Paediatrics',
      'speciality.paediatrics.desc': 'Compassionate child healthcare for growth, development, routine illness, and prevention.',},
    hi: {
      'language.name.en': 'अंग्रेज़ी',
      'language.name.hi': 'हिन्दी',
      'language.name.kn': 'कन्नड़',
      'language.label': 'भाषा',
      'nav.callAmbulanceNow': 'अभी एम्बुलेंस कॉल करें',
      'nav.callNow': 'अभी कॉल करें',
      'meta.index.title': 'डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम | बादामी',
      'meta.index.description': 'डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम, बादामी - 24/7 इमरजेंसी और एम्बुलेंस के साथ विश्वसनीय बहु-विशेषज्ञ चिकित्सा सेवा।',
      'meta.appointment.title': 'अपॉइंटमेंट बुक करें | डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम',
      'meta.appointment.description': 'डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम में अपॉइंटमेंट बुक करें।',
      'meta.complaint.title': 'शिकायत दर्ज करें | डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम',
      'meta.complaint.description': 'अस्पताल सेवाओं में सुधार के लिए शिकायत दर्ज करें।',
      'meta.admin.title': 'स्टाफ डैशबोर्ड | अस्पताल अपॉइंटमेंट सिस्टम',
      'modal.title': 'अपनी भाषा चुनें',
      'modal.subtitle': 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें।',
      'modal.emergencyTitle': 'आपातकालीन एम्बुलेंस',
      'modal.emergencyNote': 'आप किसी भी भाषा में सीधे एम्बुलेंस कॉल कर सकते हैं।',
      'modal.ambulance.en': 'Call Ambulance',
      'modal.ambulance.hi': 'एम्बुलेंस को कॉल करें',
      'modal.ambulance.kn': 'ಆಂಬುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ',
      'appointment.loadingDoctors': 'डॉक्टर लोड हो रहे हैं...',
      'appointment.selectDoctorAndDateFirst': 'पहले डॉक्टर और तारीख चुनें',
      'appointment.selectDoctor': 'डॉक्टर चुनें',
      'appointment.selectDoctorFirst': 'पहले डॉक्टर चुनें',
      'appointment.selectAppointmentDateFirst': 'पहले अपॉइंटमेंट की तारीख चुनें',
      'appointment.unavailableSelectedDate': 'चुनी गई तारीख पर डॉक्टर उपलब्ध नहीं हैं',
      'appointment.noScheduleForDoctor': 'चुने गए डॉक्टर का शेड्यूल उपलब्ध नहीं है',
      'appointment.selectValidDate': 'कृपया मान्य तारीख चुनें',
      'appointment.noAvailableSlots': 'कोई समय स्लॉट उपलब्ध नहीं है',
      'appointment.selectAppointmentTime': 'अपॉइंटमेंट समय चुनें',
      'appointment.onCall': 'ऑन कॉल',
      'appointments.initError': 'बुकिंग सेवा शुरू नहीं हो सकी। कृपया बाद में पुनः प्रयास करें।',
      'appointments.loadDoctorsErrorInline': 'डॉक्टर लोड नहीं हो सके',
      'appointments.loadDoctorsError': 'अभी डॉक्टर सूची लोड नहीं हो रही है। कृपया पेज रीफ्रेश करके फिर कोशिश करें।',
      'appointments.formConfigError': 'फॉर्म सही तरीके से कॉन्फ़िगर नहीं है। कृपया सहायता से संपर्क करें।',
      'appointments.requiredFieldsError': 'सबमिट करने से पहले सभी आवश्यक फ़ील्ड भरें।',
      'appointments.unavailableDateError': 'चुने गए डॉक्टर इस तारीख पर उपलब्ध नहीं हैं।',
      'appointments.success': 'अपॉइंटमेंट अनुरोध जमा हो गया है। हमारी टीम शीघ्र पुष्टि करेगी।',
      'appointments.submitError': 'अनुरोध जमा करते समय समस्या हुई। कृपया फिर से प्रयास करें।',
      'appointments.scheduleMissing': 'चुने गए डॉक्टर का शेड्यूल उपलब्ध नहीं है।',
      'appointments.invalidDate': 'कृपया सही अपॉइंटमेंट तारीख चुनें।',
      'appointments.unavailableDay': 'डॉक्टर {{day}} को उपलब्ध नहीं हैं।',
      'appointments.scheduleMissingLong': 'चुने गए डॉक्टर का शेड्यूल उपलब्ध नहीं है। कृपया अन्य डॉक्टर चुनें या सहायता से संपर्क करें।',
      'appointments.invalidDateLong': 'कृपया वैध तारीख चुनें।',
      'appointments.unavailableDayLong': 'चुने गए डॉक्टर {{day}} को उपलब्ध नहीं हैं। कृपया दूसरा दिन चुनें।',
      'appointments.invalidTime': 'कृपया सही समय दर्ज करें, जैसे: 10:30 AM या 14:30।',
      'appointments.timeOutsideSchedule': 'चुने गए डॉक्टर {{time}} पर उपलब्ध हैं। कृपया इसी समय सीमा में समय चुनें।',
      'complaints.initError': 'शिकायत सेवा शुरू नहीं हो सकी। कृपया बाद में पुनः प्रयास करें।',
      'complaints.requiredFieldsError': 'सबमिट करने से पहले घटना से जुड़ी सभी आवश्यक जानकारी भरें।',
      'complaints.success': 'शिकायत सफलतापूर्वक जमा हो गई। आपके सुझाव के लिए धन्यवाद।',
      'complaints.submitError': 'शिकायत जमा करते समय समस्या हुई। कृपया फिर से प्रयास करें।',
      'admin.status.pending': 'लंबित',
      'admin.status.confirmed': 'पुष्ट',
      'admin.status.completed': 'पूर्ण',
      'admin.status.cancelled': 'रद्द',
      'admin.status.noShow': 'नहीं आए',
      'admin.complaintStatus.new': 'नई',
      'admin.complaintStatus.investigating': 'जांच जारी',
      'admin.complaintStatus.resolved': 'समाधान हुआ',
      'admin.complaintStatus.rejected': 'अस्वीकृत',
      'admin.dbUnavailable': 'डेटाबेस से कनेक्ट नहीं हो सका।',
      'admin.enterCredentials': 'कृपया यूज़रनेम/ईमेल और पासवर्ड दर्ज करें।',
      'admin.loggingIn': 'लॉगिन हो रहा है...',
      'admin.login': 'लॉगिन',
      'admin.onlyReception': 'केवल रिसेप्शनिस्ट खाते मैन्युअल अपॉइंटमेंट बना सकते हैं।',
      'admin.fillRequired': 'कृपया सभी आवश्यक फ़ील्ड भरें।',
      'admin.manualCreated': 'मैन्युअल अपॉइंटमेंट सफलतापूर्वक बनाया गया।',
      'admin.submitting': 'सबमिट हो रहा है...',
      'admin.submit': 'सबमिट करें',
      'admin.staffLogin': 'स्टाफ लॉगिन',
      'admin.doctorDashboard': 'डॉक्टर डैशबोर्ड',
      'admin.managementDashboard': 'प्रबंधन डैशबोर्ड',
      'admin.receptionDashboard': 'रिसेप्शन डैशबोर्ड',
      'admin.myAppointments': 'मेरी अपॉइंटमेंट्स',
      'admin.allDoctors': 'सभी डॉक्टर',
      'admin.assignedDoctor': 'निर्धारित डॉक्टर',
      'admin.selectDoctor': 'डॉक्टर चुनें',
      'admin.update': 'अपडेट',
      'admin.loginInvalid': 'ईमेल या पासवर्ड गलत है।',
      'admin.loginNotConfirmed': 'इस खाते का ईमेल पुष्टि नहीं किया गया है।',
      'admin.loginNoRole': 'आपका खाता रिसेप्शनिस्ट, डॉक्टर या प्रबंधन के रूप में असाइन नहीं है।',
      'admin.loginDoctorMissing': 'डॉक्टर खाते में डॉक्टर प्रोफाइल असाइन नहीं है।',
      'admin.loginUnavailable': 'अभी लॉगिन नहीं हो पा रहा है। कृपया फिर प्रयास करें।',
      'admin.onlyOwnAppointments': 'आप केवल अपनी अपॉइंटमेंट्स अपडेट कर सकते हैं।',
      'admin.createAppointmentError': 'अपॉइंटमेंट नहीं बन सका। कृपया फिर से प्रयास करें।',
      'admin.anonymous': 'गुमनाम',
      'admin.appointmentStatusAria': 'अपॉइंटमेंट स्थिति',
      'admin.complaintStatusAria': 'शिकायत स्थिति',
    
      'admin.allStatuses': 'सभी स्थितियां',
      'admin.appointments': 'अपॉइंटमेंट्स',
      'admin.appointmentsCaption': 'अस्पताल अपॉइंटमेंट सूची',
      'admin.complaints': 'शिकायतें',
      'admin.complaintsCaption': 'अस्पताल शिकायत सूची',
      'admin.field.actions': 'क्रियाएं',
      'admin.field.date': 'तारीख',
      'admin.field.details': 'विवरण',
      'admin.field.doctor': 'डॉक्टर',
      'admin.field.emailOrUsername': 'ईमेल या यूज़रनेम',
      'admin.field.nature': 'प्रकार',
      'admin.field.notes': 'टिप्पणियां',
      'admin.field.occurredDate': 'घटना की तारीख',
      'admin.field.occurredTime': 'घटना ಸಮಯ',
      'admin.field.password': 'पासवर्ड',
      'admin.field.patientName': 'रोगी का नाम',
      'admin.field.phone': 'फोन',
      'admin.field.reportedAt': 'रिपोर्ट समय',
      'admin.field.reporter': 'रिपोर्ट करने वाला',
      'admin.field.source': 'स्रोत',
      'admin.field.status': 'स्थिति',
      'admin.field.time': 'समय',
      'admin.filters': 'फ़िल्टर',
      'admin.logout': 'लॉगआउट',
      'admin.manualEntry': 'मैन्युअल अपॉइंटमेंट प्रविष्टि',
      'admin.pingManagement': 'प्रबंधन को सूचित करें',
      'admin.pingingManagement': 'अलर्ट भेजा जा रहा है...',
      'admin.pingManagementSuccess': 'प्रबंधन को सूचित कर दिया गया है।',
      'admin.pingManagementError': 'प्रबंधन को सूचित नहीं किया जा सका। कृपया फिर प्रयास करें।',
      'admin.managementAlertLabel': 'प्रबंधन अलर्ट',
      'admin.managementAlertTitle': 'रिसेप्शन को प्रबंधन सहायता चाहिए',
      'admin.managementAlertBody': 'रिसेप्शन ने फ्रंट डेस्क पर तुरंत सहायता का अनुरोध किया है।',
      'admin.managementAlertTime': 'भेजा गया',
      'admin.dismissAlert': 'बंद करें',
      'admin.managementAlertHistory': 'प्रबंधन अलर्ट',
      'admin.managementAlertHistoryIntro': 'रिसेप्शन पिंग देखें, स्थिति अपडेट करें और नोट इतिहास बनाए रखें।',
      'admin.managementAlertHistoryCaption': 'प्रबंधन अलर्ट इतिहास सूची',
      'admin.managementAlertColumn.alert': 'अलर्ट',
      'admin.managementAlertColumn.sentAt': 'भेजा गया',
      'admin.managementAlertColumn.status': 'स्थिति',
      'admin.managementAlertColumn.notes': 'नोट्स',
      'admin.managementAlertDetail': 'अलर्ट विवरण',
      'admin.managementAlertTypeReceptionPing': 'रिसेप्शन पिंग',
      'admin.managementAlertStatusAria': 'अलर्ट स्थिति',
      'admin.managementAlertStatus.new': 'नई',
      'admin.managementAlertStatus.acknowledged': 'स्वीकार किया गया',
      'admin.managementAlertStatus.inProgress': 'कार्य प्रगति पर',
      'admin.managementAlertStatus.resolved': 'समाधान हुआ',
      'admin.managementAlertStatus.rejected': 'अस्वीकृत',
      'admin.saveAlertStatus': 'स्थिति सहेजें',
      'admin.savingAlertStatus': 'सहेजा जा रहा है...',
      'admin.managementAlertStatusSaved': 'अलर्ट स्थिति अपडेट हो गई है।',
      'admin.managementAlertStatusError': 'अभी अलर्ट स्थिति अपडेट नहीं की जा सकी।',
      'admin.managementAlertAddNote': 'नोट जोड़ें',
      'admin.addAlertNote': 'नोट जोड़ें',
      'admin.savingAlertNote': 'नोट सहेजा जा रहा है...',
      'admin.managementAlertNotes': 'नोट इतिहास',
      'admin.managementAlertNotesEmpty': 'अभी तक कोई नोट नहीं जोड़ा गया है।',
      'admin.managementAlertCommentPlaceholder': 'इस अलर्ट के लिए एक नोट जोड़ें',
      'admin.managementAlertNoteRequired': 'सहेजने से पहले कृपया एक नोट लिखें।',
      'admin.managementAlertNoteSaved': 'नोट अलर्ट इतिहास में जोड़ दिया गया है।',
      'admin.managementAlertNoteError': 'अभी यह नोट सहेजा नहीं जा सका।',
      'admin.managementAlertLoadError': 'अभी प्रबंधन अलर्ट लोड नहीं किए जा सके।',
      'admin.managementAlertHistoryEmpty': 'अभी तक कोई प्रबंधन अलर्ट नहीं है।',
      'admin.openAlert': 'खोलें',
      'admin.you': 'आप',
      'admin.managementTeam': 'प्रबंधन',
      'admin.staffDashboard': 'स्टाफ डैशबोर्ड',
      'appointment.field.appointmentDate': 'अपॉइंटमेंट तारीख *',
      'appointment.field.appointmentTime': 'अपॉइंटमेंट समय *',
      'appointment.field.email': 'ईमेल',
      'appointment.field.notes': 'टिप्पणियां (वैकल्पिक)',
      'appointment.field.patientName': 'रोगी का नाम *',
      'appointment.field.phoneNumber': 'फोन नंबर *',
      'appointment.field.selectDoctor': 'डॉक्टर चुनें *',
      'appointment.helpText': 'हम आपकी सहायता के लिए हैं',
      'appointment.notesPlaceholder': 'कोई लक्षण या अतिरिक्त जानकारी लिखें',
      'appointment.pageIntro': 'कृपया अपनी जानकारी भरें। हमारी टीम आपकी अपॉइंटमेंट की पुष्टि के लिए संपर्क करेगी।',
      'appointment.pageTitle': 'अपॉइंटमेंट बुक करें',
      'appointment.submitRequest': 'अपॉइंटमेंट अनुरोध सबमिट करें',
      'common.allRightsReserved': 'सर्वाधिकार सुरक्षित।',
      'common.bookAppointment': 'अपॉइंटमेंट बुक करें',
      'common.brandHomeAria': 'Dr. R. G. Karudagimath Memorial Nursing Home home',
      'common.brandName': 'डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम',
      'common.callAmbulanceAria': 'अभी एम्बुलेंस कॉल करें',
      'common.daysLabel': 'दिन:',
      'common.fileComplaint': 'शिकायत दर्ज करें',
      'common.footerLogoAlt': 'Dr. R. G. Karudagimath Memorial Nursing Home footer logo',
      'common.home': 'मुख्य पृष्ठ',
      'common.hospitalNameBadami': 'डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम, बादामी',
      'common.languageSelectorAria': 'भाषा चयन',
      'common.logoAlt': 'Dr. R. G. Karudagimath Memorial Nursing Home logo',
      'common.mainHeaderAria': 'मुख्य शीर्षक',
      'common.primaryNavigationAria': 'मुख्य नेविगेशन',
      'common.skipToMain': 'मुख्य सामग्री पर जाएं',
      'common.timeLabel': 'समय:',
      'complaint.category.billing': 'बिलिंग समस्या',
      'complaint.category.cleanliness': 'स्वच्छता और हाइजीन',
      'complaint.category.clinicalConcern': 'चिकित्सकीय चिंता',
      'complaint.category.facilities': 'सुविधा समस्या',
      'complaint.category.other': 'अन्य',
      'complaint.category.select': 'शिकायत श्रेणी चुनें',
      'complaint.category.serviceDelay': 'सेवा में देरी',
      'complaint.category.staffBehaviour': 'स्टाफ का व्यवहार',
      'complaint.detailsPlaceholder': 'कृपया बताएं क्या हुआ, कहां हुआ और इसमें कौन शामिल था।',
      'complaint.field.details': 'शिकायत विवरण *',
      'complaint.field.email': 'ईमेल (वैकल्पिक)',
      'complaint.field.incidentDate': 'घटना की तारीख *',
      'complaint.field.incidentNature': 'घटना का प्रकार *',
      'complaint.field.incidentTime': 'घटना का समय *',
      'complaint.field.name': 'नाम (वैकल्पिक)',
      'complaint.field.phone': 'फोन (वैकल्पिक)',
      'complaint.pageIntro': 'आपकी प्रतिक्रिया अस्पताल प्रबंधन को रोगी सेवा सुधारने में मदद करती है। व्यक्तिगत विवरण देना वैकल्पिक है।',
      'complaint.pageTitle': 'शिकायत दर्ज करें',
      'complaint.submit': 'शिकायत सबमिट करें',
      'index.complaintCta.button': 'एक शिकायत दर्ज करें',
      'index.complaintCta.text': 'आपकी यात्रा के दौरान कोई चिंता हुई? अपनी शिकायत सीधे प्रबंधन से साझा करें।',
      'index.complaintCta.title': 'देखभाल सुधारने में हमारी मदद करें',
      'index.contact.ambulanceLabel': 'एम्बुलेंस (24/7):',
      'index.contact.emergencyLabel': 'आपातकालीन:',
      'index.contact.emergencyValue': '24/7 उपलब्ध',
      'index.contact.mapAria': 'अस्पताल स्थान मानचित्र',
      'index.contact.mapTitle': 'डॉ. आर. जी. कारुडगीमठ मेमोरियल नर्सिंग होम का स्थान दिखाने वाला मानचित्र',
      'index.contact.phoneLabel': 'फोन:',
      'index.contact.title': 'संपर्क करें',
      'index.contact.whatsappAction': 'व्हाट्सऐप पर चैट करें',
      'index.contact.whatsappLabel': 'व्हाट्सऐप:',
      'index.doctors.title': 'हमारे डॉक्टर',
      'index.doctors.name.vinayak': 'डॉ. विनायक मुगलखोड',
      'index.doctors.name.ajay': 'डॉ. अजय टी. नाइक',
      'index.doctors.name.santoshDesai': 'डॉ. संतोष बी. देसाई',
      'index.doctors.name.revanasiddappa': 'डॉ. बी.एच. रेवणसिद्धप्पा',
      'index.doctors.name.kirankumar': 'डॉ. किरणकुमार एस. कुलगेरी',
      'index.doctors.name.jayant': 'डॉ. जयंत कुमार',
      'index.doctors.name.pradeep': 'डॉ. प्रदीप नंदी',
      'index.doctors.name.abhinandan': 'डॉ. अभिनंदन बी.',
      'index.doctors.name.santoshMalashetti': 'डॉ. संतोष मलशेट्टी',
      'index.doctors.name.anirudh': 'डॉ. अनिरुद्ध ए. मल्लापुर',
      'index.doctors.name.vinod': 'डॉ. विनोद अक्कसाली',
      'index.doctors.name.tohid': 'डॉ. तोहीद काज़ी',
      'index.doctors.speciality.mdMedicine': 'एमडी मेडिसिन',
      'index.doctors.speciality.mdsDental': 'एम.डी.एस डेंटल',
      'index.doctors.speciality.ophthalmology': 'ऑफ्थैल्मोलॉजी',
      'index.doctors.speciality.physiotherapist': 'फिजियोथेरेपिस्ट',
      'index.doctors.speciality.ent': 'ईएनटी',
      'index.doctors.speciality.skinVd': 'स्किन एंड वीडी',
      'index.doctors.speciality.psychiatry': 'साइकियाट्री',
      'index.doctors.speciality.anaesthesiology': 'एनेस्थीसियोलॉजी',
      'index.founder.caption': 'संस्थापक: डॉ. जी. बी. कारुडगीमठ',
      'index.founderImageAlt': 'संस्थापक डॉ. जी. बी. कारुडगीमठ',
      'index.hero.eyebrow': 'बादामी, कर्नाटक',
      'index.hero.lead': 'पीढ़ियों से स्वास्थ्य सेवाओं में भरोसेमंद नाम - हमारे समुदाय के हर परिवार को संरचित, सुरक्षित और करुणापूर्ण देखभाल प्रदान करता है।',
      'index.legacy.founderBody': 'डॉ. जी. बी. कारुडगीमठ ने इस अस्पताल की स्थापना भरोसेमंद, नैतिक और रोगी-प्रथम चिकित्सा सेवा के स्पष्ट दृष्टिकोण के साथ की। मजबूत मूल्यों और दशकों के चिकित्सा अनुभव के आधार पर उन्होंने करुणा, अनुशासन और क्लिनिकल उत्कृष्टता पर आधारित संस्थान की नींव रखी। संरचित उपचार, पारदर्शिता और मानवीय सेवा के प्रति उनकी प्रतिबद्धता आज भी अस्पताल की सेवाओं और मानकों को दिशा देती है। समुदाय की सेवा में विश्वास, गरिमा और समर्पण उनकी दृष्टि का केंद्र बना हुआ है।',
      'index.legacy.founderImageAlt': 'Dr. G. B. Karudagimath, founder of the hospital',
      'index.legacy.successorBody1': 'डॉ. राजशेखर जी. कारुडगीमठ एक महान चिकित्सा विरासत की निरंतरता का प्रतिनिधित्व करते हैं। डॉ. जी. बी. कारुडगीमठ मल्टीस्पेशलिटी अस्पताल के दूसरी पीढ़ी के नेतृत्वकर्ता के रूप में वे आधुनिक चिकित्सा विशेषज्ञता को संस्थान के मूल शाश्वत मूल्यों के साथ जोड़ते हैं। प्रगतिशील दृष्टिकोण और रोगी-केंद्रित सेवा के प्रति गहरे सम्मान के साथ उन्होंने अस्पताल की विश्वसनीयता, सुरक्षा और नैतिक चिकित्सा प्रतिबद्धता को और मजबूत किया है।',
      'index.legacy.successorBody2': 'उनके मार्गदर्शन में अस्पताल उन्नत उपचार, अद्यतन तकनीक और करुणामय सेवा के साथ निरंतर विकसित हो रहा है, साथ ही सामुदायिक कल्याण से गहराई से जुड़ा हुआ है। उनका नेतृत्व नवाचार और ईमानदारी का दुर्लभ संतुलन दर्शाता है, जिससे प्रत्येक रोगी को क्लिनिकल उत्कृष्टता के साथ मानवीय देखभाल भी सुनिश्चित होती है।',
      'index.legacy.successorImageAlt': 'Dr. Rajashekar G. Karudagimath',
      'index.legacy.successorTitle': 'दृष्टि को आगे बढ़ाते हुए: डॉ. राजशेखर जी. कारुडगीमठ',
      'index.legacy.title': 'विश्वसनीय सेवा की हमारी विरासत',
      'index.specialities.title': 'हमारी विशेषज्ञताएं',
      'index.whyUs.ambulance': 'एम्बुलेंस सेवा',
      'index.whyUs.communityTrust': 'समुदाय का विश्वास',
      'index.whyUs.emergency': '24/7 आपातकालीन सेवा',
      'index.whyUs.experiencedDoctors': 'अनुभवी डॉक्टर',
      'index.whyUs.structuredCare': 'संरचित रोगी देखभाल',
      'index.whyUs.title': 'हमें क्यों चुनें',
      'nav.contact': 'संपर्क',
      'nav.doctors': 'विभागीय डॉक्टर',
      'nav.legacy': 'विरासत',
      'nav.specialities': 'विशेषताएं',
      'speciality.generalMedicine': 'सामान्य चिकित्सा',
      'speciality.generalMedicine.desc': 'तीव्र और दीर्घकालिक रोगों की जांच और उपचार, समन्वित फॉलो-अप के साथ।',
      'speciality.generalSurgery': 'सामान्य शल्य चिकित्सा',
      'speciality.generalSurgery.desc': 'ऑपरेशन से पहले और बाद की देखभाल सहित सुरक्षित शल्य परामर्श और प्रक्रियाएं।',
      'speciality.obg': 'ओबीजी स्त्रीरोग',
      'speciality.obg.desc': 'एंटीनैटल, पोस्टनैटल और स्त्रीरोग देखभाल सहित महिलाओं के लिए समर्पित स्वास्थ्य सेवाएं।',
      'speciality.orthopaedics': 'ऑर्थोपेडिक्स',
      'speciality.orthopaedics.desc': 'हड्डी, जोड़ों और फ्रैक्चर की संपूर्ण देखभाल, पुनर्वास समर्थन के साथ।',
      'speciality.paediatrics': 'बाल रोग',
      'speciality.paediatrics.desc': 'विकास, नियमित बीमारी और रोकथाम के लिए संवेदनशील बाल स्वास्थ्य सेवा।',},
    kn: {
      'language.name.en': 'ಇಂಗ್ಲಿಷ್',
      'language.name.hi': 'ಹಿಂದಿ',
      'language.name.kn': 'ಕನ್ನಡ',
      'language.label': 'ಭಾಷೆ',
      'nav.callAmbulanceNow': 'ಈಗ ಆಂಬುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ',
      'nav.callNow': 'ಈಗ ಕರೆ ಮಾಡಿ',
      'meta.index.title': 'ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್ | ಬಾದಾಮಿ',
      'meta.index.description': 'ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್, ಬಾದಾಮಿ - 24/7 ತುರ್ತು ಮತ್ತು ಆಂಬುಲೆನ್ಸ್ ಸೇವೆಯೊಂದಿಗೆ ವಿಶ್ವಾಸಾರ್ಹ ಬಹು-ವಿಶೇಷ ಚಿಕಿತ್ಸಾ ಸೇವೆ.',
      'meta.appointment.title': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ | ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್',
      'meta.appointment.description': 'ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್‌ನಲ್ಲಿ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ.',
      'meta.complaint.title': 'ದೂರು ಸಲ್ಲಿಸಿ | ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್',
      'meta.complaint.description': 'ಆಸ್ಪತ್ರೆ ಸೇವೆ ಸುಧಾರಣೆಗೆ ದೂರು ಸಲ್ಲಿಸಿ.',
      'meta.admin.title': 'ಸಿಬ್ಬಂದಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | ಆಸ್ಪತ್ರೆ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವ್ಯವಸ್ಥೆ',
      'modal.title': 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'modal.subtitle': 'ಮುಂದುವರೆಯಲು ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      'modal.emergencyTitle': 'ತುರ್ತು ಆಂಬುಲೆನ್ಸ್',
      'modal.emergencyNote': 'ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ನೇರವಾಗಿ ಆಂಬುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಬಹುದು.',
      'modal.ambulance.en': 'Call Ambulance',
      'modal.ambulance.hi': 'एम्बुलेंस को कॉल करें',
      'modal.ambulance.kn': 'ಆಂಬುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ',
      'appointment.loadingDoctors': 'ವೈದ್ಯರ ಪಟ್ಟಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      'appointment.selectDoctorAndDateFirst': 'ಮೊದಲು ವೈದ್ಯರು ಮತ್ತು ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
      'appointment.selectDoctor': 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'appointment.selectDoctorFirst': 'ಮೊದಲು ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'appointment.selectAppointmentDateFirst': 'ಮೊದಲು ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'appointment.unavailableSelectedDate': 'ಆಯ್ಕೆ ಮಾಡಿದ ದಿನಾಂಕದಲ್ಲಿ ವೈದ್ಯರು ಲಭ್ಯರಿಲ್ಲ',
      'appointment.noScheduleForDoctor': 'ಆಯ್ಕೆ ಮಾಡಿದ ವೈದ್ಯರ ವೇಳಾಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ',
      'appointment.selectValidDate': 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
      'appointment.noAvailableSlots': 'ಲಭ್ಯ ಸಮಯ ಸ್ಲಾಟ್‌ಗಳು ಇಲ್ಲ',
      'appointment.selectAppointmentTime': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಸಮಯ ಆಯ್ಕೆಮಾಡಿ',
      'appointment.onCall': 'ಆನ್ ಕಾಲ್',
      'appointments.initError': 'ಬುಕಿಂಗ್ ಸೇವೆ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'appointments.loadDoctorsErrorInline': 'ವೈದ್ಯರ ಪಟ್ಟಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ',
      'appointments.loadDoctorsError': 'ಈಗ ವೈದ್ಯರ ಪಟ್ಟಿಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'appointments.formConfigError': 'ಫಾರ್ಮ್ ಸರಿಯಾಗಿ ಸಂರಚಿಸಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಹಾಯವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      'appointments.requiredFieldsError': 'ಸಲ್ಲಿಸುವ ಮೊದಲು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
      'appointments.unavailableDateError': 'ಆಯ್ಕೆ ಮಾಡಿದ ವೈದ್ಯರು ಈ ದಿನಾಂಕದಲ್ಲಿ ಲಭ್ಯರಿಲ್ಲ.',
      'appointments.success': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿನಂತಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಮ್ಮ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ದೃಢೀಕರಿಸುತ್ತದೆ.',
      'appointments.submitError': 'ನಿಮ್ಮ ವಿನಂತಿ ಸಲ್ಲಿಸುವಾಗ ದೋಷವಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'appointments.scheduleMissing': 'ಆಯ್ಕೆ ಮಾಡಿದ ವೈದ್ಯರ ವೇಳಾಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ.',
      'appointments.invalidDate': 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ.',
      'appointments.unavailableDay': 'ವೈದ್ಯರು {{day}} ರಂದು ಲಭ್ಯರಿಲ್ಲ.',
      'appointments.scheduleMissingLong': 'ಆಯ್ಕೆ ಮಾಡಿದ ವೈದ್ಯರ ವೇಳಾಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ. ಬೇರೆ ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಸಹಾಯವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      'appointments.invalidDateLong': 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ.',
      'appointments.unavailableDayLong': 'ಆಯ್ಕೆ ಮಾಡಿದ ವೈದ್ಯರು {{day}} ರಂದು ಲಭ್ಯರಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ದಿನ ಆಯ್ಕೆಮಾಡಿ.',
      'appointments.invalidTime': 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಸಮಯ ರೂಪದಲ್ಲಿ ನಮೂದಿಸಿ, ಉದಾಹರಣೆ: 10:30 AM ಅಥವಾ 14:30.',
      'appointments.timeOutsideSchedule': 'ಆಯ್ಕೆ ಮಾಡಿದ ವೈದ್ಯರು {{time}} ವೇಳೆಯಲ್ಲಿ ಲಭ್ಯರು. ದಯವಿಟ್ಟು ಅದೇ ವೇಳಾಪಟ್ಟಿಯೊಳಗೆ ಸಮಯ ಆಯ್ಕೆಮಾಡಿ.',
      'complaints.initError': 'ದೂರು ಸೇವೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'complaints.requiredFieldsError': 'ಸಲ್ಲಿಸುವ ಮೊದಲು ಎಲ್ಲಾ ಅಗತ್ಯ ಘಟನೆ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
      'complaints.success': 'ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು.',
      'complaints.submitError': 'ದೂರು ಸಲ್ಲಿಸುವಾಗ ಸಮಸ್ಯೆ ಉಂಟಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'admin.status.pending': 'ಬಾಕಿ',
      'admin.status.confirmed': 'ದೃಢೀಕೃತ',
      'admin.status.completed': 'ಪೂರ್ಣ',
      'admin.status.cancelled': 'ರದ್ದು',
      'admin.status.noShow': 'ಹಾಜರಾಗಿಲ್ಲ',
      'admin.complaintStatus.new': 'ಹೊಸದು',
      'admin.complaintStatus.investigating': 'ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ',
      'admin.complaintStatus.resolved': 'ಪರಿಹರಿಸಲಾಗಿದೆ',
      'admin.complaintStatus.rejected': 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
      'admin.dbUnavailable': 'ಡೇಟಾಬೇಸ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      'admin.enterCredentials': 'ದಯವಿಟ್ಟು ಬಳಕೆದಾರಹೆಸರು/ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ.',
      'admin.loggingIn': 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
      'admin.login': 'ಲಾಗಿನ್',
      'admin.onlyReception': 'ಮ್ಯಾನುಯಲ್ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ರಚಿಸಲು ಕೇವಲ ರಿಸೆಪ್ಶನಿಸ್ಟ್ ಖಾತೆಗಳಿಗೆ ಮಾತ್ರ ಅನುಮತಿ ಇದೆ.',
      'admin.fillRequired': 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
      'admin.manualCreated': 'ಮ್ಯಾನುಯಲ್ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ.',
      'admin.submitting': 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
      'admin.submit': 'ಸಲ್ಲಿಸಿ',
      'admin.staffLogin': 'ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್',
      'admin.doctorDashboard': 'ವೈದ್ಯರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'admin.managementDashboard': 'ನಿರ್ವಹಣಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'admin.receptionDashboard': 'ರಿಸೆಪ್ಶನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'admin.myAppointments': 'ನನ್ನ ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು',
      'admin.allDoctors': 'ಎಲ್ಲಾ ವೈದ್ಯರು',
      'admin.assignedDoctor': 'ನಿಯೋಜಿತ ವೈದ್ಯರು',
      'admin.selectDoctor': 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'admin.update': 'ನವೀಕರಿಸಿ',
      'admin.loginInvalid': 'ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ.',
      'admin.loginNotConfirmed': 'ಈ ಖಾತೆಯ ಇಮೇಲ್ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿಲ್ಲ.',
      'admin.loginNoRole': 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಿಸೆಪ್ಶನಿಸ್ಟ್, ವೈದ್ಯರು ಅಥವಾ ನಿರ್ವಹಣೆಯಾಗಿ ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ.',
      'admin.loginDoctorMissing': 'ವೈದ್ಯರ ಖಾತೆಗೆ ವೈದ್ಯರ ಪ್ರೊಫೈಲ್ ನಿಯೋಜಿಸಲ್ಪಟ್ಟಿಲ್ಲ.',
      'admin.loginUnavailable': 'ಈಗ ಲಾಗಿನ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'admin.onlyOwnAppointments': 'ನೀವು ನಿಮ್ಮದೇ ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳನ್ನು ಮಾತ್ರ ನವೀಕರಿಸಬಹುದು.',
      'admin.createAppointmentError': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'admin.anonymous': 'ಅನಾಮಧೇಯ',
      'admin.appointmentStatusAria': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಸ್ಥಿತಿ',
      'admin.complaintStatusAria': 'ದೂರು ಸ್ಥಿತಿ',
    
      'admin.allStatuses': 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',
      'admin.appointments': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು',
      'admin.appointmentsCaption': 'ಆಸ್ಪತ್ರೆ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಪಟ್ಟಿ',
      'admin.complaints': 'ದೂರುಗಳು',
      'admin.complaintsCaption': 'ಆಸ್ಪತ್ರೆ ದೂರು ಪಟ್ಟಿ',
      'admin.field.actions': 'ಕ್ರಿಯೆಗಳು',
      'admin.field.date': 'ದಿನಾಂಕ',
      'admin.field.details': 'ವಿವರ',
      'admin.field.doctor': 'ವೈದ್ಯರು',
      'admin.field.emailOrUsername': 'ಇಮೇಲ್ ಅಥವಾ ಬಳಕೆದಾರ ಹೆಸರು',
      'admin.field.nature': 'ಸ್ವರೂಪ',
      'admin.field.notes': 'ಟಿಪ್ಪಣಿ',
      'admin.field.occurredDate': 'ಘಟನೆ ದಿನಾಂಕ',
      'admin.field.occurredTime': 'ಘಟನೆ ಸಮಯ',
      'admin.field.password': 'ಪಾಸ್ವರ್ಡ್',
      'admin.field.patientName': 'ರೋಗಿಯ ಹೆಸರು',
      'admin.field.phone': 'ಫೋನ್',
      'admin.field.reportedAt': 'ವರದಿ ಸಮಯ',
      'admin.field.reporter': 'ವರದಿ ಮಾಡಿದವರು',
      'admin.field.source': 'ಮೂಲ',
      'admin.field.status': 'ಸ್ಥಿತಿ',
      'admin.field.time': 'ಸಮಯ',
      'admin.filters': 'ಫಿಲ್ಟರ್‌ಗಳು',
      'admin.logout': 'ಲಾಗ್ ಔಟ್',
      'admin.manualEntry': 'ಮ್ಯಾನುಯಲ್ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ನಮೂದು',
      'admin.pingManagement': 'ನಿರ್ವಹಣೆಗೆ ಸೂಚಿಸಿ',
      'admin.pingingManagement': 'ಅಲರ್ಟ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      'admin.pingManagementSuccess': 'ನಿರ್ವಹಣೆಗೆ ಸೂಚನೆ ಕಳುಹಿಸಲಾಗಿದೆ.',
      'admin.pingManagementError': 'ನಿರ್ವಹಣೆಗೆ ಸೂಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'admin.managementAlertLabel': 'ನಿರ್ವಹಣಾ ಅಲರ್ಟ್',
      'admin.managementAlertTitle': 'ರಿಸೆಪ್ಶನ್‌ಗೆ ನಿರ್ವಹಣಾ ಸಹಾಯ ಬೇಕಾಗಿದೆ',
      'admin.managementAlertBody': 'ರಿಸೆಪ್ಶನ್ ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ಗೆ ತಕ್ಷಣದ ಸಹಾಯವನ್ನು ಕೇಳಿದೆ.',
      'admin.managementAlertTime': 'ಕಳುಹಿಸಿದ ಸಮಯ',
      'admin.dismissAlert': 'ಮುಚ್ಚಿ',
      'admin.managementAlertHistory': 'ನಿರ್ವಹಣಾ ಅಲರ್ಟ್‌ಗಳು',
      'admin.managementAlertHistoryIntro': 'ರಿಸೆಪ್ಶನ್ ಪಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಿ ಮತ್ತು ಟಿಪ್ಪಣಿ ಇತಿಹಾಸವನ್ನು ಉಳಿಸಿ.',
      'admin.managementAlertHistoryCaption': 'ನಿರ್ವಹಣಾ ಅಲರ್ಟ್ ಇತಿಹಾಸ ಪಟ್ಟಿ',
      'admin.managementAlertColumn.alert': 'ಅಲರ್ಟ್',
      'admin.managementAlertColumn.sentAt': 'ಕಳುಹಿಸಿದ ಸಮಯ',
      'admin.managementAlertColumn.status': 'ಸ್ಥಿತಿ',
      'admin.managementAlertColumn.notes': 'ಟಿಪ್ಪಣಿಗಳು',
      'admin.managementAlertDetail': 'ಅಲರ್ಟ್ ವಿವರಗಳು',
      'admin.managementAlertTypeReceptionPing': 'ರಿಸೆಪ್ಶನ್ ಪಿಂಗ್',
      'admin.managementAlertStatusAria': 'ಅಲರ್ಟ್ ಸ್ಥಿತಿ',
      'admin.managementAlertStatus.new': 'ಹೊಸದು',
      'admin.managementAlertStatus.acknowledged': 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
      'admin.managementAlertStatus.inProgress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
      'admin.managementAlertStatus.resolved': 'ಪರಿಹರಿಸಲಾಗಿದೆ',
      'admin.managementAlertStatus.rejected': 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
      'admin.saveAlertStatus': 'ಸ್ಥಿತಿ ಉಳಿಸಿ',
      'admin.savingAlertStatus': 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      'admin.managementAlertStatusSaved': 'ಅಲರ್ಟ್ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.',
      'admin.managementAlertStatusError': 'ಈಗ ಅಲರ್ಟ್ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      'admin.managementAlertAddNote': 'ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
      'admin.addAlertNote': 'ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
      'admin.savingAlertNote': 'ಟಿಪ್ಪಣಿ ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      'admin.managementAlertNotes': 'ಟಿಪ್ಪಣಿ ಇತಿಹಾಸ',
      'admin.managementAlertNotesEmpty': 'ಇನ್ನೂ ಯಾವುದೇ ಟಿಪ್ಪಣಿ ಸೇರಿಸಲಾಗಿಲ್ಲ.',
      'admin.managementAlertCommentPlaceholder': 'ಈ ಅಲರ್ಟ್‌ಗೆ ಒಂದು ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
      'admin.managementAlertNoteRequired': 'ಉಳಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಟಿಪ್ಪಣಿ ನಮೂದಿಸಿ.',
      'admin.managementAlertNoteSaved': 'ಟಿಪ್ಪಣಿಯನ್ನು ಅಲರ್ಟ್ ಇತಿಹಾಸಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ.',
      'admin.managementAlertNoteError': 'ಈಗ ಈ ಟಿಪ್ಪಣಿಯನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      'admin.managementAlertLoadError': 'ಈಗ ನಿರ್ವಹಣಾ ಅಲರ್ಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      'admin.managementAlertHistoryEmpty': 'ಇನ್ನೂ ಯಾವುದೇ ನಿರ್ವಹಣಾ ಅಲರ್ಟ್‌ಗಳಿಲ್ಲ.',
      'admin.openAlert': 'ತೆರೆಯಿರಿ',
      'admin.you': 'ನೀವು',
      'admin.managementTeam': 'ನಿರ್ವಹಣೆ',
      'admin.staffDashboard': 'ಸಿಬ್ಬಂದಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'appointment.field.appointmentDate': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ದಿನಾಂಕ *',
      'appointment.field.appointmentTime': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಸಮಯ *',
      'appointment.field.email': 'ಇಮೇಲ್',
      'appointment.field.notes': 'ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)',
      'appointment.field.patientName': 'ರೋಗಿಯ ಹೆಸರು *',
      'appointment.field.phoneNumber': 'ಫೋನ್ ಸಂಖ್ಯೆ *',
      'appointment.field.selectDoctor': 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ *',
      'appointment.helpText': 'ನಾವು ಸಹಾಯಕ್ಕೆ ಇಲ್ಲಿ ಇದ್ದೇವೆ',
      'appointment.notesPlaceholder': 'ಲಕ್ಷಣಗಳು ಅಥವಾ ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿಯನ್ನು ಸೇರಿಸಿ',
      'appointment.pageIntro': 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ದೃಢೀಕರಣಕ್ಕಾಗಿ ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
      'appointment.pageTitle': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
      'appointment.submitRequest': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿನಂತಿ ಸಲ್ಲಿಸಿ',
      'common.allRightsReserved': 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      'common.bookAppointment': 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
      'common.brandHomeAria': 'Dr. R. G. Karudagimath Memorial Nursing Home home',
      'common.brandName': 'ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್',
      'common.callAmbulanceAria': 'ಈಗ ಆಂಬುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ',
      'common.daysLabel': 'ದಿನಗಳು:',
      'common.fileComplaint': 'ದೂರು ಸಲ್ಲಿಸಿ',
      'common.footerLogoAlt': 'Dr. R. G. Karudagimath Memorial Nursing Home footer logo',
      'common.home': 'ಮುಖಪುಟ',
      'common.hospitalNameBadami': 'ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್, ಬಾದಾಮಿ',
      'common.languageSelectorAria': 'ಭಾಷೆ ಆಯ್ಕೆ',
      'common.logoAlt': 'Dr. R. G. Karudagimath Memorial Nursing Home logo',
      'common.mainHeaderAria': 'ಮುಖ್ಯ ಶಿರೋಭಾಗ',
      'common.primaryNavigationAria': 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್',
      'common.skipToMain': 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
      'common.timeLabel': 'ಸಮಯ:',
      'complaint.category.billing': 'ಬಿಲ್ಲಿಂಗ್ ಸಮಸ್ಯೆ',
      'complaint.category.cleanliness': 'ಸ್ವಚ್ಛತೆ ಮತ್ತು ಹೈಜೀನ್',
      'complaint.category.clinicalConcern': 'ವೈದ್ಯಕೀಯ ಚಿಂತೆ',
      'complaint.category.facilities': 'ಸೌಲಭ್ಯ ಸಮಸ್ಯೆ',
      'complaint.category.other': 'ಇತರೆ',
      'complaint.category.select': 'ದೂರು ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ',
      'complaint.category.serviceDelay': 'ಸೇವೆಯಲ್ಲಿ ವಿಳಂಬ',
      'complaint.category.staffBehaviour': 'ಸಿಬ್ಬಂದಿ ವರ್ತನೆ',
      'complaint.detailsPlaceholder': 'ಏನು ನಡೆದಿದೆ, ಎಲ್ಲಿ ನಡೆದಿದೆ ಮತ್ತು ಯಾರು ಒಳಗೊಂಡಿದ್ದರು ಎಂಬುದನ್ನು ದಯವಿಟ್ಟು ವಿವರಿಸಿ.',
      'complaint.field.details': 'ದೂರು ವಿವರಗಳು *',
      'complaint.field.email': 'ಇಮೇಲ್ (ಐಚ್ಛಿಕ)',
      'complaint.field.incidentDate': 'ಘಟನೆ ನಡೆದ ದಿನಾಂಕ *',
      'complaint.field.incidentNature': 'ಘಟನೆ ಸ್ವರೂಪ *',
      'complaint.field.incidentTime': 'ಘಟನೆ ನಡೆದ ಸಮಯ *',
      'complaint.field.name': 'ಹೆಸರು (ಐಚ್ಛಿಕ)',
      'complaint.field.phone': 'ಫೋನ್ (ಐಚ್ಛಿಕ)',
      'complaint.pageIntro': 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಆಸ್ಪತ್ರೆ ನಿರ್ವಹಣೆಗೆ ರೋಗಿ ಆರೈಕೆಯನ್ನು ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ವೈಯಕ್ತಿಕ ವಿವರಗಳು ಐಚ್ಛಿಕ.',
      'complaint.pageTitle': 'ದೂರು ಸಲ್ಲಿಸಿ',
      'complaint.submit': 'ದೂರು ಸಲ್ಲಿಸಿ',
      'index.complaintCta.button': 'ಒಂದು ದೂರು ಸಲ್ಲಿಸಿ',
      'index.complaintCta.text': 'ನಿಮ್ಮ ಭೇಟಿ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ಸಮಸ್ಯೆ ಎದುರಾಯಿತೇ? ನಿಮ್ಮ ದೂರನ್ನು ನೇರವಾಗಿ ನಿರ್ವಹಣೆಗೆ ಹಂಚಿಕೊಳ್ಳಿ.',
      'index.complaintCta.title': 'ಆರೈಕೆಯನ್ನು ಸುಧಾರಿಸಲು ನಮಗೆ ಸಹಕರಿಸಿ',
      'index.contact.ambulanceLabel': 'ಆಂಬುಲೆನ್ಸ್ (24/7):',
      'index.contact.emergencyLabel': 'ತುರ್ತು:',
      'index.contact.emergencyValue': '24/7 ಲಭ್ಯ',
      'index.contact.mapAria': 'ಆಸ್ಪತ್ರೆ ಸ್ಥಳದ ನಕ್ಷೆ',
      'index.contact.mapTitle': 'ಡಾ. ಆರ್. ಜಿ. ಕಾರುಡಗಿಮಠ ಮೆಮೋರಿಯಲ್ ನರ್ಸಿಂಗ್ ಹೋಮ್‌ನ ಸ್ಥಳವನ್ನು ತೋರಿಸುವ ನಕ್ಷೆ',
      'index.contact.phoneLabel': 'ಫೋನ್:',
      'index.contact.title': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      'index.contact.whatsappAction': 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ',
      'index.contact.whatsappLabel': 'ವಾಟ್ಸಾಪ್:',
      'index.doctors.title': 'ನಮ್ಮ ವೈದ್ಯರು',
      'index.doctors.name.vinayak': 'ಡಾ. ವಿನಾಯಕ ಮುಗಳಖೋಡ',
      'index.doctors.name.ajay': 'ಡಾ. ಅಜಯ್ ಟಿ. ನಾಯಕ್',
      'index.doctors.name.santoshDesai': 'ಡಾ. ಸಂತೋಷ್ ಬಿ. ದೇಸಾಯಿ',
      'index.doctors.name.revanasiddappa': 'ಡಾ. ಬಿ.ಎಚ್. ರೇವಣಸಿದ್ದಪ್ಪ',
      'index.doctors.name.kirankumar': 'ಡಾ. ಕಿರಣಕುಮಾರ ಎಸ್. ಕುಲಗೇರಿ',
      'index.doctors.name.jayant': 'ಡಾ. ಜಯಂತ ಕುಮಾರ್',
      'index.doctors.name.pradeep': 'ಡಾ. ಪ್ರದೀಪ್ ನಂದಿ',
      'index.doctors.name.abhinandan': 'ಡಾ. ಅಭಿನಂದನ್ ಬಿ.',
      'index.doctors.name.santoshMalashetti': 'ಡಾ. ಸಂತೋಷ ಮಲಶೆಟ್ಟಿ',
      'index.doctors.name.anirudh': 'ಡಾ. ಅನಿರುದ್ಧ ಎ. ಮಲ್ಲಾಪುರ',
      'index.doctors.name.vinod': 'ಡಾ. ವಿನೋದ ಅಕ್ಕಸಾಲಿ',
      'index.doctors.name.tohid': 'ಡಾ. ತೋಹಿದ ಖಾಜಿ',
      'index.doctors.speciality.mdMedicine': 'ಎಂ.ಡಿ. ಮೆಡಿಸಿನ್',
      'index.doctors.speciality.mdsDental': 'ಎಂ.ಡಿ.ಎಸ್ ಡೆಂಟಲ್',
      'index.doctors.speciality.ophthalmology': 'ಆಫ್ತಾಲ್ಮಾಲಜಿ',
      'index.doctors.speciality.physiotherapist': 'ಫಿಸಿಯೋಥೆರಪಿಸ್ಟ್',
      'index.doctors.speciality.ent': 'ಇಎನ್‌ಟಿ',
      'index.doctors.speciality.skinVd': 'ಸ್ಕಿನ್ ಮತ್ತು ವಿ.ಡಿ.',
      'index.doctors.speciality.psychiatry': 'ಸೈಕಿಯಾಟ್ರಿ',
      'index.doctors.speciality.anaesthesiology': 'ಅನಸ್ಥೀಸಿಯಾಲಜಿ',
      'index.founder.caption': 'ಸ್ಥಾಪಕರು: ಡಾ. ಜಿ. ಬಿ. ಕಾರುಡಗಿಮಠ',
      'index.founderImageAlt': 'ಸ್ಥಾಪಕರು ಡಾ. ಜಿ. ಬಿ. ಕಾರುಡಗಿಮಠ',
      'index.hero.eyebrow': 'ಬಾದಾಮಿ, ಕರ್ನಾಟಕ',
      'index.hero.lead': 'ಪೀಳಿಗೆಗಳಿಂದ ಆರೋಗ್ಯ ಸೇವೆಯಲ್ಲಿ ನಂಬಿಕೆಯ ಹೆಸರಾಗಿ, ನಮ್ಮ ಸಮುದಾಯದ ಪ್ರತಿಯೊಂದು ಕುಟುಂಬಕ್ಕೂ ಸಂಯೋಜಿತ, ಸುರಕ್ಷಿತ ಮತ್ತು ಕರುಣೆಯ ಆರೈಕೆ ನೀಡುತ್ತಿದೆ.',
      'index.legacy.founderBody': 'ಡಾ. ಜಿ. ಬಿ. ಕಾರುಡಗಿಮಠರು ವಿಶ್ವಾಸಾರ್ಹ, ನೈತಿಕ ಮತ್ತು ರೋಗಿ-ಕೇಂದ್ರೀಕೃತ ಚಿಕಿತ್ಸೆಯ ದೃಷ್ಟಿಯಿಂದ ಈ ಆಸ್ಪತ್ರೆಯನ್ನು ಸ್ಥಾಪಿಸಿದರು. ಬಲವಾದ ಮೌಲ್ಯಗಳು ಮತ್ತು ದಶಕಗಳ ವೈದ್ಯಕೀಯ ಅನುಭವದ ಆಧಾರದಲ್ಲಿ ಅವರು ಕರುಣೆ, ಶಿಸ್ತು ಮತ್ತು ಕ್ಲಿನಿಕಲ್ ಶ್ರೇಷ್ಠತೆಯ ಮೇಲೆ ನಿಂತ ಸಂಸ್ಥೆಯ ಅಡಿಪಾಯ ಹಾಕಿದರು. ಸಂಯೋಜಿತ ಚಿಕಿತ್ಸೆ, ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಮಾನವೀಯ ಸೇವೆಯ ಮೇಲಿನ ಅವರ ಬದ್ಧತೆ ಇಂದು ಕೂಡ ಆಸ್ಪತ್ರೆಯ ಮಾನದಂಡಗಳನ್ನು ರೂಪಿಸುತ್ತಿದೆ. ಸಮುದಾಯಕ್ಕೆ ವಿಶ್ವಾಸ, ಮಾನ ಮತ್ತು ಸಮರ್ಪಣೆಯೊಂದಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುವುದು ಅವರ ದೃಷ್ಟಿಯ ಕೇಂದ್ರವಾಗಿದೆ.',
      'index.legacy.founderImageAlt': 'Dr. G. B. Karudagimath, founder of the hospital',
      'index.legacy.successorBody1': 'ಡಾ. ರಾಜಶೇಖರ ಜಿ. ಕಾರುಡಗಿಮಠರು ಒಂದು ಶ್ರೇಷ್ಠ ವೈದ್ಯಕೀಯ ಪರಂಪರೆಯ ನಿರಂತರತೆಯನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತಾರೆ. ಡಾ. ಜಿ. ಬಿ. ಕಾರುಡಗಿಮಠ ಮಲ್ಟಿಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆಯ ದ್ವಿತೀಯ ತಲೆಮಾರಿನ ನಾಯಕತ್ವವಾಗಿ ಅವರು ಆಧುನಿಕ ವೈದ್ಯಕೀಯ ಪರಿಣತಿಯನ್ನು ಸಂಸ್ಥೆಯ ಶಾಶ್ವತ ಮೌಲ್ಯಗಳೊಂದಿಗೆ ಸಮನ್ವಯಗೊಳಿಸಿದ್ದಾರೆ. ಪ್ರಗತಿಪರ ದೃಷ್ಟಿಕೋನ ಮತ್ತು ರೋಗಿ-ಕೇಂದ್ರೀಕೃತ ಆರೈಕೆಯ ಗೌರವದಿಂದ ಅವರು ಆಸ್ಪತ್ರೆಯ ವಿಶ್ವಾಸ, ಸುರಕ್ಷತೆ ಮತ್ತು ನೈತಿಕ ವೈದ್ಯಕೀಯ ಬದ್ಧತೆಯನ್ನು ಮತ್ತಷ್ಟು ಬಲಪಡಿಸಿದ್ದಾರೆ.',
      'index.legacy.successorBody2': 'ಅವರ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಸುಧಾರಿತ ಚಿಕಿತ್ಸೆ, ನವೀಕೃತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಕರುಣೆಯ ಸೇವೆಯೊಂದಿಗೆ ನಿರಂತರವಾಗಿ ಬೆಳೆಯುತ್ತಿದ್ದು, ಸಮುದಾಯ ಕಲ್ಯಾಣದ ಬೇರುಗಳಿಗೆ ಬದ್ಧವಾಗಿದೆ. ಅವರ ನಾಯಕತ್ವವು ನವೀನತೆ ಮತ್ತು ಪ್ರಾಮಾಣಿಕತೆಯ ಅಪರೂಪದ ಸಮತೋಲನವನ್ನು ತೋರಿಸುತ್ತದೆ, ಇದರಿಂದ ಪ್ರತಿಯೊಬ್ಬ ರೋಗಿಗೂ ಕ್ಲಿನಿಕಲ್ ಶ್ರೇಷ್ಠತೆಯ ಜೊತೆಗೆ ಮಾನವೀಯ ಆರೈಕೆ ದೊರಕುತ್ತದೆ.',
      'index.legacy.successorImageAlt': 'Dr. Rajashekar G. Karudagimath',
      'index.legacy.successorTitle': 'ದೃಷ್ಟಿಯನ್ನು ಮುಂದುವರಿಸುತ್ತಾ: ಡಾ. ರಾಜಶೇಖರ ಜಿ. ಕಾರುಡಗಿಮಠ',
      'index.legacy.title': 'ವಿಶ್ವಾಸಾರ್ಹ ಆರೈಕೆಯ ನಮ್ಮ ಪರಂಪರೆ',
      'index.specialities.title': 'ನಮ್ಮ ವಿಶೇಷತೆಗಳು',
      'index.whyUs.ambulance': 'ಆಂಬುಲೆನ್ಸ್ ಸೇವೆ',
      'index.whyUs.communityTrust': 'ಸಮುದಾಯದ ವಿಶ್ವಾಸ',
      'index.whyUs.emergency': '24/7 ತುರ್ತು ಸೇವೆ',
      'index.whyUs.experiencedDoctors': 'ಅನುಭವಸಂಪನ್ನ ವೈದ್ಯರು',
      'index.whyUs.structuredCare': 'ಸಂಯೋಜಿತ ರೋಗಿ ಆರೈಕೆ',
      'index.whyUs.title': 'ನಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆಮಾಡಬೇಕು',
      'nav.contact': 'ಸಂಪರ್ಕ',
      'nav.doctors': 'ವೈದ್ಯರು',
      'nav.legacy': 'ಪಾರಂಪರ್ಯ',
      'nav.specialities': 'ವಿಶೇಷತೆಗಳು',
      'speciality.generalMedicine': 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ',
      'speciality.generalMedicine.desc': 'ತುರ್ತು ಮತ್ತು ದೀರ್ಘಕಾಲದ ಸಮಸ್ಯೆಗಳ ನಿರ್ಣಯ ಮತ್ತು ಚಿಕಿತ್ಸೆ, ಸಮನ್ವಿತ ಮುಂದುವರಿದ ಆರೈಕೆಯೊಂದಿಗೆ.',
      'speciality.generalSurgery': 'ಸಾಮಾನ್ಯ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
      'speciality.generalSurgery.desc': 'ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಪೂರ್ವ ಮತ್ತು ನಂತರದ ಆರೈಕೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ಸಲಹೆ ಮತ್ತು ಚಿಕಿತ್ಸೆಗಳು.',
      'speciality.obg': 'ಒಬಿಜಿ ಸ್ತ್ರೀರೋಗ',
      'speciality.obg.desc': 'ಗರ್ಭಾವಸ್ಥೆ ಪೂರ್ವ, ನಂತರದ ಮತ್ತು ಸ್ತ್ರೀರೋಗ ಸೇವೆಗಳನ್ನು ಒಳಗೊಂಡ ಮಹಿಳಾ ಆರೋಗ್ಯ ಸೇವೆಗಳು.',
      'speciality.orthopaedics': 'ಅಸ್ಥಿ ಚಿಕಿತ್ಸೆ',
      'speciality.orthopaedics.desc': 'ಎಲುಬು, ಸಂಧಿ ಮತ್ತು ಮುರಿತಗಳ ಸಮಗ್ರ ಚಿಕಿತ್ಸೆ, ಪುನರ್ವಸತಿ ಬೆಂಬಲದೊಂದಿಗೆ.',
      'speciality.paediatrics': 'ಮಕ್ಕಳ ವೈದ್ಯಕೀಯ',
      'speciality.paediatrics.desc': 'ಬೆಳವಣಿಗೆ, ಸಾಮಾನ್ಯ ಅನಾರೋಗ್ಯ ಮತ್ತು ತಡೆಗಟ್ಟುವಿಕೆಗಾಗಿ ಕರುಣೆಯ ಮಕ್ಕಳ ಆರೈಕೆ.',}
  };

  const KEY_DEFAULTS = {};
  let currentLanguage = DEFAULT_LANGUAGE;
  let hasStoredPreference = false;

  function getLanguage() {
    return currentLanguage;
  }

  function getLocale() {
    return LOCALE_MAP[currentLanguage] || LOCALE_MAP.en;
  }

  function normalizeLanguage(language) {
    const value = String(language || '').trim().toLowerCase();
    return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
  }

  function safeGetSavedLanguage() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        hasStoredPreference = false;
        return DEFAULT_LANGUAGE;
      }

      const normalizedSaved = String(saved).trim().toLowerCase();
      const isSupported = SUPPORTED_LANGUAGES.includes(normalizedSaved);

      hasStoredPreference = isSupported;
      return isSupported ? normalizedSaved : DEFAULT_LANGUAGE;
    } catch (error) {
      hasStoredPreference = false;
      return DEFAULT_LANGUAGE;
    }
  }

  function safeSaveLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
      hasStoredPreference = true;
    } catch (error) {
      // Ignore storage failures and keep runtime state only.
    }
  }

  function formatTemplate(template, vars) {
    return String(template || '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
      if (!vars || vars[key] === undefined || vars[key] === null) {
        return '';
      }

      return String(vars[key]);
    });
  }

  function rememberKeyDefault(key, fallbackText) {
    const normalizedKey = String(key || '').trim();
    const normalizedFallback = String(fallbackText || '').trim();

    if (!normalizedKey || !normalizedFallback) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(KEY_DEFAULTS, normalizedKey)) {
      KEY_DEFAULTS[normalizedKey] = normalizedFallback;
    }
  }

  function t(key, vars, fallbackText) {
    const languagePack = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    const fallbackPack = TRANSLATIONS.en;
    const rememberedFallback = KEY_DEFAULTS[key] || fallbackText || '';

    const hasLanguageTemplate = Object.prototype.hasOwnProperty.call(languagePack, key);
    let template = hasLanguageTemplate ? languagePack[key] : fallbackPack[key];

    if (template === undefined) {
      template = rememberedFallback || key;
    }

    return formatTemplate(template, vars);
  }

  function applyKeyedTranslations(root) {
    const scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (!key) {
        return;
      }

      const defaultText = (element.getAttribute('data-i18n-default') || element.textContent || '').trim();
      rememberKeyDefault(key, defaultText);
      element.textContent = t(key, undefined, defaultText);
    });

    scope.querySelectorAll('[data-i18n-attr]').forEach((element) => {
      const instruction = element.getAttribute('data-i18n-attr');
      if (!instruction) {
        return;
      }

      instruction.split('|').forEach((pair) => {
        const parts = pair.split(':');
        if (parts.length !== 2) {
          return;
        }

        const attributeName = parts[0].trim();
        const key = parts[1].trim();

        if (!attributeName || !key) {
          return;
        }

        const defaultValue = element.getAttribute(attributeName) || '';
        rememberKeyDefault(key, defaultValue);
        element.setAttribute(attributeName, t(key, undefined, defaultValue));
      });
    });
  }

  function applyMetaTranslations() {
    const pathname = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    let prefix = 'index';

    if (pathname.endsWith('/appointment.html')) {
      prefix = 'appointment';
    } else if (pathname.endsWith('/complaint.html')) {
      prefix = 'complaint';
    } else if (pathname.endsWith('/admin.html')) {
      prefix = 'admin';
    }

    const titleKey = `meta.${prefix}.title`;
    const descriptionKey = `meta.${prefix}.description`;

    document.title = t(titleKey);

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && TRANSLATIONS.en[descriptionKey]) {
      metaDescription.setAttribute('content', t(descriptionKey));
    }
  }

  function refreshLanguageSelectors() {
    const selectors = document.querySelectorAll('[data-language-selector]');

    selectors.forEach((selectElement) => {
      if (!(selectElement instanceof HTMLSelectElement)) {
        return;
      }

      const parentElement = selectElement.parentElement;
      const labelElement = parentElement ? parentElement.querySelector('[data-language-label]') : null;
      if (labelElement) {
        labelElement.textContent = `${t('language.label')}:`;
      }

      Array.from(selectElement.options).forEach((option) => {
        if (option.value === 'en') {
          option.textContent = t('language.name.en');
        }

        if (option.value === 'hi') {
          option.textContent = t('language.name.hi');
        }

        if (option.value === 'kn') {
          option.textContent = t('language.name.kn');
        }
      });

      selectElement.value = currentLanguage;
    });
  }

  function applyLanguage(root) {
    document.documentElement.setAttribute('lang', currentLanguage);
    applyKeyedTranslations(root || document);
    applyMetaTranslations();
    refreshLanguageSelectors();
  }

  function closeLanguageModal() {
    const modal = document.getElementById('language-modal');
    if (!modal) {
      return;
    }

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('language-modal-open');
  }

  function openLanguageModal() {
    const modal = document.getElementById('language-modal');
    if (!modal) {
      return;
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('language-modal-open');
  }

  function setLanguage(language, options) {
    const normalizedLanguage = normalizeLanguage(language);
    const shouldPersist = !options || options.persist !== false;

    currentLanguage = normalizedLanguage;

    if (shouldPersist) {
      safeSaveLanguage(normalizedLanguage);
      closeLanguageModal();
    }

    applyLanguage(document);

    window.dispatchEvent(new CustomEvent('app:language-changed', {
      detail: {
        language: normalizedLanguage,
        locale: getLocale()
      }
    }));
  }

  function buildLanguageModal() {
    if (document.getElementById('language-modal')) {
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'language-modal';
    modal.className = 'language-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = [
      '<div class="language-modal__backdrop" data-language-choice-backdrop></div>',
      '<div class="language-modal__card">',
      '  <h2 data-i18n="modal.title"></h2>',
      '  <p class="language-modal__subtitle" data-i18n="modal.subtitle"></p>',
      '  <div class="language-modal__options">',
      '    <button type="button" class="language-modal__lang-button" data-language-choice="en">English</button>',
      '    <button type="button" class="language-modal__lang-button" data-language-choice="hi">हिन्दी</button>',
      '    <button type="button" class="language-modal__lang-button" data-language-choice="kn">ಕನ್ನಡ</button>',
      '  </div>',
      '  <div class="language-modal__emergency">',
      '    <h3 data-i18n="modal.emergencyTitle"></h3>',
      '    <p data-i18n="modal.emergencyNote"></p>',
      '    <div class="language-modal__emergency-actions">',
      '      <a href="tel:+919740978768" class="button button--small button--emergency" data-i18n="modal.ambulance.en"></a>',
      '      <a href="tel:+919740978768" class="button button--small button--emergency" data-i18n="modal.ambulance.hi"></a>',
      '      <a href="tel:+919740978768" class="button button--small button--emergency" data-i18n="modal.ambulance.kn"></a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(modal);

    modal.querySelectorAll('[data-language-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        const language = button.getAttribute('data-language-choice') || DEFAULT_LANGUAGE;
        setLanguage(language, { persist: true });
      });
    });
  }

  function bindLanguageSelectors() {
    document.querySelectorAll('[data-language-selector]').forEach((selectElement) => {
      if (!(selectElement instanceof HTMLSelectElement)) {
        return;
      }

      selectElement.addEventListener('change', () => {
        setLanguage(selectElement.value, { persist: true });
      });
    });
  }

  function initialize() {
    currentLanguage = safeGetSavedLanguage();
    buildLanguageModal();
    bindLanguageSelectors();
    applyLanguage(document);

    if (!hasStoredPreference) {
      openLanguageModal();
    }
  }

  window.siteI18n = {
    t,
    getLanguage,
    getLocale,
    setLanguage,
    applyLanguage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

