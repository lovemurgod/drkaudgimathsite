document.addEventListener('DOMContentLoaded', () => {
  const i18n = window.siteI18n;

  function translate(key, fallback, vars) {
    if (!i18n || typeof i18n.t !== 'function') {
      return fallback;
    }

    const translated = i18n.t(key, vars);
    return translated === key ? fallback : translated;
  }

  const STAFF_ROLES = {
    RECEPTIONIST: 'receptionist',
    DOCTOR: 'doctor',
    MANAGEMENT: 'management'
  };
  const USERNAME_EMAIL_DOMAIN = 'staff.local';

  const STATUS_OPTIONS = [
    { value: 'pending', dbLabel: 'Pending', labelKey: 'admin.status.pending' },
    { value: 'confirmed', dbLabel: 'Confirmed', labelKey: 'admin.status.confirmed' },
    { value: 'completed', dbLabel: 'Completed', labelKey: 'admin.status.completed' },
    { value: 'cancelled', dbLabel: 'Cancelled', labelKey: 'admin.status.cancelled' },
    { value: 'no-show', dbLabel: 'No Show', labelKey: 'admin.status.noShow' }
  ];

  const COMPLAINT_STATUS_OPTIONS = [
    { value: 'new', dbLabel: 'New', labelKey: 'admin.complaintStatus.new' },
    { value: 'investigating', dbLabel: 'Investigating', labelKey: 'admin.complaintStatus.investigating' },
    { value: 'resolved', dbLabel: 'Resolved', labelKey: 'admin.complaintStatus.resolved' },
    { value: 'rejected', dbLabel: 'Rejected', labelKey: 'admin.complaintStatus.rejected' }
  ];

  const MANAGEMENT_ALERT_STATUS_OPTIONS = [
    { value: 'new', dbLabel: 'New', labelKey: 'admin.managementAlertStatus.new' },
    { value: 'acknowledged', dbLabel: 'Acknowledged', labelKey: 'admin.managementAlertStatus.acknowledged' },
    { value: 'in-progress', dbLabel: 'In Progress', labelKey: 'admin.managementAlertStatus.inProgress' },
    { value: 'resolved', dbLabel: 'Resolved', labelKey: 'admin.managementAlertStatus.resolved' },
    { value: 'rejected', dbLabel: 'Rejected', labelKey: 'admin.managementAlertStatus.rejected' }
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
  const pingManagementButton = document.getElementById('ping-management-button');
  const pingManagementMessage = document.getElementById('ping-management-message');

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
  const managementAlertHistorySection = document.getElementById('management-alert-history');
  const managementAlertHistoryBody = document.getElementById('management-alert-history-body');
  const managementAlertRowTemplate = document.getElementById('management-alert-row-template');
  const managementAlertHistoryMessage = document.getElementById('management-alert-history-message');
  const managementAlertDetail = document.getElementById('management-alert-detail');
  const managementAlertDetailTitle = document.getElementById('management-alert-detail-title');
  const managementAlertDetailTime = document.getElementById('management-alert-detail-time');
  const managementAlertStatusSelect = document.getElementById('management-alert-status-select');
  const managementAlertStatusSaveButton = document.getElementById('management-alert-status-save');
  const managementAlertCommentInput = document.getElementById('management-alert-comment-input');
  const managementAlertCommentSaveButton = document.getElementById('management-alert-comment-save');
  const managementAlertCommentMessage = document.getElementById('management-alert-comment-message');
  const managementAlertCommentsEmpty = document.getElementById('management-alert-comments-empty');
  const managementAlertCommentsList = document.getElementById('management-alert-comments-list');
  const managementAlertTimelineList = document.getElementById('management-alert-timeline-list');

  const manualForm = document.getElementById('manual-appointment-form');
  const manualEntrySection = document.getElementById('manual-entry');
  const manualPatientNameInput = document.getElementById('manual-patient-name');
  const manualPhoneInput = document.getElementById('manual-phone');
  const manualDoctorSelect = document.getElementById('manual-doctor');
  const manualDateInput = document.getElementById('manual-date');
  const manualTimeInput = document.getElementById('manual-time');
  const manualNotesInput = document.getElementById('manual-notes');
  const manualSubmitButton = document.getElementById('manual-submit');
  const managementAlertModal = document.getElementById('management-alert-modal');
  const managementAlertTitle = document.getElementById('management-alert-title');
  const managementAlertText = document.getElementById('management-alert-text');
  const managementAlertTime = document.getElementById('management-alert-time');
  const dismissManagementAlertButton = document.getElementById('dismiss-management-alert');

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
  let currentUserId = '';
  let managementAlertChannel = null;
  let managementAlerts = [];
  let selectedManagementAlertId = '';
  let pendingManagementAlerts = [];
  let activeManagementAlert = null;

  if (!supabaseClient) {
    if (loginMessage) {
      loginMessage.textContent = translate('admin.dbUnavailable', 'Unable to connect to the database.');
    }
    return;
  }

  bindEvents();
  window.addEventListener('app:language-changed', handleLanguageChange);
  restoreSessionOnLoad();

  function handleLanguageChange() {
    applyRoleUiState();

    if (loginButton && !loginButton.disabled) {
      loginButton.textContent = translate('admin.login', 'Login');
    }

    if (pingManagementButton && !pingManagementButton.disabled) {
      pingManagementButton.textContent = translate('admin.pingManagement', 'Ping Management');
    }

    if (manualSubmitButton && !manualSubmitButton.disabled) {
      manualSubmitButton.textContent = translate('admin.submit', 'Submit');
    }

    if (manualFormMessage && manualFormMessage.textContent) {
      setManualFormMessage('', undefined);
    }

    if (pingManagementMessage && pingManagementMessage.textContent) {
      setPingManagementMessage('', undefined);
    }

    if (managementAlertHistoryMessage && managementAlertHistoryMessage.textContent) {
      setManagementAlertHistoryMessage('', undefined);
    }

    if (managementAlertCommentMessage && managementAlertCommentMessage.textContent) {
      setManagementAlertCommentMessage('', undefined);
    }

    renderActiveManagementAlert();
    renderManagementAlertHistory();
    renderSelectedManagementAlert();

    if (!currentStaffProfile) {
      return;
    }

    if (isManagementRole()) {
      loadComplaints();
      void refreshManagementAlerts();
      return;
    }

    loadDoctors();
    loadAppointments();
  }

  function bindEvents() {
    if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }

    if (pingManagementButton) {
      pingManagementButton.addEventListener('click', handlePingManagementClick);
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

    if (managementAlertHistoryBody) {
      managementAlertHistoryBody.addEventListener('click', handleManagementAlertHistoryAction);
    }

    if (manualForm) {
      manualForm.addEventListener('submit', handleManualAppointmentSubmit);
    }

    if (managementAlertStatusSaveButton) {
      managementAlertStatusSaveButton.addEventListener('click', handleManagementAlertStatusSave);
    }

    if (managementAlertCommentSaveButton) {
      managementAlertCommentSaveButton.addEventListener('click', handleManagementAlertCommentSave);
    }

    if (managementAlertModal) {
      managementAlertModal.addEventListener('click', handleManagementAlertModalClick);
    }

    if (dismissManagementAlertButton) {
      dismissManagementAlertButton.addEventListener('click', dismissActiveManagementAlert);
    }

    document.addEventListener('keydown', handleDocumentKeydown);
  }

  async function restoreSessionOnLoad() {
    try {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        throw error;
      }

      const session = data?.session || null;

      if (!session) {
        currentUserId = '';
        clearManagementAlertState();
        showLoginView();
        applyRoleUiState();
        return;
      }

      await startAuthenticatedSession(session);
    } catch (error) {
      console.error('Session restore error:', error);
      await supabaseClient.auth.signOut();
      currentUserId = '';
      currentStaffProfile = null;
      dashboardInitialized = false;
      clearManagementAlertState();
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
      setLoginMessage(translate('admin.enterCredentials', 'Please enter username/email and password.'));
      return;
    }

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = translate('admin.loggingIn', 'Logging in...');
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
      currentUserId = '';
      currentStaffProfile = null;
      dashboardInitialized = false;
      clearManagementAlertState();
      setLoginMessage(resolveLoginErrorMessage(error));
      showLoginView();
      applyRoleUiState();
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = translate('admin.login', 'Login');
      }
    }
  }

  async function startAuthenticatedSession(session) {
    const user = session?.user || null;

    if (!user?.id) {
      throw new Error('Unable to load authenticated user.');
    }

    currentUserId = user.id;

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
        await refreshManagementAlerts();
        subscribeToManagementAlerts();
      } else {
        clearManagementAlertState();
        await loadAppointments();
      }
      return;
    }

    if (isManagementRole()) {
      await loadComplaints();
      await refreshManagementAlerts();
      subscribeToManagementAlerts();
      dashboardInitialized = true;
      return;
    }

    clearManagementAlertState();
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
        fallbackOption.textContent = translate('admin.myAppointments', 'My Appointments');
        filterDoctorSelect.appendChild(fallbackOption);
      }

      filterDoctorSelect.value = String(currentStaffProfile?.doctorId || '');
      filterDoctorSelect.disabled = true;
      return;
    }

    filterDoctorSelect.disabled = false;

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = translate('admin.allDoctors', 'All Doctors');
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
      option.textContent = doctor?.name || translate('admin.assignedDoctor', 'Assigned Doctor');
      manualDoctorSelect.appendChild(option);
      manualDoctorSelect.value = String(currentStaffProfile?.doctorId || '');
      manualDoctorSelect.disabled = true;
      return;
    }

    manualDoctorSelect.disabled = false;

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = translate('admin.selectDoctor', 'Select Doctor');
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

  function localizeSelectOptions(selectElement, options, ariaKey, ariaFallback) {
    if (!selectElement) {
      return;
    }

    selectElement.setAttribute('aria-label', translate(ariaKey, ariaFallback));

    options.forEach((statusOption) => {
      const optionElement = selectElement.querySelector(`option[value="${statusOption.value}"]`);
      if (!optionElement) {
        return;
      }

      optionElement.textContent = translate(statusOption.labelKey, statusOption.dbLabel);
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
      statusSelect.setAttribute(
        'aria-label',
        translate('admin.appointmentStatusAria', 'Appointment Status')
      );
      STATUS_OPTIONS.forEach((statusOption) => {
        const option = document.createElement('option');
        option.value = statusOption.value;
        option.textContent = translate(statusOption.labelKey, statusOption.dbLabel);
        statusSelect.appendChild(option);
      });

      const updateButton = document.createElement('button');
      updateButton.type = 'button';
      updateButton.setAttribute('data-action', 'update-status');
      updateButton.textContent = translate('admin.update', 'Update');

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
      localizeSelectOptions(statusSelect, STATUS_OPTIONS, 'admin.appointmentStatusAria', 'Appointment Status');
      statusSelect.value = mapStatusToValue(appointment.status || 'Pending');
    }

    if (statusSelect && isDoctorRole()) {
      statusSelect.disabled = String(appointment.doctor_id ?? '') !== String(currentStaffProfile?.doctorId || '');
    }

    if (updateButton && isDoctorRole()) {
      updateButton.disabled = String(appointment.doctor_id ?? '') !== String(currentStaffProfile?.doctorId || '');
    }

    if (updateButton) {
      updateButton.textContent = translate('admin.update', 'Update');
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
        throw new Error(translate('admin.onlyOwnAppointments', 'You can update only your own appointments.'));
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
      setManualFormMessage(
        translate('admin.onlyReception', 'Only receptionist accounts can create manual appointments.'),
        'error'
      );
      return;
    }

    const patientName = (manualPatientNameInput?.value || '').trim();
    const phone = (manualPhoneInput?.value || '').trim();
    const doctorId = manualDoctorSelect?.value || '';
    const date = manualDateInput?.value || '';
    const time = manualTimeInput?.value || '';
    const notes = (manualNotesInput?.value || '').trim();

    if (!patientName || !phone || !doctorId || !date || !time) {
      setManualFormMessage(translate('admin.fillRequired', 'Please fill all required fields.'), 'error');
      return;
    }

    if (manualSubmitButton) {
      manualSubmitButton.disabled = true;
      manualSubmitButton.textContent = translate('admin.submitting', 'Submitting...');
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
      setManualFormMessage(translate('admin.manualCreated', 'Manual appointment created successfully.'), 'success');
    } catch (error) {
      console.error('Error creating manual appointment:', error);
      const message = String(error?.message || translate('admin.createAppointmentError', 'Unable to create appointment. Please try again.'));
      setManualFormMessage(message, 'error');
    } finally {
      if (manualSubmitButton) {
        manualSubmitButton.disabled = false;
        manualSubmitButton.textContent = translate('admin.submit', 'Submit');
      }
    }
  }

  async function handlePingManagementClick() {
    setPingManagementMessage('');

    if (!isReceptionistRole() || !currentUserId) {
      return;
    }

    if (pingManagementButton) {
      pingManagementButton.disabled = true;
      pingManagementButton.textContent = translate('admin.pingingManagement', 'Sending alert...');
    }

    try {
      const { error } = await supabaseClient
        .from('management_alerts')
        .insert({
          alert_type: 'reception_ping',
          created_by: currentUserId
        });

      if (error) {
        throw error;
      }

      setPingManagementMessage(translate('admin.pingManagementSuccess', 'Management has been alerted.'), 'success');
    } catch (error) {
      console.error('Error alerting management:', error);
      setPingManagementMessage(
        translate('admin.pingManagementError', 'Unable to alert management. Please try again.'),
        'error'
      );
    } finally {
      if (pingManagementButton) {
        pingManagementButton.disabled = false;
        pingManagementButton.textContent = translate('admin.pingManagement', 'Ping Management');
      }
    }
  }

  async function handleLogout() {
    clearManagementAlertState();
    currentUserId = '';

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
    setPingManagementMessage('', undefined);
    setManagementAlertHistoryMessage('', undefined);
    setManagementAlertCommentMessage('', undefined);
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

  function setPingManagementMessage(message, type) {
    if (!pingManagementMessage) {
      return;
    }

    pingManagementMessage.textContent = message;

    if (!message) {
      pingManagementMessage.style.color = '';
      return;
    }

    pingManagementMessage.style.color = type === 'success' ? '#1f7a1f' : '#b71f1f';
  }

  function setManagementAlertHistoryMessage(message, type) {
    if (!managementAlertHistoryMessage) {
      return;
    }

    managementAlertHistoryMessage.textContent = message;

    if (!message) {
      managementAlertHistoryMessage.style.color = '';
      return;
    }

    managementAlertHistoryMessage.style.color = type === 'success' ? '#1f7a1f' : '#b71f1f';
  }

  function setManagementAlertCommentMessage(message, type) {
    if (!managementAlertCommentMessage) {
      return;
    }

    managementAlertCommentMessage.textContent = message;

    if (!message) {
      managementAlertCommentMessage.style.color = '';
      return;
    }

    managementAlertCommentMessage.style.color = type === 'success' ? '#1f7a1f' : '#b71f1f';
  }

  function applyRoleUiState() {
    const isDoctor = isDoctorRole();
    const isManagement = isManagementRole();
    const isReceptionist = isReceptionistRole();

    if (loginTitle) {
      loginTitle.textContent = translate('admin.staffLogin', 'Staff Login');
    }

    if (dashboardTitle) {
      if (isDoctor) {
        dashboardTitle.textContent = translate('admin.doctorDashboard', 'Doctor Dashboard');
      } else if (isManagement) {
        dashboardTitle.textContent = translate('admin.managementDashboard', 'Management Dashboard');
      } else {
        dashboardTitle.textContent = translate('admin.receptionDashboard', 'Reception Dashboard');
      }
    }

    if (pingManagementButton) {
      pingManagementButton.hidden = !isReceptionist;
    }

    if (pingManagementMessage) {
      if (!isReceptionist) {
        setPingManagementMessage('', undefined);
      }

      pingManagementMessage.hidden = !isReceptionist;
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

    if (managementAlertHistorySection) {
      managementAlertHistorySection.hidden = !isManagement;
    }

    if (!isManagement) {
      if (managementAlertDetail) {
        managementAlertDetail.hidden = true;
      }

      hideManagementAlertModal();
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

  async function refreshManagementAlerts() {
    if (!isManagementRole() || !currentUserId) {
      clearManagementAlertData();
      return;
    }

    try {
      const [alertsResult, receiptsResult, commentsResult] = await Promise.all([
        supabaseClient
          .from('management_alerts')
          .select('id, alert_type, created_at')
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('management_alert_receipts')
          .select('alert_id, shown_at, dismissed_at, status, status_updated_at, last_viewed_at')
          .eq('manager_user_id', currentUserId),
        supabaseClient
          .from('management_alert_comments')
          .select('id, alert_id, manager_user_id, note, created_at, updated_at')
          .order('created_at', { ascending: false })
      ]);

      if (alertsResult.error) {
        throw alertsResult.error;
      }

      if (receiptsResult.error) {
        throw receiptsResult.error;
      }

      if (commentsResult.error) {
        throw commentsResult.error;
      }

      const receiptMap = new Map();
      (Array.isArray(receiptsResult.data) ? receiptsResult.data : []).forEach((receipt) => {
        receiptMap.set(String(receipt.alert_id), receipt);
      });

      const commentsByAlertId = new Map();
      (Array.isArray(commentsResult.data) ? commentsResult.data : []).forEach((comment) => {
        const alertId = String(comment.alert_id || '');
        if (!commentsByAlertId.has(alertId)) {
          commentsByAlertId.set(alertId, []);
        }

        commentsByAlertId.get(alertId).push(comment);
      });

      managementAlerts = (Array.isArray(alertsResult.data) ? alertsResult.data : [])
        .map((alert) => normalizeManagementAlert(alert, receiptMap.get(String(alert.id)), commentsByAlertId.get(String(alert.id)) || []))
        .filter(Boolean);

      if (selectedManagementAlertId && !managementAlerts.some((alert) => alert.id === selectedManagementAlertId)) {
        selectedManagementAlertId = '';
      }

      if (!selectedManagementAlertId && managementAlerts.length > 0) {
        selectedManagementAlertId = managementAlerts[0].id;
      }

      syncManagementAlertQueue(managementAlerts);
      renderManagementAlertHistory();
      renderSelectedManagementAlert();
    } catch (error) {
      console.error('Error loading management alerts:', error);
      clearManagementAlertData();
      setManagementAlertHistoryMessage(
        translate('admin.managementAlertLoadError', 'Unable to load management alerts right now.'),
        'error'
      );
    }
  }

  function subscribeToManagementAlerts() {
    if (!isManagementRole() || !currentUserId || managementAlertChannel) {
      return;
    }

    managementAlertChannel = supabaseClient
      .channel(`management-alerts-${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'management_alerts'
        },
        () => {
          void refreshManagementAlerts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'management_alert_receipts'
        },
        () => {
          void refreshManagementAlerts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'management_alert_comments'
        },
        () => {
          void refreshManagementAlerts();
        }
      )
      .subscribe();
  }

  function clearManagementAlertState() {
    teardownManagementAlertSubscription();
    clearManagementAlertData();
    hideManagementAlertModal();
  }

  function clearManagementAlertData() {
    managementAlerts = [];
    selectedManagementAlertId = '';
    setManagementAlertHistoryMessage('', undefined);
    setManagementAlertCommentMessage('', undefined);
    clearQueuedManagementAlerts();
    renderManagementAlertHistory();
    renderSelectedManagementAlert();
  }

  function clearQueuedManagementAlerts() {
    pendingManagementAlerts = [];
    activeManagementAlert = null;
  }

  function teardownManagementAlertSubscription() {
    if (!managementAlertChannel) {
      return;
    }

    supabaseClient.removeChannel(managementAlertChannel);
    managementAlertChannel = null;
  }

  function syncManagementAlertQueue(alerts) {
    const normalizedAlerts = alerts
      .filter(Boolean)
      .sort((leftAlert, rightAlert) => new Date(rightAlert.createdAt) - new Date(leftAlert.createdAt))
      .filter((alert) => alert.statusValue === 'new');

    const seenAlertIds = new Set();
    const dedupedAlerts = normalizedAlerts.filter((alert) => {
      if (seenAlertIds.has(alert.id)) {
        return false;
      }

      seenAlertIds.add(alert.id);
      return true;
    });

    const activeAlertId = activeManagementAlert?.id || '';
    const updatedActiveAlert = dedupedAlerts.find((alert) => alert.id === activeAlertId) || null;

    activeManagementAlert = updatedActiveAlert || activeManagementAlert;
    pendingManagementAlerts = dedupedAlerts.filter((alert) => alert.id !== activeAlertId);

    if (!activeManagementAlert) {
      showNextManagementAlert();
      return;
    }

    renderActiveManagementAlert();
  }

  function enqueueManagementAlert(alert) {
    const normalizedAlert = normalizeManagementAlert(alert);
    if (!normalizedAlert) {
      return;
    }

    if (activeManagementAlert?.id === normalizedAlert.id) {
      return;
    }

    if (pendingManagementAlerts.some((queuedAlert) => queuedAlert.id === normalizedAlert.id)) {
      return;
    }

    pendingManagementAlerts = [normalizedAlert, ...pendingManagementAlerts].sort(
      (leftAlert, rightAlert) => new Date(rightAlert.createdAt) - new Date(leftAlert.createdAt)
    );

    if (!activeManagementAlert) {
      showNextManagementAlert();
    }
  }

  function normalizeManagementAlert(alert, receipt, comments) {
    if (!alert?.id) {
      return null;
    }

    const normalizedComments = Array.isArray(comments)
      ? comments
        .slice()
        .sort((leftComment, rightComment) => new Date(rightComment.created_at) - new Date(leftComment.created_at))
      : [];

    const statusValue = mapManagementAlertStatusToValue(receipt?.status || 'New');

    return {
      id: String(alert.id),
      alertType: String(alert.alert_type || 'reception_ping').trim().toLowerCase(),
      createdAt: alert.created_at || new Date().toISOString(),
      shownAt: receipt?.shown_at || '',
      dismissedAt: receipt?.dismissed_at || '',
      statusValue,
      statusLabel: translate(resolveManagementAlertStatusLabelKey(statusValue), mapManagementAlertStatusToDb(statusValue)),
      statusUpdatedAt: receipt?.status_updated_at || '',
      lastViewedAt: receipt?.last_viewed_at || '',
      comments: normalizedComments,
      notesCount: normalizedComments.length
    };
  }

  function renderManagementAlertHistory() {
    if (!managementAlertHistoryBody) {
      return;
    }

    managementAlertHistoryBody.innerHTML = '';

    if (managementAlerts.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 5;
      emptyCell.textContent = translate('admin.managementAlertHistoryEmpty', 'No management alerts yet.');
      emptyRow.appendChild(emptyCell);
      managementAlertHistoryBody.appendChild(emptyRow);
      return;
    }

    managementAlerts.forEach((alert) => {
      const row = buildManagementAlertHistoryRow(alert);
      managementAlertHistoryBody.appendChild(row);
    });
  }

  function buildManagementAlertHistoryRow(alert) {
    let row;

    if (managementAlertRowTemplate && 'content' in managementAlertRowTemplate) {
      const fragment = managementAlertRowTemplate.content.cloneNode(true);
      row = fragment.querySelector('tr');
    }

    if (!row) {
      row = document.createElement('tr');
    }

    row.dataset.alertId = alert.id;
    row.classList.toggle('management-alert-row--selected', alert.id === selectedManagementAlertId);

    const alertTypeCell = row.querySelector('[data-field="alert-type"]');
    const createdAtCell = row.querySelector('[data-field="created-at"]');
    const statusBadge = row.querySelector('[data-field="status-badge"]');
    const notesCountCell = row.querySelector('[data-field="notes-count"]');
    const openButton = row.querySelector('button[data-action="select-management-alert"]');

    if (alertTypeCell) {
      alertTypeCell.textContent = translate('admin.managementAlertTypeReceptionPing', 'Reception Ping');
    }

    if (createdAtCell) {
      createdAtCell.textContent = formatReportedAt(alert.createdAt);
    }

    if (statusBadge) {
      statusBadge.textContent = alert.statusLabel;
      statusBadge.dataset.status = alert.statusValue;
    }

    if (notesCountCell) {
      notesCountCell.textContent = String(alert.notesCount);
    }

    if (openButton) {
      openButton.textContent = translate('admin.openAlert', 'Open');
    }

    return row;
  }

  function renderSelectedManagementAlert() {
    if (!managementAlertDetail || !managementAlertDetailTitle || !managementAlertDetailTime || !managementAlertStatusSelect) {
      return;
    }

    const selectedAlert = getSelectedManagementAlert();
    if (!selectedAlert) {
      managementAlertDetail.hidden = true;
      if (managementAlertCommentInput) {
        managementAlertCommentInput.value = '';
      }
      return;
    }

    managementAlertDetail.hidden = false;
    managementAlertDetailTitle.textContent = translate('admin.managementAlertTitle', 'Reception needs management assistance');
    managementAlertDetailTime.textContent = `${translate('admin.managementAlertTime', 'Sent at')} ${formatReportedAt(selectedAlert.createdAt)}`.trim();
    localizeSelectOptions(managementAlertStatusSelect, MANAGEMENT_ALERT_STATUS_OPTIONS, 'admin.managementAlertStatusAria', 'Alert Status');
    managementAlertStatusSelect.value = selectedAlert.statusValue;
    managementAlertStatusSelect.disabled = false;

    if (managementAlertStatusSaveButton) {
      managementAlertStatusSaveButton.textContent = translate('admin.saveAlertStatus', 'Save Status');
      managementAlertStatusSaveButton.disabled = false;
    }

    if (managementAlertCommentInput) {
      managementAlertCommentInput.placeholder = translate('admin.managementAlertCommentPlaceholder', 'Add a note for this alert');
    }

    if (managementAlertCommentSaveButton) {
      managementAlertCommentSaveButton.textContent = translate('admin.addAlertNote', 'Add Note');
      managementAlertCommentSaveButton.disabled = false;
    }

    renderManagementAlertTimeline(selectedAlert);
    renderManagementAlertComments(selectedAlert);
  }

  function renderManagementAlertTimeline(alert) {
    if (!managementAlertTimelineList) {
      return;
    }

    managementAlertTimelineList.innerHTML = '';

    const timelineItems = buildManagementAlertTimelineItems(alert);
    timelineItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'management-alert-timeline__item';
      listItem.dataset.eventType = item.eventType;
      if (item.statusValue) {
        listItem.dataset.statusValue = item.statusValue;
      }

      const marker = document.createElement('span');
      marker.className = 'management-alert-timeline__marker';
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = getManagementAlertTimelineMarkerText(item.eventType);

      const content = document.createElement('div');
      content.className = 'management-alert-timeline__content';

      const title = document.createElement('p');
      title.className = 'management-alert-timeline__title';
      title.textContent = item.title;

      const time = document.createElement('p');
      time.className = 'management-alert-timeline__time';
      time.textContent = item.timeLabel;

      content.appendChild(title);
      content.appendChild(time);

      if (item.description) {
        const description = document.createElement('p');
        description.className = 'management-alert-timeline__description';
        description.textContent = item.description;
        content.appendChild(description);
      }

      listItem.appendChild(marker);
      listItem.appendChild(content);
      managementAlertTimelineList.appendChild(listItem);
    });
  }

  function buildManagementAlertTimelineItems(alert) {
    const timelineItems = [];

    timelineItems.push({
      sortAt: alert.createdAt,
      eventType: 'created',
      title: translate('admin.managementAlertTimelineCreated', 'Alert created'),
      timeLabel: formatReportedAt(alert.createdAt),
      description: translate('admin.managementAlertTimelineCreatedDescription', 'Reception sent this management alert.')
    });

    if (alert.shownAt) {
      timelineItems.push({
        sortAt: alert.shownAt,
        eventType: 'viewed',
        title: translate('admin.managementAlertTimelineViewed', 'Viewed by you'),
        timeLabel: formatReportedAt(alert.shownAt),
        description: translate('admin.managementAlertTimelineViewedDescription', 'You opened or received this alert.')
      });
    }

    if (shouldShowStatusTimelineEntry(alert)) {
      timelineItems.push({
        sortAt: alert.statusUpdatedAt,
        eventType: 'status',
        statusValue: alert.statusValue,
        title: translate('admin.managementAlertTimelineStatusChanged', 'Status updated'),
        timeLabel: formatReportedAt(alert.statusUpdatedAt),
        description: `${translate('admin.managementAlertTimelineStatusPrefix', 'Current status:')} ${alert.statusLabel}`
      });
    }

    alert.comments.forEach((comment) => {
      const authorLabel = comment.manager_user_id === currentUserId
        ? translate('admin.you', 'You')
        : translate('admin.managementTeam', 'Management');

      timelineItems.push({
        sortAt: comment.created_at,
        eventType: 'note',
        title: translate('admin.managementAlertTimelineNoteAdded', 'Note added'),
        timeLabel: formatReportedAt(comment.created_at),
        description: `${authorLabel}: ${comment.note || ''}`.trim()
      });
    });

    return timelineItems.sort((leftItem, rightItem) => new Date(rightItem.sortAt) - new Date(leftItem.sortAt));
  }

  function shouldShowStatusTimelineEntry(alert) {
    if (!alert.statusUpdatedAt) {
      return false;
    }

    if (alert.statusValue !== 'new') {
      return true;
    }

    return false;
  }

  function getManagementAlertTimelineMarkerText(eventType) {
    if (eventType === 'created') {
      return 'A';
    }

    if (eventType === 'viewed') {
      return 'V';
    }

    if (eventType === 'status') {
      return 'S';
    }

    if (eventType === 'note') {
      return 'N';
    }

    return 'I';
  }

  function renderManagementAlertComments(alert) {
    if (!managementAlertCommentsList || !managementAlertCommentsEmpty) {
      return;
    }

    managementAlertCommentsList.innerHTML = '';

    if (!Array.isArray(alert.comments) || alert.comments.length === 0) {
      managementAlertCommentsEmpty.hidden = false;
      return;
    }

    managementAlertCommentsEmpty.hidden = true;

    alert.comments.forEach((comment) => {
      const listItem = document.createElement('li');
      listItem.className = 'management-alert-comments__item';

      const meta = document.createElement('p');
      meta.className = 'management-alert-comments__meta';
      const authorLabel = comment.manager_user_id === currentUserId
        ? translate('admin.you', 'You')
        : translate('admin.managementTeam', 'Management');
      meta.textContent = `${authorLabel} | ${formatReportedAt(comment.created_at)}`;

      const body = document.createElement('p');
      body.className = 'management-alert-comments__body';
      body.textContent = comment.note || '';

      listItem.appendChild(meta);
      listItem.appendChild(body);
      managementAlertCommentsList.appendChild(listItem);
    });
  }

  function getSelectedManagementAlert() {
    if (!selectedManagementAlertId) {
      return null;
    }

    return managementAlerts.find((alert) => alert.id === selectedManagementAlertId) || null;
  }

  function handleManagementAlertHistoryAction(event) {
    const target = event.target;

    if (!(target instanceof HTMLElement) || target.dataset.action !== 'select-management-alert') {
      return;
    }

    const row = target.closest('tr');
    const alertId = row?.dataset.alertId || '';
    if (!alertId) {
      return;
    }

    selectedManagementAlertId = alertId;
    setManagementAlertHistoryMessage('', undefined);
    setManagementAlertCommentMessage('', undefined);
    renderManagementAlertHistory();
    renderSelectedManagementAlert();
  }

  async function handleManagementAlertStatusSave() {
    const selectedAlert = getSelectedManagementAlert();
    const nextStatusValue = managementAlertStatusSelect?.value || '';

    if (!selectedAlert || !nextStatusValue || !currentUserId || !isManagementRole()) {
      return;
    }

    if (managementAlertStatusSaveButton) {
      managementAlertStatusSaveButton.disabled = true;
      managementAlertStatusSaveButton.textContent = translate('admin.savingAlertStatus', 'Saving...');
    }

    try {
      const timestamp = new Date().toISOString();
      const { error } = await supabaseClient
        .from('management_alert_receipts')
        .upsert(
          {
            alert_id: Number(selectedAlert.id),
            manager_user_id: currentUserId,
            shown_at: selectedAlert.shownAt || timestamp,
            last_viewed_at: timestamp,
            status: mapManagementAlertStatusToDb(nextStatusValue),
            status_updated_at: timestamp,
            updated_at: timestamp
          },
          {
            onConflict: 'alert_id,manager_user_id'
          }
        );

      if (error) {
        throw error;
      }

      setManagementAlertHistoryMessage(
        translate('admin.managementAlertStatusSaved', 'Alert status updated.'),
        'success'
      );

      await refreshManagementAlerts();
    } catch (error) {
      console.error('Error updating management alert status:', error);
      setManagementAlertHistoryMessage(
        translate('admin.managementAlertStatusError', 'Unable to update alert status right now.'),
        'error'
      );
    } finally {
      if (managementAlertStatusSaveButton) {
        managementAlertStatusSaveButton.disabled = false;
        managementAlertStatusSaveButton.textContent = translate('admin.saveAlertStatus', 'Save Status');
      }
    }
  }

  async function handleManagementAlertCommentSave() {
    const selectedAlert = getSelectedManagementAlert();
    const note = String(managementAlertCommentInput?.value || '').trim();

    setManagementAlertCommentMessage('', undefined);

    if (!selectedAlert || !note || !currentUserId || !isManagementRole()) {
      if (!note) {
        setManagementAlertCommentMessage(
          translate('admin.managementAlertNoteRequired', 'Please enter a note before saving.'),
          'error'
        );
      }
      return;
    }

    if (managementAlertCommentSaveButton) {
      managementAlertCommentSaveButton.disabled = true;
      managementAlertCommentSaveButton.textContent = translate('admin.savingAlertNote', 'Saving note...');
    }

    try {
      const timestamp = new Date().toISOString();

      const { error: receiptError } = await supabaseClient
        .from('management_alert_receipts')
        .upsert(
          {
            alert_id: Number(selectedAlert.id),
            manager_user_id: currentUserId,
            shown_at: selectedAlert.shownAt || timestamp,
            last_viewed_at: timestamp,
            updated_at: timestamp
          },
          {
            onConflict: 'alert_id,manager_user_id'
          }
        );

      if (receiptError) {
        throw receiptError;
      }

      const { error } = await supabaseClient
        .from('management_alert_comments')
        .insert({
          alert_id: Number(selectedAlert.id),
          manager_user_id: currentUserId,
          note
        });

      if (error) {
        throw error;
      }

      if (managementAlertCommentInput) {
        managementAlertCommentInput.value = '';
      }

      setManagementAlertCommentMessage(
        translate('admin.managementAlertNoteSaved', 'Note added to alert history.'),
        'success'
      );

      await refreshManagementAlerts();
    } catch (error) {
      console.error('Error saving management alert note:', error);
      setManagementAlertCommentMessage(
        translate('admin.managementAlertNoteError', 'Unable to save this note right now.'),
        'error'
      );
    } finally {
      if (managementAlertCommentSaveButton) {
        managementAlertCommentSaveButton.disabled = false;
        managementAlertCommentSaveButton.textContent = translate('admin.addAlertNote', 'Add Note');
      }
    }
  }

  function showNextManagementAlert() {
    if (!isManagementRole()) {
      return;
    }

    const nextAlert = pendingManagementAlerts.shift() || null;
    activeManagementAlert = nextAlert;

    if (!nextAlert) {
      hideManagementAlertModal();
      return;
    }

    renderActiveManagementAlert();
    showManagementAlertModal();
    void markManagementAlertShown(nextAlert.id);
  }

  function renderActiveManagementAlert() {
    if (!managementAlertTitle || !managementAlertText || !managementAlertTime || !dismissManagementAlertButton) {
      return;
    }

    if (!activeManagementAlert) {
      managementAlertTitle.textContent = translate('admin.managementAlertTitle', 'Reception needs management assistance');
      managementAlertText.textContent = translate(
        'admin.managementAlertBody',
        'Reception has requested immediate support at the front desk.'
      );
      managementAlertTime.textContent = '';
      dismissManagementAlertButton.textContent = translate('admin.dismissAlert', 'Dismiss');
      return;
    }

    managementAlertTitle.textContent = translate('admin.managementAlertTitle', 'Reception needs management assistance');
    managementAlertText.textContent = translate(
      'admin.managementAlertBody',
      'Reception has requested immediate support at the front desk.'
    );
    managementAlertTime.textContent = `${translate('admin.managementAlertTime', 'Sent at')} ${formatReportedAt(activeManagementAlert.createdAt)}`.trim();
    dismissManagementAlertButton.textContent = translate('admin.dismissAlert', 'Dismiss');
  }

  async function markManagementAlertShown(alertId) {
    if (!alertId || !currentUserId || !isManagementRole()) {
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const { error } = await supabaseClient
        .from('management_alert_receipts')
        .upsert(
          {
            alert_id: Number(alertId),
            manager_user_id: currentUserId,
            shown_at: timestamp,
            last_viewed_at: timestamp,
            updated_at: timestamp
          },
          {
            onConflict: 'alert_id,manager_user_id'
          }
        );

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error marking management alert as shown:', error);
    }
  }

  async function dismissActiveManagementAlert() {
    if (!activeManagementAlert || !currentUserId || !isManagementRole()) {
      hideManagementAlertModal();
      return;
    }

    if (dismissManagementAlertButton) {
      dismissManagementAlertButton.disabled = true;
    }

    try {
      const timestamp = new Date().toISOString();
      const { error } = await supabaseClient
        .from('management_alert_receipts')
        .upsert(
          {
            alert_id: Number(activeManagementAlert.id),
            manager_user_id: currentUserId,
            shown_at: timestamp,
            last_viewed_at: timestamp,
            status: 'Acknowledged',
            status_updated_at: timestamp,
            updated_at: timestamp
          },
          {
            onConflict: 'alert_id,manager_user_id'
          }
        );

      if (error) {
        throw error;
      }

      activeManagementAlert = null;
      hideManagementAlertModal();
      setManagementAlertHistoryMessage(
        translate('admin.managementAlertStatusSaved', 'Alert status updated.'),
        'success'
      );
      await refreshManagementAlerts();
    } catch (error) {
      console.error('Error dismissing management alert:', error);
    } finally {
      if (dismissManagementAlertButton) {
        dismissManagementAlertButton.disabled = false;
      }

      renderActiveManagementAlert();
    }
  }

  function handleManagementAlertModalClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action !== 'dismiss-management-alert') {
      return;
    }

    void dismissActiveManagementAlert();
  }

  function handleDocumentKeydown(event) {
    if (event.key !== 'Escape' || !activeManagementAlert || managementAlertModal?.hidden) {
      return;
    }

    event.preventDefault();
    void dismissActiveManagementAlert();
  }

  function showManagementAlertModal() {
    if (!managementAlertModal) {
      return;
    }

    managementAlertModal.hidden = false;
    document.body.classList.add('language-modal-open');

    if (dismissManagementAlertButton) {
      dismissManagementAlertButton.focus();
    }
  }

  function hideManagementAlertModal() {
    if (managementAlertModal) {
      managementAlertModal.hidden = true;
    }

    document.body.classList.remove('language-modal-open');
  }

  function mapManagementAlertStatusToDb(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    const matchedStatus = MANAGEMENT_ALERT_STATUS_OPTIONS.find(
      (statusOption) => statusOption.value === normalizedValue || statusOption.dbLabel.toLowerCase() === normalizedValue
    );

    return matchedStatus ? matchedStatus.dbLabel : 'New';
  }

  function mapManagementAlertStatusToValue(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    if (!normalizedValue) {
      return 'new';
    }

    const matchedStatus = MANAGEMENT_ALERT_STATUS_OPTIONS.find(
      (statusOption) => statusOption.value === normalizedValue || statusOption.dbLabel.toLowerCase() === normalizedValue
    );

    return matchedStatus ? matchedStatus.value : 'new';
  }

  function resolveManagementAlertStatusLabelKey(value) {
    const matchedStatus = MANAGEMENT_ALERT_STATUS_OPTIONS.find((statusOption) => statusOption.value === value);
    return matchedStatus ? matchedStatus.labelKey : 'admin.managementAlertStatus.new';
  }

  function resolveLoginErrorMessage(error) {
    const message = String(error?.message || '').toLowerCase();

    if (message.includes('invalid login credentials')) {
      return translate('admin.loginInvalid', 'Invalid email or password.');
    }

    if (message.includes('email not confirmed')) {
      return translate('admin.loginNotConfirmed', 'Email is not confirmed for this account.');
    }

    if (message.includes('not assigned as receptionist, doctor, or management')) {
      return translate('admin.loginNoRole', 'Your account is not assigned as receptionist, doctor, or management.');
    }

    if (message.includes('missing an assigned doctor profile')) {
      return translate('admin.loginDoctorMissing', 'Doctor account is missing assigned doctor profile.');
    }

    return translate('admin.loginUnavailable', 'Unable to login right now. Please try again.');
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
      localizeSelectOptions(statusSelect, COMPLAINT_STATUS_OPTIONS, 'admin.complaintStatusAria', 'Complaint Status');
      statusSelect.value = mapComplaintStatusToValue(complaint.status || 'New');
      statusSelect.disabled = !isManagementRole();
    }

    if (updateButton) {
      updateButton.disabled = !isManagementRole();
      updateButton.textContent = translate('admin.update', 'Update');
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

    return matchedStatus.dbLabel;
  }

  function mapComplaintStatusToValue(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();

    if (!normalizedValue) {
      return 'new';
    }

    const matchedStatus = COMPLAINT_STATUS_OPTIONS.find(
      (statusOption) => statusOption.value === normalizedValue || statusOption.dbLabel.toLowerCase() === normalizedValue
    );
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

    const locale = i18n && typeof i18n.getLocale === 'function' ? i18n.getLocale() : 'en-IN';

    return date.toLocaleString(locale, {
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

    return parts.length ? parts.join(' | ') : translate('admin.anonymous', 'Anonymous');
  }
});
