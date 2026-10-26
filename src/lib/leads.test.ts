import { describe, it, expect } from 'vitest'
import { normalisePhone, validateLead } from './leads'

describe('normalisePhone', () => {
  it('accepts 10-digit Indian mobiles with common prefixes and spacing', () => {
    expect(normalisePhone('9998117531')).toBe('9998117531')
    expect(normalisePhone('+91 99981 17531')).toBe('9998117531')
    expect(normalisePhone('919998117531')).toBe('9998117531')
    expect(normalisePhone('09998117531')).toBe('9998117531')
    expect(normalisePhone('99981-17531')).toBe('9998117531')
  })
  it('rejects numbers that are not valid mobiles', () => {
    expect(normalisePhone('12345')).toBeNull()
    expect(normalisePhone('5998117531')).toBeNull() // must start 6-9
    expect(normalisePhone('99981175311')).toBeNull()
    expect(normalisePhone('abcdefghij')).toBeNull()
  })
})

describe('validateLead', () => {
  const ok = { name: 'Asha Patel', phone: '9998117531', email: '' }

  it('passes with name and phone, email optional', () => {
    expect(validateLead(ok)).toEqual({})
    expect(validateLead({ ...ok, email: 'asha@example.com' })).toEqual({})
  })
  it('requires name and phone', () => {
    const errs = validateLead({ name: ' ', phone: '', email: '' })
    expect(errs.name).toBeTruthy()
    expect(errs.phone).toBeTruthy()
    expect(errs.email).toBeUndefined()
  })
  it('flags a malformed email only when one is given', () => {
    expect(validateLead({ ...ok, email: 'not-an-email' }).email).toBeTruthy()
  })
  it('requires email only for forms that request it', () => {
    expect(validateLead(ok, { requireEmail: true }).email).toBeTruthy()
    expect(validateLead({ ...ok, email: 'asha@example.com' }, { requireEmail: true })).toEqual({})
    expect(validateLead({ ...ok, email: 'invalid' }, { requireEmail: true }).email).toBeTruthy()
    expect(validateLead(ok)).toEqual({})
  })

})
