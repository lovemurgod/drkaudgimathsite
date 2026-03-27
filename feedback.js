document.addEventListener('DOMContentLoaded', () => {
  const i18n = window.siteI18n;

  function translate(key, fallback, vars) {
    if (!i18n || typeof i18n.t !== 'function') {
      return fallback;
    }

    const translated = i18n.t(key, vars);
    return translated === key ? fallback : translated;
  }

  const form = document.getElementById('feedback-form');
  const messageElement = document.getElementById('feedback-form-message');
  const preferredLanguageInput = document.getElementById('preferred_language');
  const followUpRequestedInput = document.getElementById('follow_up_requested');
  const respondentPhoneInput = document.getElementById('respondent_phone');

  const ratingFields = [
    'doctor_care_rating',
    'staff_helpfulness_rating',
    'reception_rating',
    'waiting_time_rating',
    'cleanliness_rating',
    'overall_confidence_rating',
    'language_clarity_rating',
    'wayfinding_rating'
  ];

  const supabaseClient =
    (window.supabaseClient && typeof window.supabaseClient.from === 'function' && window.supabaseClient) ||
    (window.supabase && typeof window.supabase.from === 'function' && window.supabase) ||
    (window.supabase && window.supabase.client && typeof window.supabase.client.from === 'function' && window.supabase.client) ||
    null;

  if (!form) {
    return;
  }

  if (!supabaseClient) {
    showMessage(translate('feedback.initError', 'Unable to initialize feedback service. Please try again later.'), 'error');
    return;
  }

  setPreferredLanguage();
  window.addEventListener('app:language-changed', setPreferredLanguage);
  form.addEventListener('submit', handleSubmit);

  async function handleSubmit(event) {
    event.preventDefault();
    showMessage('');

    const formData = new FormData(form);
    const payload = {
      respondent_type: getTextValue(formData, 'respondent_type'),
      visit_timing: getTextValue(formData, 'visit_timing'),
      visit_type: getTextValue(formData, 'visit_type'),
      service_area: getTextValue(formData, 'service_area'),
      preferred_language: getTextValue(formData, 'preferred_language'),
      doctor_care_rating: getRatingValue(formData, 'doctor_care_rating'),
      staff_helpfulness_rating: getRatingValue(formData, 'staff_helpfulness_rating'),
      reception_rating: getRatingValue(formData, 'reception_rating'),
      waiting_time_rating: getRatingValue(formData, 'waiting_time_rating'),
      cleanliness_rating: getRatingValue(formData, 'cleanliness_rating'),
      overall_confidence_rating: getRatingValue(formData, 'overall_confidence_rating'),
      language_clarity_rating: getRatingValue(formData, 'language_clarity_rating'),
      wayfinding_rating: getRatingValue(formData, 'wayfinding_rating'),
      accessibility_support: getTextValue(formData, 'accessibility_support'),
      would_recommend: getTextValue(formData, 'would_recommend'),
      what_went_well: getOptionalTextValue(formData, 'what_went_well'),
      improvement_priority: getOptionalTextValue(formData, 'improvement_priority'),
      follow_up_requested: Boolean(formData.get('follow_up_requested')),
      respondent_name: getOptionalTextValue(formData, 'respondent_name'),
      respondent_phone: getOptionalTextValue(formData, 'respondent_phone')
    };

    if (!isPayloadValid(payload)) {
      showMessage(translate('feedback.requiredFieldsError', 'Please answer all required questions before submitting.'), 'error');
      return;
    }

    if (payload.follow_up_requested && !payload.respondent_phone) {
      if (respondentPhoneInput) {
        respondentPhoneInput.focus();
      }
      showMessage(translate('feedback.followUpPhoneRequired', 'Please add a phone number if you want a follow-up call.'), 'error');
      return;
    }

    try {
      const { error } = await supabaseClient.from('patient_feedback').insert(payload);

      if (error) {
        throw error;
      }

      form.reset();
      setPreferredLanguage();
      showMessage(translate('feedback.success', 'Thank you. Your feedback has been submitted successfully.'), 'success');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error submitting patient feedback:', error);
      showMessage(translate('feedback.submitError', 'Something went wrong while submitting your feedback. Please try again.'), 'error');
    }
  }

  function setPreferredLanguage() {
    if (!preferredLanguageInput || !i18n || typeof i18n.getLanguage !== 'function') {
      return;
    }

    const currentLanguage = i18n.getLanguage();
    const supportedValue = ['en', 'hi', 'kn'].includes(currentLanguage) ? currentLanguage : 'other';
    preferredLanguageInput.value = supportedValue;
  }

  function isPayloadValid(payload) {
    const requiredTextFields = [
      'respondent_type',
      'visit_timing',
      'visit_type',
      'service_area',
      'preferred_language',
      'accessibility_support',
      'would_recommend'
    ];

    const hasRequiredText = requiredTextFields.every((fieldName) => Boolean(payload[fieldName]));
    const hasRatings = ratingFields.every((fieldName) => Number.isInteger(payload[fieldName]) && payload[fieldName] >= 1 && payload[fieldName] <= 5);

    return hasRequiredText && hasRatings;
  }

  function getTextValue(formData, key) {
    return String(formData.get(key) || '').trim();
  }

  function getOptionalTextValue(formData, key) {
    const value = String(formData.get(key) || '').trim();
    return value || null;
  }

  function getRatingValue(formData, key) {
    const rawValue = String(formData.get(key) || '').trim();
    const numericValue = Number(rawValue);
    return Number.isInteger(numericValue) ? numericValue : NaN;
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
});