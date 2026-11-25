// Starts Plausible on a landing page. build.mjs adds this script, the tracker and the
// <meta name="plausible-domain"> only when PLAUSIBLE_WWW_DOMAIN is set (the prod deploy).
import { init } from './plausible.js'
import { plausibleConfig } from './analytics-config.mjs'

const config = plausibleConfig(document.querySelector('meta[name="plausible-domain"]')?.content)
if (config) init(config)
