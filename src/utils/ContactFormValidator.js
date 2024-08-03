// noinspection CommaExpressionJS
class ContactFormValidator {
    static PATTERN_SURNAME = /^[a-züöäßáéíóàèìòêîô '-]+$/i
    static PATTERN_EMAIL = /^[a-z\d._%+-]+@[a-z\d._%+-]+\.[a-z]{2,}$/i
    static PATTERN_MESSAGE = /^.{2,500}$/

    label

    constructor(label) {
        this.label = label
    }

    validate(formData) {
        [formData.surname.error, formData.surname.errorMessage] = this.validateRequired(
            formData.surname.value, ContactFormValidator.PATTERN_SURNAME, this.label('form_error_invalid_surname'))
        [formData.email.error, formData.email.errorMessage] = this.validateRequired(
            formData.email.value, ContactFormValidator.PATTERN_EMAIL, this.label('form_error_invalid_email'))
        [formData.message.error, formData.message.errorMessage] = this.validateRequired(
            formData.message.value, ContactFormValidator.PATTERN_MESSAGE, this.label('form_error_invalid_message'))
        formData.privacy.error = false
        formData.error = formData.surname.error
            || formData.email.error
            || formData.message.error
        return formData
    }

    validatePrivacy(formData) {
        formData.privacy.error = !formData.privacy.value
        formData.privacy.errorMessage = formData.privacy.error ? this.label('form_error_missing_privacy_consent') : ''
        formData.error = formData.error || formData.privacy.error
        return formData
    }

    validateRequired(value, pattern, errorMessage) {
        if (!value || value.trim().length === 0) {
            return [true, this.label('form_error_empty')]
        }
        if (pattern && !pattern.test(value)) {
            return [true, errorMessage || this.label('form_error_invalid')]
        }
        return [false, '']
    }
}

export { ContactFormValidator }
