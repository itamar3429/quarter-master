import { accessEnums } from '@/constants';
import type { TRole } from '@/services/types';
import { useAuthStore } from '@/stores/authStore';

export function isAllowedFor(allowRole: TRole) {
  const role = useAuthStore().tokenData?.role;
  if (!role) return false;
  return accessEnums[role] <= accessEnums[allowRole];
}
