// tests/units/opening-hours.test.ts
import { describe, it, expect } from 'vitest'

function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0
  const [hStr, mStr] = timeStr.split(':')
  const hours = parseInt(hStr || '0', 10)
  const minutes = parseInt(mStr || '0', 10)
  return hours * 60 + minutes
}

function checkIsOpen(now: Date, openingHours?: { open: string; close: string }): boolean {
  if (!openingHours?.open || !openingHours?.close) return true

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMin = parseTimeToMinutes(openingHours.open)
  const closeMin = parseTimeToMinutes(openingHours.close)

  // Horário normal diurno (ex: 08:00 às 18:00)
  if (closeMin >= openMin) {
    return currentMinutes >= openMin && currentMinutes <= closeMin
  }

  // Horário noturno que passa da meia-noite (ex: 18:00 às 03:00)
  return currentMinutes >= openMin || currentMinutes <= closeMin
}

describe('Unit: Regra de Cálculo de Horário Aberto / Fechado', () => {
  it('deve retornar true para horário diurno quando dentro do expediente', () => {
    const hours = { open: '08:00', close: '18:00' }
    const noon = new Date(2026, 7, 22, 12, 0) // 12:00

    expect(checkIsOpen(noon, hours)).toBe(true)
  })

  it('deve retornar false para horário diurno fora do expediente', () => {
    const hours = { open: '08:00', close: '18:00' }
    const night = new Date(2026, 7, 22, 21, 0) // 21:00

    expect(checkIsOpen(night, hours)).toBe(false)
  })

  it('deve calcular corretamente horários noturnos que passam da meia-noite (ex: 18:00 às 03:00)', () => {
    const hours = { open: '18:00', close: '03:00' }

    const evening = new Date(2026, 7, 22, 22, 30) // 22:30 -> Aberto
    const dawn = new Date(2026, 7, 22, 1, 30)     // 01:30 -> Aberto
    const morning = new Date(2026, 7, 22, 10, 0)  // 10:00 -> Fechado

    expect(checkIsOpen(evening, hours)).toBe(true)
    expect(checkIsOpen(dawn, hours)).toBe(true)
    expect(checkIsOpen(morning, hours)).toBe(false)
  })
})