import type { Clock } from '~/Core/Shared/Ports/Clock';

export const createFakeClock = (at: Date = new Date('2026-01-01T00:00:00Z')): Clock => ({
  now: () => new Date(at),
});
