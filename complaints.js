document.addEventListener('DOMContentLoaded', () => {
  const i18n = window.siteI18n;

  function translate(key, fallback, vars) {
    if (!i18n || typeof i18n.t !== 'function') {
      return fallback;
    }

    const translated = i18n.t(key, vars);
    return translated === key ? fallback : translated;
  }

  const form = document.getElementById('complaint-form');
  const messageElement = document.getElementById('complaint-form-message');
  const reporterNameInput = document.getElementById('reporter_name');
  const reporterPhoneInput = document.getElementById('reporter_phone');
  const reporterEmailInput = document.getElementById('reporter_email');
  const incidentDateInput = document.getElementById('incident_date');
  const incidentTimeInput = document.getElementById('incident_time');
  const incidentNatureInput = document.getElementById('incident_nature');
  const incidentDetailsInput = document.getElementById('incident_details');

  const supabaseClient =
    (window.publicSupabaseClient && typeof window.publicSupabaseClient.from === 'function' && window.publicSupabaseClient) ||
    (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient) ||
    (window.supabase && typeof window.supabase.from === 'function' && window.supabase) ||
    (window.supabase && window.supabase.client && typeof window.supabase.client.from === 'function' && window.supabase.client) ||
    null;

  if (!form) {
    return;
  }

  if (!supabaseClient) {
    showMessage(translate('complaints.initError', 'Unable to initialize complaint service. Please try again later.'), 'error');
    return;
  }

  if (incidentDateInput) {
    incidentDateInput.max = formatDateForInput(new Date());
  }

  form.addEventListener('submit', handleSubmit);

  async function handleSubmit(event) {
    event.preventDefault();
    showMessage('');

    const reporter_name = (reporterNameInput?.value || '').trim();
    const reporter_phone = (reporterPhoneInput?.value || '').trim();
    const reporter_email = (reporterEmailInput?.value || '').trim();
    const incident_date = incidentDateInput?.value || '';
    const incident_time = incidentTimeInput?.value || '';
    const incident_nature = (incidentNatureInput?.value || '').trim();
    const incident_details = (incidentDetailsInput?.value || '').trim();

    if (!incident_date || !incident_time || !incident_nature || !incident_details) {
      showMessage(translate('complaints.requiredFieldsError', 'Please fill all required incident fields before submitting.'), 'error');
      return;
    }

    try {
      const { error } = await supabaseClient.from('complaints').insert({
        reporter_name: reporter_name || null,
        reporter_phone: reporter_phone || null,
        reporter_email: reporter_email || null,
        incident_date,
        incident_time,
        incident_nature,
        incident_details
      });

      if (error) {
        throw error;
      }

      form.reset();
      if (incidentDateInput) {
        incidentDateInput.max = formatDateForInput(new Date());
      }
      showMessage(translate('complaints.success', 'Complaint submitted successfully. Thank you for your feedback.'), 'success');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      showMessage(translate('complaints.submitError', 'Something went wrong while submitting your complaint. Please try again.'), 'error');
    }
  }

  function showMessage(message, type) {
    if (!messageElement) {
      return;
    }

    messageElement.textContent = message;

    if (!message) {
      messageElement.style.color = '';
      return;
    }

    messageElement.style.color = type === 'success' ? '#1f7a1f' : '#c62828';
  }

  function formatDateForInput(date) {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  }
});
