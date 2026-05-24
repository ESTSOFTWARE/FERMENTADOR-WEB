export interface PhoneInputProps {
  dialCode:    string
  phoneNumber: string
  onChange:    (dialCode: string, phoneNumber: string) => void
  disabled?:   boolean
}
