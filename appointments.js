document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_DOCTOR_SCHEDULES = [
    { name: 'Dr. Vinayak Mugalakhod', days: 'Mon - Sat', time: '12:00pm to 4:00pm' },
    { name: 'Dr. Ajay T. Naik', days: 'Mon - Sat', time: '12:00pm to 4:00pm and 7:00pm to 9:00pm' },
    { name: 'Dr. Santosh B. Desai', days: 'Mon - Sat', time: '12:00pm to 4:00pm and 7:00pm to 9:00pm' },
    { name: 'Dr. B.H.Revanasiddappa', days: 'Mon-Thu & Sat', time: 'On Call' },
    { name: 'Dr. Kirankumar S. Kulageri', days: 'Mon-Sat', time: 'On Call' },
    { name: 'Dr. Jayant Kumar', days: 'Mon-Sat', time: '6:00pm - 9:00pm' },
    { name: 'Dr. Pradeep Nandi', days: 'Mon-Sat', time: '12:00pm to 6:00pm' },
    { name: 'Dr. Abhinandan B.', days: 'Mon-Sat', time: '11:00am to 3:00pm and 6:00pm to 8:00pm' },
    { name: 'Dr Santosh Malashetti', days: 'Wed', time: '6:00pm -8:00pm' },
    { name: 'Dr. Anirudh A Mallapur', days: 'Sun', time: '11:00am to 3:00pm' },
    { name: 'Dr. Vinod Akkasali', days: 'Every Second Sunday', time: '2:00pm to 5:00pm' },
    { name: 'Dr. Tohid Kazi', days: 'Mon-Sat', time: 'On Call' }
  ];

  let scheduleLookup = new Map();

  const form = document.getElementById('appointment-form');
  const doctorSelect = document.getElementById('doctor') || document.getElementById('doctor_id');
  const patientNameInput = document.getElementById('patient-name') || document.getElementById('patient_name');
  const patientPhoneInput = document.getElementById('patient-phone') || document.getElementById('patient_phone');
  const appointmentDateInput = document.getElementById('appointment-date') || document.getElementById('appointment_date');
  const appointmentTimeInput = document.getElementById('appointment-time') || document.getElementById('appointment_time');
  const notesInput = document.getElementById('notes');
  const formMessage = document.getElementById('form-message');

  const supabaseClient =
    (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient) ||
    (window.supabase && typeof window.supabase.from === 'function' && window.supabase) ||
    (window.supabase && window.supabase.client && typeof window.supabase.client.from === 'function' && window.supabase.client) ||
    null;

  if (!form) {
    return;
  }

  if (!doctorSelect) {
    console.error('Doctor dropdown element is missing from the appointment page.');
    return;
  }

  if (!supabaseClient) {
    showMessage('Unable to initialize booking service. Please try again later.', 'error');
    console.error('Supabase client is not available on window.supabase.');
    return;
  }

  initializeDateInputState();
  initializeTimeDropdown();

  bootstrap();
  form.addEventListener('submit', handleSubmit);

  doctorSelect.addEventListener('change', () => {
    applyDateConstraintsForSelectedDoctor();
    refreshAvailableTimeOptions();
  });

  if (appointmentDateInput) {
    appointmentDateInput.addEventListener('change', () => {
      enforceDateRuleForSelectedDoctor();
      refreshAvailableTimeOptions();
    });

    appointmentDateInput.addEventListener('input', () => {
      enforceDateRuleForSelectedDoctor();
    });
  }

  async function bootstrap() {
    const schedules = await loadDoctorSchedulesFromExcel();
    updateScheduleLookup(Array.isArray(schedules) && schedules.length ? schedules : DEFAULT_DOCTOR_SCHEDULES);
    await loadDoctors();
    applyDateConstraintsForSelectedDoctor();
    refreshAvailableTimeOptions();
  }

  async function loadDoctors() {
    setDoctorLoadingState();

    try {
      const { data, error } = await supabaseClient
        .from('doctors')
        .select('id, name, speciality')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      populateDoctorOptions(Array.isArray(data) ? data : []);
      applyDateConstraintsForSelectedDoctor();
      refreshAvailableTimeOptions();
    } catch (error) {
      console.error('Error loading doctors:', error);
      doctorSelect.innerHTML = '';

      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Unable to load doctors';
      doctorSelect.appendChild(option);

      showMessage('Unable to load doctors right now. Please refresh and try again.', 'error');
    }
  }

  async function loadDoctorSchedulesFromExcel() {
    if (!window.XLSX) {
      console.warn('SheetJS library is not available. Falling back to default doctor schedules.');
      return [];
    }

    try {
      const response = await fetch('DrSchedules.xlsx', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load DrSchedules.xlsx: ${response.status}`);
      }

      const fileBuffer = await response.arrayBuffer();
      const workbook = window.XLSX.read(fileBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        return [];
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = window.XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      return rows
        .map((row) => {
          const name = String(row['Dr name'] ?? row['Doctor Name'] ?? row['Doctor'] ?? '').trim();
          const days = String(row['Days available'] ?? row['Days'] ?? '').trim();
          const time = String(row['Time available'] ?? row['Time'] ?? '').trim();

          if (!name || !days || !time) {
            return null;
          }

          return { name, days, time };
        })
        .filter(Boolean);
    } catch (error) {
      console.error('Error loading doctor schedules from DrSchedules.xlsx:', error);
      return [];
    }
  }

  function updateScheduleLookup(schedules) {
    scheduleLookup = new Map(
      schedules.map((schedule) => [normalizeDoctorName(schedule.name), schedule])
    );
  }

  function initializeDateInputState() {
    if (!appointmentDateInput) {
      return;
    }

    appointmentDateInput.value = '';
    appointmentDateInput.disabled = true;
    appointmentDateInput.min = formatDateForInput(new Date());
    appointmentDateInput.setCustomValidity('');
  }

  function applyDateConstraintsForSelectedDoctor() {
    if (!appointmentDateInput) {
      return;
    }

    const hasDoctor = Boolean(doctorSelect.value);
    appointmentDateInput.disabled = !hasDoctor;
    appointmentDateInput.min = formatDateForInput(new Date());

    if (!hasDoctor) {
      appointmentDateInput.value = '';
      appointmentDateInput.setCustomValidity('');
      return;
    }

    enforceDateRuleForSelectedDoctor();
  }

  function enforceDateRuleForSelectedDoctor() {
    if (!appointmentDateInput || !appointmentDateInput.value || !doctorSelect.value) {
      return true;
    }

    const selectedDoctorOption = doctorSelect.options[doctorSelect.selectedIndex];
    const selectedDoctorName =
      selectedDoctorOption?.dataset?.doctorName ||
      selectedDoctorOption?.textContent ||
      '';
    const schedule = scheduleLookup.get(normalizeDoctorName(selectedDoctorName));

    if (!schedule) {
      appointmentDateInput.setCustomValidity('Schedule not available for selected doctor.');
      return false;
    }

    const date = new Date(`${appointmentDateInput.value}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      appointmentDateInput.setCustomValidity('Please select a valid appointment date.');
      return false;
    }

    if (!isDateAllowedByRule(date, schedule.days)) {
      appointmentDateInput.setCustomValidity(`Doctor is unavailable on ${formatDayName(date)}.`);
      return false;
    }

    appointmentDateInput.setCustomValidity('');
    return true;
  }

  function initializeTimeDropdown() {
    if (!appointmentTimeInput) {
      return;
    }

    appointmentTimeInput.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Select doctor and date first';
    appointmentTimeInput.appendChild(option);
  }

  function setDoctorLoadingState() {
    doctorSelect.innerHTML = '';

    const loadingOption = document.createElement('option');
    loadingOption.value = '';
    loadingOption.textContent = 'Loading doctors...';
    doctorSelect.appendChild(loadingOption);
  }

  function populateDoctorOptions(doctors) {
    doctorSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select Doctor';
    doctorSelect.appendChild(placeholderOption);

    doctors.forEach((doctor) => {
      const option = document.createElement('option');
      option.value = String(doctor.id ?? '');

      const name = (doctor.name || '').trim();
      const speciality = (doctor.speciality || '').trim();
      option.textContent = speciality ? `${name} - ${speciality}` : name;
      option.dataset.doctorName = name;

      doctorSelect.appendChild(option);
    });
  }

  function refreshAvailableTimeOptions() {
    if (!appointmentTimeInput) {
      return;
    }

    const selectedDoctorOption = doctorSelect.options[doctorSelect.selectedIndex];
    const selectedDoctorName =
      selectedDoctorOption?.dataset?.doctorName ||
      selectedDoctorOption?.textContent ||
      '';
    const appointmentDate = appointmentDateInput ? appointmentDateInput.value : '';

    appointmentTimeInput.innerHTML = '';

    if (!doctorSelect.value) {
      appendTimePlaceholder('Select doctor first');
      return;
    }

    if (!appointmentDate) {
      appendTimePlaceholder('Select appointment date first');
      return;
    }

    if (!enforceDateRuleForSelectedDoctor()) {
      appendTimePlaceholder('Doctor unavailable on selected date');
      return;
    }

    const schedule = scheduleLookup.get(normalizeDoctorName(selectedDoctorName));
    if (!schedule) {
      appendTimePlaceholder('No schedule available for selected doctor');
      return;
    }

    const date = new Date(`${appointmentDate}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      appendTimePlaceholder('Select a valid appointment date');
      return;
    }

    if (!isDateAllowedByRule(date, schedule.days)) {
      appendTimePlaceholder('Doctor unavailable on selected date');
      return;
    }

    if (/on\s*call/i.test(schedule.time)) {
      const onCallOption = document.createElement('option');
      onCallOption.value = 'On Call';
      onCallOption.textContent = 'On Call';
      appointmentTimeInput.appendChild(onCallOption);
      return;
    }

    const timeRanges = parseTimeRanges(schedule.time);
    const slots = buildTimeSlots(timeRanges, 30);

    if (!slots.length) {
      appendTimePlaceholder('No available time slots');
      return;
    }

    appendTimePlaceholder('Select Appointment Time');

    slots.forEach((minutes) => {
      const timeLabel = formatMinutesTo12Hour(minutes);
      const option = document.createElement('option');
      option.value = timeLabel;
      option.textContent = timeLabel;
      appointmentTimeInput.appendChild(option);
    });
  }

  function appendTimePlaceholder(text) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = text;
    appointmentTimeInput.appendChild(option);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearMessage();

    if (!patientNameInput || !patientPhoneInput || !appointmentDateInput || !appointmentTimeInput) {
      console.error('One or more required form input elements are missing for submission.');
      showMessage('Form is not configured correctly. Please contact support.', 'error');
      return;
    }

    const patient_name = patientNameInput.value.trim();
    const patient_phone = patientPhoneInput.value.trim();
    const doctor_id = doctorSelect.value;
    const appointment_date = appointmentDateInput.value;
    const appointment_time = appointmentTimeInput.value.trim();
    const notes = notesInput ? notesInput.value.trim() : '';
    const selectedDoctorName =
      doctorSelect.options[doctorSelect.selectedIndex]?.dataset?.doctorName ||
      doctorSelect.options[doctorSelect.selectedIndex]?.textContent ||
      '';

    if (!patient_name || !patient_phone || !doctor_id || !appointment_date || !appointment_time) {
      showMessage('Please fill all required fields before submitting.', 'error');
      return;
    }

    if (appointmentDateInput && !enforceDateRuleForSelectedDoctor()) {
      showMessage(appointmentDateInput.validationMessage || 'Selected doctor is unavailable on this date.', 'error');
      return;
    }

    const scheduleValidation = validateDoctorSchedule(selectedDoctorName, appointment_date, appointment_time);
    if (!scheduleValidation.isValid) {
      showMessage(scheduleValidation.message, 'error');
      return;
    }

    try {
      const payload = {
        patient_name,
        patient_phone,
        doctor_id,
        appointment_date,
        appointment_time,
        notes
      };

      const { error } = await supabaseClient.from('appointments').insert(payload);

      if (error) {
        throw error;
      }

      showMessage('Appointment request submitted. Our team will confirm shortly.', 'success');
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error submitting appointment:', error);
      showMessage('Something went wrong while submitting your request. Please try again.', 'error');
    }
  }

  function showMessage(message, type) {
    if (!formMessage) {
      return;
    }

    formMessage.textContent = message;
    formMessage.style.color = type === 'success' ? '#1f7a1f' : '#c62828';
  }

  function clearMessage() {
    if (!formMessage) {
      return;
    }

    formMessage.textContent = '';
    formMessage.style.color = '';
  }

  function validateDoctorSchedule(doctorName, appointmentDate, appointmentTime) {
    const normalizedName = normalizeDoctorName(doctorName);
    const schedule = scheduleLookup.get(normalizedName);

    if (!schedule) {
      return {
        isValid: false,
        message: 'Selected doctor schedule is not available. Please choose another doctor or contact support.'
      };
    }

    const date = new Date(`${appointmentDate}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      return {
        isValid: false,
        message: 'Please choose a valid appointment date.'
      };
    }

    if (!isDateAllowedByRule(date, schedule.days)) {
      return {
        isValid: false,
        message: `Selected doctor is unavailable on ${formatDayName(date)}. Please choose another day.`
      };
    }

    if (/on\s*call/i.test(schedule.time)) {
      return { isValid: true, message: '' };
    }

    const requestedTimeInMinutes = parseTimeToMinutes(appointmentTime);
    if (requestedTimeInMinutes === null) {
      return {
        isValid: false,
        message: 'Please enter time in a valid format, for example: 10:30 AM or 14:30.'
      };
    }

    const timeRanges = parseTimeRanges(schedule.time);
    const isWithinAnyRange = timeRanges.some((range) => {
      return requestedTimeInMinutes >= range.start && requestedTimeInMinutes <= range.end;
    });

    if (!isWithinAnyRange) {
      return {
        isValid: false,
        message: `Selected doctor is available at ${schedule.time}. Please choose a time within schedule.`
      };
    }

    return { isValid: true, message: '' };
  }

  function normalizeDoctorName(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  function buildTimeSlots(ranges, stepMinutes) {
    const slots = [];

    ranges.forEach((range) => {
      for (let minute = range.start; minute <= range.end; minute += stepMinutes) {
        slots.push(minute);
      }
    });

    return Array.from(new Set(slots)).sort((left, right) => left - right);
  }

  function formatMinutesTo12Hour(totalMinutes) {
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = ((hours24 + 11) % 12) + 1;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  function isDateAllowedByRule(date, dayRule) {
    const normalizedRule = String(dayRule || '').trim();
    const dayIndex = date.getDay();

    if (/every\s+second\s+sunday/i.test(normalizedRule)) {
      const weekOfMonth = Math.floor((date.getDate() - 1) / 7) + 1;
      return dayIndex === 0 && weekOfMonth === 2;
    }

    const allowedDays = parseAllowedDays(normalizedRule);
    return allowedDays.has(dayIndex);
  }

  function parseAllowedDays(dayRule) {
    const dayMap = {
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      sun: 0
    };

    const cleanedRule = dayRule
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/&/g, ',')
      .replace(/and/g, ',');

    const tokens = cleanedRule.split(',').filter(Boolean);
    const allowed = new Set();

    tokens.forEach((token) => {
      if (token.includes('-')) {
        const [startToken, endToken] = token.split('-');
        const start = dayMap[startToken.slice(0, 3)];
        const end = dayMap[endToken.slice(0, 3)];

        if (typeof start === 'number' && typeof end === 'number') {
          if (start <= end) {
            for (let index = start; index <= end; index += 1) {
              allowed.add(index);
            }
          } else {
            for (let index = start; index <= 6; index += 1) {
              allowed.add(index);
            }

            for (let index = 0; index <= end; index += 1) {
              allowed.add(index);
            }
          }
        }

        return;
      }

      const mappedDay = dayMap[token.slice(0, 3)];
      if (typeof mappedDay === 'number') {
        allowed.add(mappedDay);
      }
    });

    return allowed;
  }

  function parseTimeRanges(timeRule) {
    return String(timeRule || '')
      .split(/\s+and\s+/i)
      .map((part) => part.trim())
      .map((part) => part.replace(/\s*-\s*/g, ' to '))
      .map((part) => {
        const [startText, endText] = part.split(/\s+to\s+/i).map((text) => text.trim());
        const start = parseTimeToMinutes(startText);
        const end = parseTimeToMinutes(endText);
        return { start, end };
      })
      .filter((range) => range.start !== null && range.end !== null && range.end >= range.start);
  }

  function parseTimeToMinutes(value) {
    const text = String(value || '').trim().toLowerCase();
    if (!text) {
      return null;
    }

    const twelveHourMatch = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
    if (twelveHourMatch) {
      let hours = Number(twelveHourMatch[1]);
      const minutes = Number(twelveHourMatch[2] || '0');
      const meridiem = twelveHourMatch[3].toLowerCase();

      if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        return null;
      }

      if (meridiem === 'pm' && hours !== 12) {
        hours += 12;
      }

      if (meridiem === 'am' && hours === 12) {
        hours = 0;
      }

      return (hours * 60) + minutes;
    }

    const twentyFourHourMatch = text.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHourMatch) {
      const hours = Number(twentyFourHourMatch[1]);
      const minutes = Number(twentyFourHourMatch[2]);

      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
      }

      return (hours * 60) + minutes;
    }

    return null;
  }

  function formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  function formatDateForInput(date) {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  }
});
