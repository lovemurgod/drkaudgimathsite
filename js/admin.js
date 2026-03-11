document.addEventListener('DOMContentLoaded', () => {
  const STAFF_ROLES = {
    RECEPTIONIST: 'receptionist',
    DOCTOR: 'doctor',
    MANAGEMENT: 'management'
  };
  const USERNAME_EMAIL_DOMAIN = 'staff.local';

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const COMPLAINT_STATUS_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const supabaseClient =
    (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient) ||
    (window.supabase && typeof window.supabase.from === 'function' && window.supabase) ||
    (window.supabase && window.supabase.client && typeof window.supabase.client.from === 'function' && window.supabase.client) ||
    null;

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginTitle = document.getElementById('login-title');
  const dashboardTitle = document.getElementById('dashboard-title');

  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const loginMessage = document.getElementById('login-message');

  const logoutButton = document.getElementById('logout-button');

  const filterDateInput = document.getElementById('filter-date');
  const filterDoctorSelect = document.getElementById('filter-doctor');
  const filterStatusSelect = document.getElementById('filter-status');
  const filtersSection = document.getElementById('filters-section');
  const appointmentsSection = document.getElementById('appointments-section');

  const appointmentsTableBody = document.getElementById('appointments-table-body');
  const appointmentRowTemplate = document.getElementById('appointment-row-template');

  const complaintsSection = document.getElementById('complaints-section');
  const complaintsTableBody = document.getElementById('complaints-table-body');
  const complaintRowTemplate = document.getElementById('complaint-row-template');

  const manualForm = document.getElementById('manual-appointment-form');
  const manualEntrySection = document.getElementById('manual-entry');
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
  let currentStaffProfile = null;

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

    if (complaintsTableBody) {
      complaintsTableBody.addEventListener('click', handleComplaintAction);
    }

    if (manualForm) {
      manualForm.addEventListener('submit', handleManualAppointmentSubmit);
    }
  }

  async function restoreSessionOnLoad() {
    try {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        throw error;
      }

      const session = data?.session || null;

      if (!session) {
        showLoginView();
        applyRoleUiState();
        return;
      }

      await startAuthenticatedSession(session);
    } catch (error) {
      console.error('Session restore error:', error);
      await supabaseClient.auth.signOut();
      currentStaffProfile = null;
      dashboardInitialized = false;
      showLoginView();
      applyRoleUiState();
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    clearLoginMessage();

    const loginIdentifier = (emailInput?.value || '').trim();
    const email = resolveAuthEmail(loginIdentifier);
    const password = passwordInput?.value || '';

    if (!loginIdentifier || !password) {
      setLoginMessage('Please enter username/email and password.');
      return;
    }

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = 'Logging in...';
    }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      const session = data?.session || null;

      if (!session) {
        throw new Error('Unable to start a login session.');
      }

      await startAuthenticatedSession(session);

      if (loginForm) {
        loginForm.reset();
      }
    } catch (error) {
      console.error('Login error:', error);
      await supabaseClient.auth.signOut();
      currentStaffProfile = null;
      dashboardInitialized = false;
      setLoginMessage(resolveLoginErrorMessage(error));
      showLoginView();
      applyRoleUiState();
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }
    }
  }

  async function startAuthenticatedSession(session) {
    const user = session?.user || null;

    if (!user?.id) {
      throw new Error('Unable to load authenticated user.');
    }

    const staffProfile = await loadStaffProfile(user.id);

    currentStaffProfile = staffProfile;
    dashboardInitialized = false;

    applyRoleUiState();
    showDashboardView();
    await initializeDashboard();
  }

  async function loadStaffProfile(userId) {
    const { data, error } = await supabaseClient
      .from('staff_profiles')
      .select('role, doctor_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Your account is not assigned as receptionist, doctor, or management.');
    }

    const role = normalizeRole(data.role);
    const doctorId = String(data.doctor_id ?? '').trim();

    if (!role) {
      throw new Error('Your account role is invalid. Contact support.');
    }

    if (role === STAFF_ROLES.DOCTOR && !doctorId) {
      throw new Error('Doctor account is missing an assigned doctor profile.');
    }

    return {
      role,
      doctorId
    };
  }

  async function initializeDashboard() {
    if (dashboardInitialized) {
      if (isManagementRole()) {
        await loadComplaints();
      } else {
        await loadAppointments();
      }
      return;
    }

    if (isManagementRole()) {
      await loadComplaints();
      dashboardInitialized = true;
      return;
    }

    await loadDoctors();
    await loadAppointments();
    dashboardInitialized = true;
  }

  async function loadDoctors() {
    try {
      let query = supabaseClient
        .from('doctors')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (isDoctorRole() && currentStaffProfile?.doctorId) {
        query = query.eq('id', currentStaffProfile.doctorId);
      }

      const { data, error } = await query;

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

    if (isDoctorRole()) {
      let hasAssignedDoctor = false;

      doctors.forEach((doctor) => {
        const option = document.createElement('option');
        option.value = String(doctor.id);
        option.textContent = doctor.name || '';
        filterDoctorSelect.appendChild(option);

        if (String(doctor.id) === String(currentStaffProfile?.doctorId || '')) {
          hasAssignedDoctor = true;
        }
      });

      if (!hasAssignedDoctor && currentStaffProfile?.doctorId) {
        const fallbackOption = document.createElement('option');
        fallbackOption.value = String(currentStaffProfile.doctorId);
        fallbackOption.textContent = 'My Appointments';
        filterDoctorSelect.appendChild(fallbackOption);
      }

      filterDoctorSelect.value = String(currentStaffProfile?.doctorId || '');
      filterDoctorSelect.disabled = true;
      return;
    }

    filterDoctorSelect.disabled = false;

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

    if (isDoctorRole()) {
      const doctor = doctors[0] || null;
      const option = document.createElement('option');
      option.value = String(currentStaffProfile?.doctorId || '');
      option.textContent = doctor?.name || 'Assigned Doctor';
      manualDoctorSelect.appendChild(option);
      manualDoctorSelect.value = String(currentStaffProfile?.doctorId || '');
      manualDoctorSelect.disabled = true;
      return;
    }

    manualDoctorSelect.disabled = false;

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
    if (isManagementRole()) {
      renderAppointments([]);
      return;
    }

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

      if (isDoctorRole() && currentStaffProfile?.doctorId) {
        query = query.eq('doctor_id', currentStaffProfile.doctorId);
      } else if (selectedDoctor) {
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
    row.dataset.doctorId = String(appointment.doctor_id ?? '');

    const patientNameCell = row.querySelector('[data-field="patient-name"]');
    const phoneCell = row.querySelector('[data-field="phone"]');
    const doctorCell = row.querySelector('[data-field="doctor"]');
    const dateCell = row.querySelector('[data-field="date"]');
    const timeCell = row.querySelector('[data-field="time"]');
    const sourceCell = row.querySelector('[data-field="source"]');
    const statusSelect = row.querySelector('select[name="row-status"]');
    const updateButton = row.querySelector('button[data-action="update-status"]');

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

    if (statusSelect && isDoctorRole()) {
      statusSelect.disabled = String(appointment.doctor_id ?? '') !== String(currentStaffProfile?.doctorId || '');
    }

    if (updateButton && isDoctorRole()) {
      updateButton.disabled = String(appointment.doctor_id ?? '') !== String(currentStaffProfile?.doctorId || '');
    }

    return row;
  }

  async function handleAppointmentAction(event) {
    if (isManagementRole()) {
      return;
    }

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
    const rowDoctorId = row.dataset.doctorId || '';
    const statusSelect = row.querySelector('select[name="row-status"]');
    const statusValue = statusSelect?.value || '';

    if (!appointmentId || !statusValue) {
      return;
    }

    if (isDoctorRole() && String(currentStaffProfile?.doctorId || '') !== String(rowDoctorId)) {
      return;
    }

    try {
      let mutation = supabaseClient
        .from('appointments')
        .update({ status: mapStatusToDb(statusValue) })
        .eq('id', appointmentId);

      if (isDoctorRole() && currentStaffProfile?.doctorId) {
        mutation = mutation.eq('doctor_id', currentStaffProfile.doctorId);
      }

      const { data, error } = await mutation.select('id');

      if (error) {
        throw error;
      }

      if (isDoctorRole() && (!Array.isArray(data) || data.length === 0)) {
        throw new Error('You can update only your own appointments.');
      }

      await loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  }

  async function handleManualAppointmentSubmit(event) {
    event.preventDefault();
    setManualFormMessage('');

    if (!isReceptionistRole()) {
      setManualFormMessage('Only receptionist accounts can create manual appointments.', 'error');
      return;
    }

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

  async function handleLogout() {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }

    currentStaffProfile = null;
    dashboardInitialized = false;
    showLoginView();
    applyRoleUiState();

    renderAppointments([]);
    renderComplaints([]);

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

  function applyRoleUiState() {
    const isDoctor = isDoctorRole();
    const isManagement = isManagementRole();

    if (loginTitle) {
      loginTitle.textContent = 'Staff Login';
    }

    if (dashboardTitle) {
      if (isDoctor) {
        dashboardTitle.textContent = 'Doctor Dashboard';
      } else if (isManagement) {
        dashboardTitle.textContent = 'Management Dashboard';
      } else {
        dashboardTitle.textContent = 'Reception Dashboard';
      }
    }

    if (manualEntrySection) {
      manualEntrySection.hidden = isDoctor || isManagement;
    }

    if (filtersSection) {
      filtersSection.hidden = isManagement;
    }

    if (appointmentsSection) {
      appointmentsSection.hidden = isManagement;
    }

    if (complaintsSection) {
      complaintsSection.hidden = !isManagement;
    }
  }

  function normalizeRole(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    if (normalizedValue === STAFF_ROLES.RECEPTIONIST) {
      return STAFF_ROLES.RECEPTIONIST;
    }

    if (normalizedValue === STAFF_ROLES.DOCTOR) {
      return STAFF_ROLES.DOCTOR;
    }

    if (normalizedValue === STAFF_ROLES.MANAGEMENT) {
      return STAFF_ROLES.MANAGEMENT;
    }

    return '';
  }

  function isDoctorRole() {
    return currentStaffProfile?.role === STAFF_ROLES.DOCTOR;
  }

  function isReceptionistRole() {
    return currentStaffProfile?.role === STAFF_ROLES.RECEPTIONIST;
  }

  function isManagementRole() {
    return currentStaffProfile?.role === STAFF_ROLES.MANAGEMENT;
  }

  function resolveLoginErrorMessage(error) {
    const message = String(error?.message || '').toLowerCase();

    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password.';
    }

    if (message.includes('email not confirmed')) {
      return 'Email is not confirmed for this account.';
    }

    if (message.includes('not assigned as receptionist, doctor, or management')) {
      return 'Your account is not assigned as receptionist, doctor, or management.';
    }

    if (message.includes('missing an assigned doctor profile')) {
      return 'Doctor account is missing assigned doctor profile.';
    }

    return 'Unable to login right now. Please try again.';
  }

  function resolveAuthEmail(identifier) {
    const normalizedIdentifier = String(identifier || '').trim().toLowerCase();

    if (!normalizedIdentifier) {
      return '';
    }

    if (normalizedIdentifier.includes('@')) {
      return normalizedIdentifier;
    }

    const username = normalizedIdentifier.replace(/[^a-z0-9]/g, '');
    return `${username}@${USERNAME_EMAIL_DOMAIN}`;
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

  async function loadComplaints() {
    if (!isManagementRole()) {
      renderComplaints([]);
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('complaints')
        .select('id, reporter_name, reporter_phone, reporter_email, incident_date, incident_time, incident_nature, incident_details, status, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      renderComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading complaints:', error);
      renderComplaints([]);
    }
  }

  function renderComplaints(complaints) {
    if (!complaintsTableBody) {
      return;
    }

    complaintsTableBody.innerHTML = '';

    complaints.forEach((complaint) => {
      const row = buildComplaintRow(complaint);
      complaintsTableBody.appendChild(row);
    });
  }

  function buildComplaintRow(complaint) {
    let row;

    if (complaintRowTemplate && 'content' in complaintRowTemplate) {
      const fragment = complaintRowTemplate.content.cloneNode(true);
      row = fragment.querySelector('tr');
    }

    if (!row) {
      row = document.createElement('tr');
    }

    row.dataset.complaintId = String(complaint.id ?? '');

    const incidentDateCell = row.querySelector('[data-field="incident-date"]');
    const incidentTimeCell = row.querySelector('[data-field="incident-time"]');
    const incidentNatureCell = row.querySelector('[data-field="incident-nature"]');
    const incidentDetailsCell = row.querySelector('[data-field="incident-details"]');
    const reporterCell = row.querySelector('[data-field="reporter"]');
    const reportedAtCell = row.querySelector('[data-field="reported-at"]');
    const statusSelect = row.querySelector('select[name="complaint-status"]');
    const updateButton = row.querySelector('button[data-action="update-complaint-status"]');

    if (incidentDateCell) {
      incidentDateCell.textContent = complaint.incident_date || '';
    }

    if (incidentTimeCell) {
      incidentTimeCell.textContent = formatIncidentTime(complaint.incident_time);
    }

    if (incidentNatureCell) {
      incidentNatureCell.textContent = complaint.incident_nature || '';
    }

    if (incidentDetailsCell) {
      incidentDetailsCell.textContent = complaint.incident_details || '';
    }

    if (reporterCell) {
      reporterCell.textContent = buildReporterText(complaint);
    }

    if (reportedAtCell) {
      reportedAtCell.textContent = formatReportedAt(complaint.created_at);
    }

    if (statusSelect) {
      statusSelect.value = mapComplaintStatusToValue(complaint.status || 'New');
      statusSelect.disabled = !isManagementRole();
    }

    if (updateButton) {
      updateButton.disabled = !isManagementRole();
    }

    return row;
  }

  async function handleComplaintAction(event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action !== 'update-complaint-status') {
      return;
    }

    if (!isManagementRole()) {
      return;
    }

    const row = target.closest('tr');
    if (!row) {
      return;
    }

    const complaintId = row.dataset.complaintId;
    const statusSelect = row.querySelector('select[name="complaint-status"]');
    const statusValue = statusSelect?.value || '';

    if (!complaintId || !statusValue) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('complaints')
        .update({
          status: mapComplaintStatusToDb(statusValue),
          updated_at: new Date().toISOString()
        })
        .eq('id', complaintId);

      if (error) {
        throw error;
      }

      await loadComplaints();
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  }

  function mapComplaintStatusToDb(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    const matchedStatus = COMPLAINT_STATUS_OPTIONS.find((statusOption) => statusOption.value === normalizedValue);
    if (!matchedStatus) {
      return 'New';
    }

    return matchedStatus.label;
  }

  function mapComplaintStatusToValue(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    if (!normalizedValue) {
      return 'new';
    }

    const matchedStatus = COMPLAINT_STATUS_OPTIONS.find((statusOption) => statusOption.value === normalizedValue || statusOption.label.toLowerCase() === normalizedValue);
    return matchedStatus ? matchedStatus.value : 'new';
  }

  function formatIncidentTime(value) {
    const text = String(value || '').trim();
    if (!text) {
      return '';
    }

    const normalized = text.length >= 5 ? text.slice(0, 5) : text;
    const [hoursText, minutesText] = normalized.split(':');
    const hours = Number(hoursText);
    const minutes = Number(minutesText || '0');

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return text;
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = ((hours + 11) % 12) + 1;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  function formatReportedAt(value) {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function buildReporterText(complaint) {
    const parts = [];

    const name = String(complaint?.reporter_name || '').trim();
    const phone = String(complaint?.reporter_phone || '').trim();
    const email = String(complaint?.reporter_email || '').trim();

    if (name) {
      parts.push(name);
    }

    if (phone) {
      parts.push(phone);
    }

    if (email) {
      parts.push(email);
    }

    return parts.length ? parts.join(' | ') : 'Anonymous';
  }
});
