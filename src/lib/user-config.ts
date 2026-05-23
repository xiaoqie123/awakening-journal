import { UserConfig } from './types';
import { readJson, writeJson, fileExists } from './storage';

function configPath(userId: string) { return `data/users/${userId}/user-config.json`; }

const defaultConfig: UserConfig = {
  restDaysUsed: 0,
  restDaysResetMonth: '',
  restDays: [],
};

export async function getUserConfig(userId: string): Promise<UserConfig> {
  const p = configPath(userId);
  if (!(await fileExists(p))) {
    await writeJson(p, defaultConfig);
    return { ...defaultConfig };
  }
  return readJson<UserConfig>(p);
}

export async function updateUserConfig(userId: string, updates: Partial<UserConfig>): Promise<UserConfig> {
  const current = await getUserConfig(userId);
  const updated = { ...current, ...updates };
  await writeJson(configPath(userId), updated);
  return updated;
}

export async function getAvailableRestDays(userId: string): Promise<number> {
  const config = await getUserConfig(userId);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (config.restDaysResetMonth !== currentMonth) {
    await updateUserConfig(userId, {
      restDaysUsed: 0,
      restDaysResetMonth: currentMonth,
      restDays: [],
    });
    return 2;
  }

  return Math.max(0, 2 - config.restDaysUsed);
}
