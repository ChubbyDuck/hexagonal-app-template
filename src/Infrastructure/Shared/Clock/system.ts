import type { Clock } from '~/Core/Shared/Ports/Clock';

export const createSystemClock = (): Clock => ({
  now: () => new Date(),
});
