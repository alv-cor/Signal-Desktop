// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { join } from 'path';
import { writeFileSync } from 'fs';

import { DAY } from '../util/durations';
import { version } from '../../package.json';
import { isNotUpdatable } from '../util/version';

const unixTimestamp = Date.now();
const buildCreation = unixTimestamp * 1000;

// NB: Build expirations are also determined via users' auto-update settings; see
// getExpirationTimestamp
const validDuration = isNotUpdatable(version) ? DAY * 30 : DAY * 90;
const buildExpiration = buildCreation + validDuration;

const localProductionPath = join(
  __dirname,
  '../../config/local-production.json'
);

const localProductionConfig = {
  buildCreation,
  buildExpiration,
  ...(isNotUpdatable(version) ? { updatesEnabled: false } : {}),
};

writeFileSync(
  localProductionPath,
  `${JSON.stringify(localProductionConfig)}\n`
);
