import { UserConfig } from './types';
import { readJson, writeJson, fileExists } from './storage';

const CONFIG_PATH = 'data/user-config.json';

const defaultConfig: UserConfig = {
  restDaysUsed: 0,
  restDaysResetMonth: '',
  restDays: [],
};

export async function getUserConfig(): Promise<UserConfig> {
  if (!(await fileExists(CONFIG_PATH))) {
    await writeJson(CONFIG_PATH, defaultConfig);
    return { ...defaultConfig };
  }
  return readJson<UserConfig>(CONFIG_PATH);
}

export async function updateUserConfig(updates: Partial<UserConfig>): Promise<UserConfig> {
  const current = await getUserConfig();
  const updated = { ...current, ...updates };
  await writeJson(CONFIG_PATH, updated);
  return updated;
}

/** Reset rest days counter if month changed */
export async function getAvailableRestDays(): Promise<number> {
  const config = await getUserConfig();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (config.restDaysResetMonth !== currentMonth) {
    await updateUserConfig({
      restDaysUsed: 0,
      restDaysResetMonth: currentMonth,
      restDays: [],
    });
    return 2; // max 2 rest days per month
  }

  return Math.max(0, 2 - config.restDaysUsed);
}
