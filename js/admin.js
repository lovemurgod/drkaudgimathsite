document.addEventListener('DOMContentLoaded', () => {
  const SESSION_KEY = 'admin_session';

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const supabaseClient =
    (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient) ||
    (window.supabase && typeof window.supabase.from === 'function' && window.supabase) ||
    (window.supabase && window.supabase.client && typeof window.supabase.client.from === 'function' && window.supabase.client) ||
    null;

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const loginMessage = document.getElementById('login-message');

  const logoutButton = document.getElementById('logout-button');

  const filterDateInput = document.getElementById('filter-date');
  const filterDoctorSelect = document.getElementById('filter-doctor');
  const filterStatusSelect = document.getElementById('filter-status');

  const appointmentsTableBody = document.getElementById('appointments-table-body');
  const appointmentRowTemplate = document.getElementById('appointment-row-template');

  const manualForm = document.getElementById('manual-appointment-form');
  const manualPatientNameInput = document.getElementById('manual-patient-name');
  const manualPhoneInput = document.getElementById('manual-phone');
  const manualDoctorSelect = document.getElementById('manual-doctor');
  const manualDateInput = document.getElementById('manual-date');
  const manualTimeInput = document.getElementById('manual-time');
  const manualNotesInput = document.getElementById('manual-notes');
  const manualSubmitButton = document.getElementById('manual-submit');

  let manualFormMessage = document.getElementById('manual-form-message');
  if (!manualFormMessage && manualForm) {
    manualFormMessage = document.createElement('p');
    manualFormMessage.id = 'manual-form-message';
    manualFormMessage.setAttribute('role', 'status');
    manualFormMessage.setAttribute('aria-live', 'polite');
    manualForm.appendChild(manualFormMessage);
  }

  let dashboardInitialized = false;

  if (!supabaseClient) {
    if (loginMessage) {
      loginMessage.textContent = 'Unable to connect to the database.';
    }
    return;
  }

  bindEvents();
  restoreSessionOnLoad();

  function bindEvents() {
    if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }

    if (filterDateInput) {
      filterDateInput.addEventListener('change', () => {
        loadAppointments();
      });
    }

    if (filterDoctorSelect) {
      filterDoctorSelect.addEventListener('change', () => {
        loadAppointments();
      });
    }

    if (filterStatusSelect) {
      filterStatusSelect.addEventListener('change', () => {
        loadAppointments();
      });
    }

    if (appointmentsTableBody) {
      appointmentsTableBody.addEventListener('click', handleAppointmentAction);
    }

    if (manualForm) {
      manualForm.addEventListener('submit', handleManualAppointmentSubmit);
    }
  }

  function restoreSessionOnLoad() {
    const sessionRaw = localStorage.getItem(SESSION_KEY);

    if (!sessionRaw) {
      showLoginView();
      return;
    }

    showDashboardView();
    initializeDashboard();
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    clearLoginMessage();

    const email = (emailInput?.value || '').trim();
    const password = passwordInput?.value || '';

    if (!email || !password) {
      setLoginMessage('Please enter email and password.');
      return;
    }

    try {
      const matchedAdmin = await authenticateAdmin(email, password);

      if (!matchedAdmin) {
        setLoginMessage('Invalid email or password.');
        return;
      }

      const sessionData = {
        admin_id: matchedAdmin.id,
        email: matchedAdmin.email,
        login_at: new Date().toISOString()
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      showDashboardView();
      initializeDashboard();
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Unable to login right now. Please try again.');
    }
  }

  async function authenticateAdmin(email, password) {
    const normalizedEmail = normalizeEmail(email);
    const attempts = [
      { emailColumn: 'email', passwordColumn: 'password', idColumn: 'id' },
      { emailColumn: 'admin_email', passwordColumn: 'admin_password', idColumn: 'admin_id' },
      { emailColumn: 'email', passwordColumn: 'admin_password', idColumn: 'id' },
      { emailColumn: 'admin_email', passwordColumn: 'password', idColumn: 'admin_id' }
    ];

    for (const attempt of attempts) {
      const result = await tryAdminLookup(normalizedEmail, password, attempt);

      if (result.success && result.admin) {
        return result.admin;
      }

      if (result.fatalError) {
        throw result.fatalError;
      }
    }

    return null;
  }

  async function tryAdminLookup(email, password, attempt) {
    try {
      const { data, error } = await supabaseClient
        .from('admins')
        .select('*')
        .limit(50);

      if (error) {
        const code = String(error.code || '');
        const message = String(error.message || '').toLowerCase();
        const isMissingColumn = code === '42703' || message.includes('column') || message.includes('does not exist');

        if (isMissingColumn) {
          return { success: false, admin: null, fatalError: null };
        }

        return { success: false, admin: null, fatalError: error };
      }

      const rows = Array.isArray(data) ? data : [];

      const matchedRow = rows.find((row) => {
        const rowEmail = normalizeEmail(row?.[attempt.emailColumn]);
        const rowPassword = String(row?.[attempt.passwordColumn] ?? '');
        return rowEmail === email && rowPassword === password;
      });

      if (!matchedRow) {
        return { success: true, admin: null, fatalError: null };
      }

      const idValue = matchedRow?.[attempt.idColumn] ?? matchedRow?.id ?? matchedRow?.admin_id ?? null;
      const emailValue = String(matchedRow?.[attempt.emailColumn] ?? matchedRow?.email ?? matchedRow?.admin_email ?? email).trim();

      return {
        success: true,
        admin: {
          id: idValue,
          email: emailValue
        },
        fatalError: null
      };
    } catch (error) {
      return { success: false, admin: null, fatalError: error };
    }
  }

  async function initializeDashboard() {
    if (dashboardInitialized) {
      await loadAppointments();
      return;
    }

    await loadDoctors();
    await loadAppointments();
    dashboardInitialized = true;
  }

  async function loadDoctors() {
    try {
      const { data, error } = await supabaseClient
        .from('doctors')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      const doctors = Array.isArray(data) ? data : [];
      populateDoctorFilters(doctors);
      populateManualDoctorDropdown(doctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  }

  function populateDoctorFilters(doctors) {
    if (!filterDoctorSelect) {
      return;
    }

    filterDoctorSelect.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Doctors';
    filterDoctorSelect.appendChild(allOption);

    doctors.forEach((doctor) => {
      const option = document.createElement('option');
      option.value = String(doctor.id);
      option.textContent = doctor.name || '';
      filterDoctorSelect.appendChild(option);
    });
  }

  function populateManualDoctorDropdown(doctors) {
    if (!manualDoctorSelect) {
      return;
    }

    manualDoctorSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select Doctor';
    manualDoctorSelect.appendChild(placeholderOption);

    doctors.forEach((doctor) => {
      const option = document.createElement('option');
      option.value = String(doctor.id);
      option.textContent = doctor.name || '';
      manualDoctorSelect.appendChild(option);
    });
  }

  async function loadAppointments() {
    try {
      let query = supabaseClient
        .from('appointments')
        .select('id, patient_name, patient_phone, doctor_id, appointment_date, appointment_time, status, source, doctors(name)')
        .order('appointment_date', { ascending: false });

      const selectedDate = filterDateInput?.value || '';
      const selectedDoctor = filterDoctorSelect?.value || '';
      const selectedStatus = filterStatusSelect?.value || '';

      if (selectedDate) {
        query = query.eq('appointment_date', selectedDate);
      }

      if (selectedDoctor) {
        query = query.eq('doctor_id', selectedDoctor);
      }

      if (selectedStatus) {
        query = query.ilike('status', mapStatusToDb(selectedStatus));
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const appointments = Array.isArray(data) ? data : [];
      renderAppointments(appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      renderAppointments([]);
    }
  }

  function renderAppointments(appointments) {
    if (!appointmentsTableBody) {
      return;
    }

    appointmentsTableBody.innerHTML = '';

    appointments.forEach((appointment) => {
      const row = buildAppointmentRow(appointment);
      appointmentsTableBody.appendChild(row);
    });
  }

  function buildAppointmentRow(appointment) {
    let row;

    if (appointmentRowTemplate && 'content' in appointmentRowTemplate) {
      const fragment = appointmentRowTemplate.content.cloneNode(true);
      row = fragment.querySelector('tr');
    }

    if (!row) {
      row = document.createElement('tr');

      const nameCell = document.createElement('td');
      const phoneCell = document.createElement('td');
      const doctorCell = document.createElement('td');
      const dateCell = document.createElement('td');
      const timeCell = document.createElement('td');
      const statusCell = document.createElement('td');
      const sourceCell = document.createElement('td');
      const actionsCell = document.createElement('td');

      const statusSelect = document.createElement('select');
      statusSelect.name = 'row-status';
      statusSelect.setAttribute('aria-label', 'Appointment Status');
      STATUS_OPTIONS.forEach((statusOption) => {
        const option = document.createElement('option');
        option.value = statusOption.value;
        option.textContent = statusOption.label;
        statusSelect.appendChild(option);
      });

      const updateButton = document.createElement('button');
      updateButton.type = 'button';
      updateButton.setAttribute('data-action', 'update-status');
      updateButton.textContent = 'Update';

      statusCell.appendChild(statusSelect);
      actionsCell.appendChild(updateButton);

      row.appendChild(nameCell);
      row.appendChild(phoneCell);
      row.appendChild(doctorCell);
      row.appendChild(dateCell);
      row.appendChild(timeCell);
      row.appendChild(statusCell);
      row.appendChild(sourceCell);
      row.appendChild(actionsCell);

      nameCell.dataset.field = 'patient-name';
      phoneCell.dataset.field = 'phone';
      doctorCell.dataset.field = 'doctor';
      dateCell.dataset.field = 'date';
      timeCell.dataset.field = 'time';
      sourceCell.dataset.field = 'source';
    }

    row.dataset.appointmentId = String(appointment.id);

    const patientNameCell = row.querySelector('[data-field="patient-name"]');
    const phoneCell = row.querySelector('[data-field="phone"]');
    const doctorCell = row.querySelector('[data-field="doctor"]');
    const dateCell = row.querySelector('[data-field="date"]');
    const timeCell = row.querySelector('[data-field="time"]');
    const sourceCell = row.querySelector('[data-field="source"]');
    const statusSelect = row.querySelector('select[name="row-status"]');

    if (patientNameCell) {
      patientNameCell.textContent = appointment.patient_name || '';
    }

    if (phoneCell) {
      phoneCell.textContent = appointment.patient_phone || '';
    }

    if (doctorCell) {
      doctorCell.textContent = resolveDoctorName(appointment) || '';
    }

    if (dateCell) {
      dateCell.textContent = appointment.appointment_date || '';
    }

    if (timeCell) {
      timeCell.textContent = appointment.appointment_time || '';
    }

    if (sourceCell) {
      sourceCell.textContent = appointment.source || '';
    }

    if (statusSelect) {
      statusSelect.value = mapStatusToValue(appointment.status || 'Pending');
    }

    return row;
  }

  async function handleAppointmentAction(event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action !== 'update-status') {
      return;
    }

    const row = target.closest('tr');
    if (!row) {
      return;
    }

    const appointmentId = row.dataset.appointmentId;
    const statusSelect = row.querySelector('select[name="row-status"]');
    const statusValue = statusSelect?.value || '';

    if (!appointmentId || !statusValue) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('appointments')
        .update({ status: mapStatusToDb(statusValue) })
        .eq('id', appointmentId);

      if (error) {
        throw error;
      }

      await loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  }

  async function handleManualAppointmentSubmit(event) {
    event.preventDefault();
    setManualFormMessage('');

    const patientName = (manualPatientNameInput?.value || '').trim();
    const phone = (manualPhoneInput?.value || '').trim();
    const doctorId = manualDoctorSelect?.value || '';
    const date = manualDateInput?.value || '';
    const time = manualTimeInput?.value || '';
    const notes = (manualNotesInput?.value || '').trim();

    if (!patientName || !phone || !doctorId || !date || !time) {
      setManualFormMessage('Please fill all required fields.', 'error');
      return;
    }

    if (manualSubmitButton) {
      manualSubmitButton.disabled = true;
      manualSubmitButton.textContent = 'Submitting...';
    }

    try {
      const payload = {
        patient_name: patientName,
        patient_phone: phone,
        doctor_id: doctorId,
        appointment_date: date,
        appointment_time: time,
        notes,
        source: 'Phone'
      };

      const { error } = await supabaseClient.from('appointments').insert(payload);

      if (error) {
        throw error;
      }

      manualForm.reset();
      await loadAppointments();
      setManualFormMessage('Manual appointment created successfully.', 'success');
    } catch (error) {
      console.error('Error creating manual appointment:', error);
      const message = String(error?.message || 'Unable to create appointment. Please try again.');
      setManualFormMessage(message, 'error');
    } finally {
      if (manualSubmitButton) {
        manualSubmitButton.disabled = false;
        manualSubmitButton.textContent = 'Submit';
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    showLoginView();

    if (loginForm) {
      loginForm.reset();
    }

    if (manualForm) {
      manualForm.reset();
    }

    clearLoginMessage();
  }

  function showLoginView() {
    if (loginView) {
      loginView.hidden = false;
    }

    if (dashboardView) {
      dashboardView.hidden = true;
    }
  }

  function showDashboardView() {
    if (loginView) {
      loginView.hidden = true;
    }

    if (dashboardView) {
      dashboardView.hidden = false;
    }
  }

  function setLoginMessage(message) {
    if (loginMessage) {
      loginMessage.textContent = message;
    }
  }

  function clearLoginMessage() {
    if (loginMessage) {
      loginMessage.textContent = '';
    }
  }

  function setManualFormMessage(message, type) {
    if (!manualFormMessage) {
      return;
    }

    manualFormMessage.textContent = message;

    if (!message) {
      manualFormMessage.style.color = '';
      return;
    }

    manualFormMessage.style.color = type === 'success' ? '#1f7a1f' : '#b71f1f';
  }

  function mapStatusToDb(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    if (normalizedValue === 'no-show' || normalizedValue === 'no show') {
      return 'No Show';
    }

    if (!normalizedValue) {
      return 'Pending';
    }

    return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
  }

  function normalizeEmail(value) {
    return String(value ?? '').trim().toLowerCase();
  }

  function mapStatusToValue(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    if (normalizedValue === 'no show') {
      return 'no-show';
    }

    if (normalizedValue === 'no-show') {
      return 'no-show';
    }

    if (!normalizedValue) {
      return 'pending';
    }

    return normalizedValue;
  }

  function resolveDoctorName(appointment) {
    if (appointment?.doctors && typeof appointment.doctors.name === 'string') {
      return appointment.doctors.name;
    }

    if (appointment?.doctor && typeof appointment.doctor.name === 'string') {
      return appointment.doctor.name;
    }

    return '';
  }
});
