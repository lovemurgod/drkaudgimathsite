document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  const doctorSelect = document.getElementById('doctor') || document.getElementById('doctor_id');
  const patientNameInput = document.getElementById('patient-name') || document.getElementById('patient_name');
  const patientPhoneInput = document.getElementById('patient-phone') || document.getElementById('patient_phone');
  const appointmentDateInput = document.getElementById('appointment-date');
  const appointmentTimeInput = document.getElementById('appointment-time');
  const notesInput = document.getElementById('notes');
  const formMessage = document.getElementById('form-message');

  const supabaseClient =
    (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient) ||
    (window.supabase && typeof window.supabase.from === 'function' && window.supabase) ||
    (window.supabase && window.supabase.client && typeof window.supabase.client.from === 'function' && window.supabase.client) ||
    null;

  if (!form || !doctorSelect || !patientNameInput || !patientPhoneInput || !appointmentDateInput || !appointmentTimeInput || !notesInput || !formMessage) {
    console.error('Appointment form elements are missing from the page.');
    return;
  }

  if (!supabaseClient) {
    showMessage('Unable to initialize booking service. Please try again later.', 'error');
    console.error('Supabase client is not available on window.supabase.');
    return;
  }

  loadDoctors();
  form.addEventListener('submit', handleSubmit);

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

      doctorSelect.appendChild(option);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearMessage();

    const patient_name = patientNameInput.value.trim();
    const patient_phone = patientPhoneInput.value.trim();
    const doctor_id = doctorSelect.value;
    const appointment_date = appointmentDateInput.value;
    const appointment_time = appointmentTimeInput.value.trim();
    const notes = notesInput.value.trim();

    if (!patient_name || !patient_phone || !doctor_id || !appointment_date || !appointment_time) {
      showMessage('Please fill all required fields before submitting.', 'error');
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
    formMessage.textContent = message;
    formMessage.style.color = type === 'success' ? '#1f7a1f' : '#c62828';
  }

  function clearMessage() {
    formMessage.textContent = '';
    formMessage.style.color = '';
  }
});
